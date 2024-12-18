import User from "../models/userModel.js";
import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "express-async-handler";
import JobApplication from "../models/jobApplicationModel.js";

export const allUsers = async (req, res, next) => {
  // Enable pagination
  const pageSize = 10; // results per page
  const page = Number(req.query.page) || 1;
  const count = await User.find({}).estimatedDocumentCount();
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .select("-password")
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    res.status(200).json({
      success: true,
      users,
      page,
      pages: Math.ceil(count / pageSize),
      count,
    });
  } catch (error) {
    next(error);
  }
};

export const singleUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const userJobHistory = asyncHandler(async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Get job history
    const jobHistory = await JobApplication.find({ userId: req.user._id })
      .sort({ appliedDate: -1 })
      .populate("jobId", "title company")
      .lean();

    // Transform data if needed
    const formattedJobHistory = jobHistory.map((job) => ({
      _id: job._id,
      jobTitle: job.jobId?.title || "Deleted Job",
      company: job.jobId?.company || "Unknown Company",
      status: job.status,
      appliedDate: job.appliedDate,
    }));

    res.json(formattedJobHistory);
  } catch (error) {
    res.status(error.status || 500);
    throw new Error(error.message || "Error fetching job history");
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.json(user);
  } catch (error) {
    res.status(error.status || 500);
    throw new Error(error.message || "Error fetching user profile");
  }
});

export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
