import axios from "axios";
import sanitizeHtml from "sanitize-html";
import Job from "../models/jobModel.js";

// Helper functions
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

// Sanitize HTML descriptions
const sanitizeDescription = (description) => {
  return sanitizeHtml(description, {
    allowedTags: [],
    allowedAttributes: {},
  });
};

// Normalize job data based on source
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
        description: sanitizeDescription(job.description),
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
        description: sanitizeDescription(job.description),
        salary: {
          min: job.annualSalaryMin,
          max: job.annualSalaryMax,
          currency: job.salaryCurrency,
        },
        location: job.jobGeo,
        jobType: job.jobType,
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
        description: sanitizeDescription(job.description),
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

// Fetch jobs from external APIs
export const fetchAndStoreJobs = async () => {
  const apis = [
    {
      url: "https://himalayas.app/jobs/api",
      source: "Himalayas",
    },
    // Add other API endpoints as needed
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
      console.log(`Normalized job data for ${normalizedJob.title}`);

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

    await delay(5000); // Pause between API requests
  }
};
