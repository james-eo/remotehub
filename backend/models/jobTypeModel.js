import mongoose from "mongoose";

const { Schema } = mongoose;
const { ObjectId } = Schema;

const jobTypeSchema = new Schema(
  {
    jobTypeName: {
      type: String,
      trim: true,
      required: [true, "Job category is required"],
      maxlength: 70,
    },
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("JobType", jobTypeSchema);
