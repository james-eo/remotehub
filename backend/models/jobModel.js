import mongoose from "mongoose";
const { Schema } = mongoose;

// Schema for the description content structure
const contentSchema = new Schema(
  {
    type: String,
    attributes: {
      type: Map,
      of: String,
    },
    children: [
      {
        type: Schema.Types.Mixed,
      },
    ],
  },
  { _id: false }
);

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
      type: [contentSchema], // Change to array of content objects
      required: true,
    },
    excerpt: {
      type: String,
      maxlength: 255,
    },
    salary: {
      min: {
        type: Number,
        default: null,
      },
      max: {
        type: Number,
        default: null,
      },
      currency: {
        type: String,
        maxlength: 3,
        default: "USD",
      },
      raw: {
        type: String, // Store the original salary string
        default: "",
      },
      benefits: {
        type: [String], // Array to store parsed benefits
        default: [],
      },
    },
    location: {
      type: String,
      required: true,
    },
    remote: {
      type: Boolean,
      default: false,
    },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      required: true,
    },
    category: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    publishedAt: {
      type: Date,
      required: true,
    },
    source: {
      type: String,
      required: true,
      enum: ["Remotive", "Arbeitnow", "Himalayas", "Jobicy"],
    },
  },
  { timestamps: true }
);

// Update text index to include new fields
jobSchema.index({
  title: "text",
  "company.name": "text",
  "salary.raw": "text",
  excerpt: "text",
});

// Helper method to parse salary string into structured data
jobSchema.statics.parseSalaryString = function (salaryString) {
  if (!salaryString) {
    return {
      min: null,
      max: null,
      raw: "",
      benefits: [],
    };
  }

  // Store the original string
  const result = {
    min: null,
    max: null,
    raw: salaryString,
    benefits: [],
  };

  // Try to extract numeric values for salary range
  const numbers = salaryString.match(/\d+(?:,\d+)*(?:\.\d+)?/g);
  if (numbers) {
    const numericValues = numbers.map((n) => parseFloat(n.replace(/,/g, "")));
    if (numericValues.length === 1) {
      result.min = result.max = numericValues[0];
    } else if (numericValues.length >= 2) {
      result.min = Math.min(...numericValues);
      result.max = Math.max(...numericValues);
    }
  }

  // Extract benefits (words/phrases after commas)
  const benefitsMatch = salaryString.split(",").slice(1);
  if (benefitsMatch) {
    result.benefits = benefitsMatch
      .map((benefit) => benefit.trim())
      .filter((benefit) => benefit.length > 0);
  }

  return result;
};

export default mongoose.model("Job", jobSchema);

// import mongoose from "mongoose";

// const { Schema } = mongoose;

// const jobSchema = new Schema(
//   {
//     sourceId: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     sourceUrl: {
//       type: String,
//       required: true,
//     },
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//       maxlength: 200,
//     },
//     company: {
//       name: {
//         type: String,
//         required: true,
//         trim: true,
//       },
//       logo: {
//         type: String,
//         trim: true,
//       },
//     },
//     description: {
//       type: String,
//       required: true,
//     },
//     excerpt: {
//       type: String,
//       maxlength: 255,
//     },
//     salary: {
//       min: {
//         type: Number,
//       },
//       max: {
//         type: Number,
//       },
//       currency: {
//         type: String,
//         maxlength: 3,
//       },
//     },
//     location: {
//       type: String,
//       required: true,
//     },
//     remote: {
//       type: Boolean,
//       default: false,
//     },
//     jobType: {
//       type: String,
//       enum: [
//         "Full-time",
//         "Part-time",
//         "Contract",
//         "Internship",
//         "professional / experienced",
//         "executive",
//         "berufserfahren",
//         "teamleitung",
//       ],
//       required: true,
//     },
//     industry: {
//       type: String,
//       trim: true,
//     },
//     experienceLevel: {
//       type: String,
//       trim: true,
//     },
//     visaSponsorship: {
//       type: Boolean,
//       default: false,
//     },
//     publishedAt: {
//       type: Date,
//       required: true,
//     },
//     source: {
//       type: String,
//       required: true,
//       enum: ["Arbeitnow", "Himalayas", "Remotive", "Jobicy"],
//     },
//   },
//   { timestamps: true }
// );

// jobSchema.index({ title: "text", description: "text", "company.name": "text" });

// export default mongoose.model("Job", jobSchema);
