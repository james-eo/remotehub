import Job from "../models/jobModel.js";
import JobType from "../models/jobTypeModel.js";
import ErrorResponse from "../utils/errorResponse.js";

// Create job
export const createJob = async (req, res, next) => {
  try {
    const job = await Job.create({
      title: req.body.title,
      description: req.body.description,
      salary: req.body.salary,
      location: req.body.location,
      jobType: req.body.jobType,
      user: req.user.id,
    });
    res.status(201).json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
};

// Single job
export const singleJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
};

// Update job by id
export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.job_id, req.body, {
      new: true,
    })
      .populate("jobType", "jobTypeName")
      .populate("user", "firstName lastName");
    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
};

// Show jobs
export const showJobs = async (req, res, next) => {
  // Enable search
  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  // Filter jobs by category ids
  let ids = [];
  const jobTypeCategory = await JobType.find({}, { _id: 1 });
  jobTypeCategory.forEach((cat) => {
    ids.push(cat._id);
  });

  let cat = req.query.cat;
  let categ = cat !== "" ? cat : ids;

  //jobs by location
  let locations = [];
  const jobByLocation = await Job.find({}, { location: 1 });
  jobByLocation.forEach((val) => {
    locations.push(val.location);
  });
  let setUniqueLocation = [...new Set(locations)];
  let location = req.query.location;
  let locationFilter = location !== "" ? location : setUniqueLocation;

  // Enable pagination
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;
  const count = await Job.find({
    ...keyword,
    jobType: categ,
    location: locationFilter,
  }).countDocuments();

  try {
    const jobs = await Job.find({
      ...keyword,
      jobType: categ,
      location: locationFilter,
    })
      .sort({ createdAt: -1 })
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    res.status(200).json({
      success: true,
      jobs,
      page,
      pages: Math.ceil(count / pageSize),
      count,
      setUniqueLocation,
    });
  } catch (error) {
    next(error);
  }
};

// import Job from "../models/jobModel.js";
// import JobType from "../models/jobTypeModel.js";
// import ErrorResponse from "../utils/errorResponse.js";

// // Create job (used for manual job creation)
// export const createJob = async (req, res, next) => {
//   try {
//     const job = await Job.create({
//       title: req.body.title,
//       description: req.body.description,
//       salaryRange: {
//         min: req.body.salaryMin || null,
//         max: req.body.salaryMax || null,
//       },
//       location: req.body.location || "Remote", // Default to remote
//       timezone: req.body.timezone || null, // Optional timezone
//       jobType: req.body.jobType || null,
//       user: req.user ? req.user.id : null, // Optional if coming from API
//       category: req.body.category || null,
//       employmentType: req.body.employmentType || null,
//       experienceLevel: req.body.experienceLevel || null,
//       remote: true, // Always true for remote jobs
//       skills: req.body.skills || [],
//       company: req.body.company || null,
//       benefits: req.body.benefits || [],
//       source: req.body.source || "manual", // Default to 'manual' if created directly
//       additionalInfo: req.body.additionalInfo || {}, // Additional data
//     });

//     res.status(201).json({
//       success: true,
//       job,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // Create job from external source (scraping or API)
// export const createJobFromExternalSource = async (jobData, source) => {
//   try {
//     const job = await Job.create({
//       title: jobData.title || "Untitled Job",
//       description: jobData.description || "No description provided",
//       salaryRange: {
//         min: jobData.salaryMin || null,
//         max: jobData.salaryMax || null,
//       },
//       location: jobData.location || "Remote", // Default to remote
//       timezone: jobData.timezone || null, // Optional timezone
//       jobType: jobData.jobType || null,
//       user: null, // No user since this comes from external source
//       category: jobData.category || null,
//       employmentType: jobData.employmentType || null,
//       experienceLevel: jobData.experienceLevel || null,
//       remote: true, // Always true for remote jobs
//       skills: jobData.skills || [],
//       company: jobData.company || "Unknown company",
//       benefits: jobData.benefits || [],
//       source: source, // Specify the source (e.g., LinkedIn, Indeed)
//       additionalInfo: jobData.additionalInfo || {}, // Store extra data
//     });

//     return job; // Return job object for further processing
//   } catch (error) {
//     console.error(`Error creating job from external source: ${error.message}`);
//     throw new Error(error);
//   }
// };

// // Get single job by ID
// export const singleJob = async (req, res, next) => {
//   try {
//     const job = await Job.findById(req.params.id)
//       .populate("jobType", "jobTypeName")
//       .populate("user", "firstName lastName");

//     if (!job) {
//       return next(new ErrorResponse("Job not found", 404));
//     }

//     res.status(200).json({
//       success: true,
//       job,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // Update job by ID
// export const updateJob = async (req, res, next) => {
//   try {
//     const updatedData = {
//       ...req.body,
//       salaryRange: {
//         min: req.body.salaryMin || null,
//         max: req.body.salaryMax || null,
//       },
//       location: req.body.location || "Remote", // Default to Remote
//       remote: true, // Always true for remote jobs
//     };

//     const job = await Job.findByIdAndUpdate(req.params.job_id, updatedData, {
//       new: true,
//     })
//       .populate("jobType", "jobTypeName")
//       .populate("user", "firstName lastName");

//     if (!job) {
//       return next(new ErrorResponse("Job not found", 404));
//     }

//     res.status(200).json({
//       success: true,
//       job,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // Show all jobs with filters, search, and pagination
// export const showJobs = async (req, res, next) => {
//   const keyword = req.query.keyword
//     ? {
//         title: {
//           $regex: req.query.keyword,
//           $options: "i",
//         },
//       }
//     : {};

//   let ids = [];
//   const jobTypeCategory = await JobType.find({}, { _id: 1 });
//   jobTypeCategory.forEach((cat) => {
//     ids.push(cat._id);
//   });

//   let cat = req.query.cat;
//   let categ = cat !== "" ? cat : ids;

//   const pageSize = 5;
//   const page = Number(req.query.pageNumber) || 1;
//   const count = await Job.find({ ...keyword, jobType: categ }).countDocuments();

//   try {
//     const jobs = await Job.find({ ...keyword, jobType: categ })
//       .skip(pageSize * (page - 1))
//       .limit(pageSize)
//       .populate("jobType", "jobTypeName")
//       .populate("user", "firstName lastName");

//     res.status(200).json({
//       success: true,
//       jobs,
//       page,
//       pages: Math.ceil(count / pageSize),
//       count,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
