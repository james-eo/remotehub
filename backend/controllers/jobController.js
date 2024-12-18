import axios from "axios";
import sanitizeHtml from "sanitize-html";
import Job from "../models/jobModel.js";
import dotenv from "dotenv";
import winston from "winston";

dotenv.config();

// Configure logger
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
  allowedTags: [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "ul",
    "ol",
    "li",
    "a",
    "strong",
    "em",
    "br",
  ],
  allowedAttributes: {
    a: ["href"],
  },
};

// Helper function to convert HTML to structured JSON
const htmlToJson = (html) => {
  try {
    // First sanitize the HTML
    const sanitizedHtml = sanitizeHtml(html, sanitizeOptions);

    // Create a temporary DOM element to parse the HTML
    const temp = document.createElement("div");
    temp.innerHTML = sanitizedHtml;

    // Function to convert DOM element to JSON structure
    const elementToJson = (element) => {
      // Handle text nodes
      if (element.nodeType === 3) {
        const text = element.textContent.trim();
        return text ? text : null;
      }

      // Handle element nodes
      if (element.nodeType === 1) {
        const result = {
          type: element.nodeName.toLowerCase(),
          children: [],
        };

        // Add attributes if any
        const attrs = {};
        Array.from(element.attributes).forEach((attr) => {
          attrs[attr.name] = attr.value;
        });
        if (Object.keys(attrs).length > 0) {
          result.attributes = attrs;
        }

        // Add children
        element.childNodes.forEach((child) => {
          const childJson = elementToJson(child);
          if (childJson !== null) {
            result.children.push(childJson);
          }
        });

        return result;
      }

      return null;
    };

    // Convert all child nodes
    return Array.from(temp.childNodes)
      .map((node) => elementToJson(node))
      .filter((node) => node !== null);
  } catch (error) {
    logger.error("Error converting HTML to JSON:", error);
    // Return simple text version as fallback
    return [
      {
        type: "p",
        children: [
          sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }),
        ],
      },
    ];
  }
};

// Helper function to determine job type
const jobTypeMap = {
  "full-time": ["full-time", "full time", "fulltime", "full_time"],
  "part-time": ["part-time", "part time", "parttime", "part_time"],
  contract: ["contract", "freelance", "contractor"],
  internship: ["internship", "intern"],
};

const determineJobType = (jobType) => {
  if (!jobType) return "Full-time";

  jobType = jobType.toLowerCase();
  for (const [type, keywords] of Object.entries(jobTypeMap)) {
    if (keywords.some((keyword) => jobType.includes(keyword))) {
      return type.charAt(0).toUpperCase() + type.slice(1);
    }
  }
  return "Full-time";
};

export const fetchAndStoreJobs = async () => {
  try {
    let page = 1;
    let hasMoreJobs = true;
    const limit = parseInt(process.env.API_LIMIT) || 3000;
    const MAX_PAGES = parseInt(process.env.MAX_PAGES) || 100;
    const API_URL =
      process.env.REMOTIVE_API_URL || "https://remotive.com/api/remote-jobs";
    const RATE_LIMIT_DELAY = parseInt(process.env.RATE_LIMIT_DELAY) || 1000;

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
            // Parse description into JSON structure
            const descriptionJson = htmlToJson(job.description);

            // Create plain text excerpt
            const plainTextExcerpt = sanitizeHtml(job.description, {
              allowedTags: [],
              allowedAttributes: {},
            }).substring(0, 255);

            // Parse salary information
            const salaryInfo = Job.parseSalaryString(job.salary);

            const newJob = new Job({
              sourceId: job.id.toString(),
              sourceUrl: job.url,
              title: job.title,
              company: {
                name: job.company_name,
                logo: job.company_logo_url,
              },
              description: descriptionJson,
              excerpt: plainTextExcerpt,
              salary: {
                min: salaryInfo.min,
                max: salaryInfo.max,
                currency: "USD",
                raw: salaryInfo.raw,
                benefits: salaryInfo.benefits,
              },
              location: job.candidate_required_location || "Remote",
              remote: true,
              jobType: determineJobType(job.job_type),
              category: job.category,
              tags: job.tags || [],
              publishedAt: new Date(job.publication_date),
              source: "Remotive",
            });

            await newJob.save();
            logger.info(`Saved job: ${newJob.title}`);
          }
        }

        page++;
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
        page++;
      }
    }

    logger.info("Job fetching and storing completed");
  } catch (error) {
    logger.error("Fatal error in fetchAndStoreJobs:", error);
  }
};

export const getJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    // Search functionality
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { "company.name": { $regex: req.query.search, $options: "i" } },
        { "salary.raw": { $regex: req.query.search, $options: "i" } },
      ];
    }

    // Filters
    if (req.query.location) {
      filter.location = { $regex: req.query.location, $options: "i" };
    }
    if (req.query.jobType) {
      filter.jobType = { $in: req.query.jobType.split(",") };
    }
    if (req.query.category) {
      filter.category = { $regex: req.query.category, $options: "i" };
    }
    if (req.query.tags) {
      filter.tags = { $in: req.query.tags.split(",") };
    }

    // Salary filter
    if (req.query.salaryMin || req.query.salaryMax) {
      filter.salary = {};
      if (req.query.salaryMin) {
        filter.salary.min = { $gte: parseInt(req.query.salaryMin) };
      }
      if (req.query.salaryMax) {
        filter.salary.max = { $lte: parseInt(req.query.salaryMax) };
      }
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
