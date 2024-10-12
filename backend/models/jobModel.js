// models/jobModel.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const jobSchema = new Schema(
  {
    sourceId: {
      type: String,
      required: true,
      unique: true,
    },
    sourceUrl: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    company: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      logo: {
        type: String,
        trim: true,
      },
    },
    description: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      maxlength: 255,
    },
    salary: {
      min: {
        type: Number,
      },
      max: {
        type: Number,
      },
      currency: {
        type: String,
        maxlength: 3,
      },
    },
    location: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      required: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    experienceLevel: {
      type: String,
      trim: true,
    },
    visaSponsorship: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      required: true,
    },
    source: {
      type: String,
      required: true,
      enum: ["Arbeitnow", "Himalayas", "Remotive", "Jobicy"],
    },
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", description: "text", "company.name": "text" });

export default mongoose.model("Job", jobSchema);
