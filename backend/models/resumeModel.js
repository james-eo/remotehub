import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
  company: String,
  position: String,
  startDate: Date,
  endDate: Date,
  description: String,
});

const educationSchema = new mongoose.Schema({
  school: String,
  degree: String,
  graduationDate: Date,
});

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  name: String,
  email: String,
  phone: String,
  summary: String,
  experience: [experienceSchema],
  education: [educationSchema],
  skills: [String],
});

export default mongoose.model("Resume", resumeSchema);
