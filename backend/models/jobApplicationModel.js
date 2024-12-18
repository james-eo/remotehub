import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "reviewed",
        "interviewing",
        "offered",
        "rejected",
        "accepted",
        "withdrawn",
      ],
      default: "pending",
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    resumeUrl: {
      type: String,
      required: true,
    },
    coverLetter: {
      type: String,
    },
    notes: {
      type: String,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    // Track interview stages
    interviews: [
      {
        stage: {
          type: String,
          enum: ["screening", "technical", "behavioral", "final"],
        },
        scheduledDate: Date,
        feedback: String,
        status: {
          type: String,
          enum: ["scheduled", "completed", "cancelled", "rescheduled"],
        },
      },
    ],
    // Additional documents
    additionalDocuments: [
      {
        title: String,
        url: String,
        uploadDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Communication history
    communications: [
      {
        type: {
          type: String,
          enum: ["email", "phone", "inPerson", "other"],
        },
        date: {
          type: Date,
          default: Date.now,
        },
        summary: String,
        nextSteps: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
jobApplicationSchema.index({ user: 1, job: 1 }, { unique: true }); // Prevent duplicate applications
jobApplicationSchema.index({ status: 1 }); // Quick status lookups
jobApplicationSchema.index({ appliedDate: -1 }); // Sort by application date

// Pre-save middleware to update lastUpdated
jobApplicationSchema.pre("save", function (next) {
  this.lastUpdated = new Date();
  next();
});

// Methods
jobApplicationSchema.methods = {
  // Update application status
  updateStatus: async function (newStatus) {
    this.status = newStatus;
    this.lastUpdated = new Date();
    return await this.save();
  },

  // Add interview
  addInterview: async function (interviewData) {
    this.interviews.push(interviewData);
    return await this.save();
  },

  // Add communication
  addCommunication: async function (communicationData) {
    this.communications.push(communicationData);
    return await this.save();
  },

  // Add document
  addDocument: async function (documentData) {
    this.additionalDocuments.push(documentData);
    return await this.save();
  },
};

// Statics
jobApplicationSchema.statics = {
  // Get all applications for a user
  getApplicationsByUser: async function (userId) {
    return await this.find({ user: userId })
      .populate("job")
      .sort({ appliedDate: -1 });
  },

  // Get all applications for a job
  getApplicationsByJob: async function (jobId) {
    return await this.find({ job: jobId })
      .populate("user")
      .sort({ appliedDate: -1 });
  },

  // Get application statistics for a user
  getUserStats: async function (userId) {
    return await this.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
  },
};

const JobApplication = mongoose.model("JobApplication", jobApplicationSchema);

export default JobApplication;
