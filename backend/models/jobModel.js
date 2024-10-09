import mongoose from "mongoose";

const { Schema } = mongoose;
const { ObjectId } = Schema;

const jobSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Title is required"],
      maxlength: 70,
    },

    description: {
      type: String,
      trim: true,
      required: [true, "Description is required"],
    },
    salary: {
      type: String,
      trim: true,
      required: [true, "Salary is required"],
    },
    location: {
      type: String,
    },
    available: {
      type: Boolean,
      default: true,
    },
    jobType: {
      type: ObjectId,
      ref: "JobType",
      required: true,
    },
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);

// import mongoose from "mongoose";
// const { Schema } = mongoose;
// const { ObjectId } = Schema;

// const jobSchema = new Schema(
//   {
//     title: {
//       type: String,
//       trim: true,
//       required: [true, "Title is required"],
//       maxlength: 70,
//     },
//     description: {
//       type: String,
//       trim: true,
//       required: [true, "Description is required"],
//     },
//     salaryRange: {
//       min: {
//         type: Number,
//         required: false, // Optional
//       },
//       max: {
//         type: Number,
//         required: false, // Optional
//       },
//     },
//     location: {
//       type: String,
//       default: "Remote", // Default to remote
//       required: false, // Optional for cases where it's missing
//     },
//     timezone: {
//       type: String,
//       required: false,
//     },
//     available: {
//       type: Boolean,
//       default: true,
//     },
//     jobType: {
//       type: ObjectId,
//       ref: "JobType",
//       required: false, // Make optional if missing from external data
//     },
//     user: {
//       type: ObjectId,
//       ref: "User",
//       required: false, // Optional if using external data
//     },
//     category: {
//       type: String,
//       required: false, // Optional
//     },
//     employmentType: {
//       type: String,
//       enum: ["Full-time", "Part-time", "Contract", "Temporary"],
//       required: false, // Optional
//     },
//     experienceLevel: {
//       type: String,
//       enum: ["Junior", "Mid", "Senior"],
//       required: false, // Optional
//     },
//     remote: {
//       type: Boolean,
//       default: true, // Always true for remote jobs
//       required: false,
//     },
//     skills: {
//       type: [String],
//       required: false, // Optional if missing
//     },
//     company: {
//       type: String,
//       required: false, // Optional if missing
//     },
//     benefits: {
//       type: [String],
//       required: false, // Optional if missing
//     },
//     source: {
//       type: String,
//       required: true, // Track the job source (e.g., LinkedIn, API)
//     },
//     additionalInfo: {
//       type: Map,
//       of: String, // Stores additional information not covered by schema
//       required: false,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Job", jobSchema);

// import mongoose from "mongoose";
// const { Schema } = mongoose;
// const { ObjectId } = Schema;

// const jobSchema = new Schema(
//   {
//     title: {
//       type: String,
//       trim: true,
//       required: [true, "Title is required"],
//       maxlength: 70,
//     },
//     description: {
//       type: String,
//       trim: true,
//       required: [true, "Description is required"],
//     },
//     salaryRange: {
//       min: {
//         type: Number,
//         required: true,
//       },
//       max: {
//         type: Number,
//         required: true,
//       },
//     },
//     location: {
//       type: String,
//       default: "Remote",
//       required: true,
//     },
//     timezone: {
//       type: String, // e.g., "UTC", "EST", "PST"
//       required: false,
//     },
//     available: {
//       type: Boolean,
//       default: true,
//     },
//     jobType: {
//       type: ObjectId,
//       ref: "JobType",
//       required: true,
//     },
//     user: {
//       type: ObjectId,
//       ref: "User",
//       required: true,
//     },
//     category: {
//       type: String,
//       required: [true, "Category is required"],
//     },
//     employmentType: {
//       type: String,
//       enum: ["Full-time", "Part-time", "Contract", "Intership"],
//       required: true,
//     },
//     applicationDeadline: {
//       type: Date,
//       required: false,
//     },
//     remote: {
//       type: Boolean,
//       default: true, // Always true for remote jobs
//       required: true,
//     },
//     skills: {
//       type: [String],
//       required: true,
//     },
//     company: {
//       type: String,
//       required: [true, "Company name is required"],
//     },
//     experienceLevel: {
//       type: String,
//       enum: ["Junior", "Mid-Level", "Senior"],
//       required: true,
//     },
//     benefits: {
//       type: [String],
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Job", jobSchema);
