import axios from "axios";
import sanitizeHtml from "sanitize-html";
import Job from "../models/jobModel.js";
import dotenv from "dotenv";
import winston from "winston";

dotenv.config();

//Configure logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// Sanitization options
const sanitizeOptions = {
  allowedTags: [],
  allowedAttributes: {},
};

// Helper function to convert salary string to number
const parseSalary = (salaryString) => {
  if (!salaryString) return { min: null, max: null };

  const numbers = salaryString.match(/\d+/g);
  if (!numbers) return { min: null, max: null };

  if (numbers.length === 1) {
    return { min: parseInt(numbers[0], 10), max: parseInt(numbers[0], 10) };
  } else if (numbers.length >= 2) {
    return { min: parseInt(numbers[0], 10), max: parseInt(numbers[1], 10) };
  }

  return { min: null, max: null };
};

// Helper function to determine job type
const jobTypeMap = {
  "full-time": ["full-time", "full time", "fulltime"],
  "part-time": ["part-time", "part time", "parttime"],
  contract: ["contract", "freelance"],
  internship: ["internship", "intern"],
};

const determineJobType = (jobType) => {
  if (!jobType) return "Full-time"; // Default to full-time if no job type provided

  jobType = jobType.toLowerCase();
  for (const [type, keywords] of Object.entries(jobTypeMap)) {
    if (keywords.some((keyword) => jobType.includes(keyword))) {
      return type.charAt(0).toUpperCase() + type.slice(1);
    }
  }
  return "Full-time"; // Default to full-time if no match
};

export const fetchAndStoreJobs = async () => {
  try {
    let page = 1;
    let hasMoreJobs = true;
    const limit = parseInt(process.env.API_LIMIT) || 100; // Use environment variable or default to 5000
    const MAX_PAGES = parseInt(process.env.MAX_PAGES) || 100; // Use environment variable or default to 100
    const API_URL =
      process.env.REMOTIVE_API_URL || "https://remotive.com/api/remote-jobs";
    const RATE_LIMIT_DELAY = parseInt(process.env.RATE_LIMIT_DELAY) || 1000; // Use environment variable or default to 1 second

    while (hasMoreJobs && page <= MAX_PAGES) {
      try {
        const response = await axios.get(API_URL, {
          params: { limit, page },
        });

        const jobs = response.data.jobs;

        if (jobs.length === 0) {
          hasMoreJobs = false;
          break;
        }

        for (const job of jobs) {
          if (!job.title || !job.company_name) {
            logger.warn(
              `Skipping job due to missing required fields: ${job.id}`
            );
            continue;
          }

          const existingJob = await Job.findOne({
            sourceId: job.id.toString(),
          });

          if (!existingJob) {
            const salary = parseSalary(job.salary);
            const newJob = new Job({
              sourceId: job.id.toString(),
              sourceUrl: job.url,
              title: job.title,
              company: {
                name: job.company_name,
                logo: job.company_logo_url,
              },
              description: sanitizeHtml(job.description, sanitizeOptions),
              excerpt: sanitizeHtml(job.description, sanitizeOptions).substring(
                0,
                255
              ),
              salary: {
                min: salary.min,
                max: salary.max,
                currency: "USD", // Assuming USD, adjust if the API provides currency info
              },
              location: job.candidate_required_location || "Remote",
              remote: true, // Remotive only lists remote jobs
              jobType: determineJobType(job.job_type),
              industry: job.category,
              experienceLevel: "", // Not provided by Remotive API
              visaSponsorship: false, // Not provided by Remotive API
              publishedAt: new Date(job.publication_date),
              source: "Remotive",
            });

            await newJob.save();
            logger.info(`Saved job: ${newJob.title}`);
          }
        }

        page++;

        // Implement rate limiting
        await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_DELAY));
      } catch (error) {
        if (error.response) {
          logger.error(
            `API error on page ${page}: ${error.response.status} - ${error.response.data}`
          );
        } else if (error.request) {
          logger.error(`Network error on page ${page}:`, error.message);
        } else {
          logger.error(`Error on page ${page}:`, error.message);
        }
        // Continue to next page even if there's an error
        page++;
      }
    }

    logger.info("Job fetching and storing completed");
  } catch (error) {
    logger.error("Fatal error in fetchAndStoreJobs:", error);
  }
};

// Function to get jobs with pagination and filtering
export const getJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        // { "company.name": { $regex: req.query.search, $options: "i" } },
        // { description: { $regex: req.query.search, $options: "i" } },
      ];
    }
    if (req.query.location) {
      filter.location = { $regex: req.query.location, $options: "i" };
    }
    if (req.query.jobType) {
      filter.jobType = { $in: req.query.jobType.split(",") };
    }
    if (req.query.experienceLevel) {
      filter.experienceLevel = { $in: req.query.experienceLevel.split(",") };
    }
    if (req.query.salaryMin || req.query.salaryMax) {
      filter.salary = {};
      if (req.query.salaryMin)
        filter.salary.$gte = parseInt(req.query.salaryMin);
      if (req.query.salaryMax)
        filter.salary.$lte = parseInt(req.query.salaryMax);
    }

    const jobs = await Job.find(filter)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Job.countDocuments(filter);

    res.json({
      data: jobs,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalJobs: total,
    });
  } catch (error) {
    logger.error("Error in getJobs:", error);
    res.status(500).json({ message: "Error fetching jobs" });
  }
};

// Function to get a single job by ID
export const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    logger.error("Error in getJob:", error);
    res.status(500).json({ message: "Error fetching job" });
  }
};

// Function to get job suggestions for autocomplete
export const getJobSuggestions = async (req, res) => {
  try {
    const query = req.query.query;
    const suggestions = await Job.find({
      title: { $regex: query, $options: "i" },
    })
      .distinct("title")
      .limit(10);
    res.json(suggestions);
  } catch (error) {
    logger.error("Error in getJobSuggestions:", error);
    res.status(500).json({ message: "Error fetching job suggestions" });
  }
};

export default {
  fetchAndStoreJobs,
  getJobs,
  getJob,
  getJobSuggestions,
};
