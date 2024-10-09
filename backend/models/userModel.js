import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const { Schema } = mongoose;
const { ObjectId } = Schema;

// Job History Schema
const jobHistorySchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: 70,
    },
    description: {
      type: String,
      trim: true,
    },
    salary: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
    },
    interviewDate: {
      type: Date,
    },
    applicationStatus: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// User Schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, "first name is required"],
      maxlength: [32, "first name cannot exceed 32 characters"],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, "last name is required"],
      maxlength: [32, "last name cannot exceed 32 characters"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "e-mail is required"],
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please add a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "password must be at least 6 characters"],
    },
    jobHistory: [jobHistorySchema],

    role: { type: Number, default: 0 },
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    contact: {
      phone: { type: String, default: "" },
      github: { type: String, default: "" },
      twitter: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      personalUrl: { type: String, default: "" },
      resumeUrl: { type: String, default: "" },
    },
    // resetPasswordToken: { type: String },
  },
  { timestamps: true }
);

// Password hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Password verification
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// JWT token

userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const User = mongoose.model("User", userSchema);

export default User;
