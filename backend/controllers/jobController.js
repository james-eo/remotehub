import Job from "../models/jobModel.js";
import ErrorResponse from "../utils/errorResponse.js";
import axios from "axios";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const axiosInstance = axios.create({
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    Accept: "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9",
  },
});

const fetchWithRetry = async (url, retries = 3, backoff = 1000) => {
  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    if (retries > 0 && error.response && error.response.status === 403) {
      console.log(`Retrying in ${backoff}ms...`);
      await delay(backoff);
      return fetchWithRetry(url, retries - 1, backoff * 2);
    }
    throw error;
  }
};

const normalizeJobData = (job, source) => {
  const parseDate = (dateString) => {
    const parsed = new Date(dateString);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  switch (source) {
    case "Arbeitnow":
      return {
        sourceId: job.slug,
        sourceUrl: job.url,
        title: job.title,
        company: {
          name: job.company_name,
          logo: job.company_logo,
        },
        description: job.description,
        location: job.location,
        jobType: job.job_types[0] || "Full-time",
        visaSponsorship: job.visa_sponsorship,
        publishedAt: parseDate(job.created_at),
        source: "Arbeitnow",
      };
    case "Jobicy":
      return {
        sourceId: job.id,
        sourceUrl: job.url,
        title: job.jobTitle,
        company: {
          name: job.companyName,
          logo: job.companyLogo,
        },
        description: job.jobDescription,
        excerpt: job.jobExcerpt,
        salary: {
          min: job.annualSalaryMin,
          max: job.annualSalaryMax,
          currency: job.salaryCurrency,
        },
        location: job.jobGeo,
        jobType: job.jobType,
        industry: job.jobIndustry,
        experienceLevel: job.jobLevel,
        publishedAt: parseDate(job.pubDate),
        source: "Jobicy",
      };
    case "Himalayas":
      return {
        sourceId: job.id,
        sourceUrl: job.url,
        title: job.title,
        company: {
          name: job.companyName,
          logo: job.companyLogo,
        },
        description: job.description,
        location: job.location,
        jobType: job.type,
        salary: {
          min: job.salaryMin,
          max: job.salaryMax,
          currency: job.salaryCurrency,
        },
        publishedAt: parseDate(job.publishedAt),
        source: "Himalayas",
      };
    default:
      throw new Error(`Unknown job source: ${source}`);
  }
};

// Fetch jobs from external APIs and store them in the database
export const fetchAndStoreJobs = async (req, res, next) => {
  try {
    const apis = [
      {
        url: "https://himalayas.app/jobs/api",
        source: "Himalayas",
      },
    ];

    for (const api of apis) {
      console.log(`Fetching jobs from ${api.source}...`);
      const data = await fetchWithRetry(api.url);
      let jobs;

      if (api.source === "Himalayas") {
        jobs = data.jobs;
      } else {
        jobs = data.data || data;
      }

      if (!Array.isArray(jobs)) {
        console.error(`Invalid response from ${api.source} API:`, jobs);
        continue;
      }

      for (const job of jobs) {
        const normalizedJob = normalizeJobData(job, api.source);
        console.log(
          `Normalized job data for ${normalizedJob.title}:`,
          JSON.stringify(normalizedJob, null, 2)
        );

        try {
          await Job.findOneAndUpdate(
            { sourceId: normalizedJob.sourceId },
            normalizedJob,
            { upsert: true, new: true }
          );
        } catch (error) {
          console.error(`Error saving job ${normalizedJob.title}:`, error);
        }
      }

      await delay(5000);
    }

    if (res) {
      res.status(200).json({
        success: true,
        message: "Jobs fetched and stored successfully",
      });
    } else {
      console.log("Jobs fetched and stored successfully");
    }
  } catch (error) {
    console.error("Error fetching jobs:", error);
    if (next) {
      next(error);
    } else {
      throw error;
    }
  }
};

// Get all jobs with filtering and pagination
export const getJobs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const query = {};

    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    if (req.query.jobType) {
      query.jobType = req.query.jobType;
    }

    if (req.query.location) {
      query.location = { $regex: req.query.location, $options: "i" };
    }

    if (req.query.industry) {
      query.industry = { $regex: req.query.industry, $options: "i" };
    }

    if (req.query.experienceLevel) {
      query.experienceLevel = {
        $regex: req.query.experienceLevel,
        $options: "i",
      };
    }

    if (req.query.visaSponsorship) {
      query.visaSponsorship = req.query.visaSponsorship === "true";
    }

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .sort({ publishedAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single job
export const getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return next(new ErrorResponse("Job not found", 404));
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};
