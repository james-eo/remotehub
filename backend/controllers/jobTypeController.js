import JobType from "../models/jobTypeModel.js";
import ErrorResponse from "../utils/errorResponse.js";
import mongoose from "mongoose";

// Create job category
export const createJobType = async (req, res, next) => {
  try {
    const jobT = await JobType.create({
      jobTypeName: req.body.jobTypeName,
      user: req.user.id,
    });
    res.status(201).json({
      success: true,
      jobT,
    });
  } catch (error) {
    next(error);
  }
};

// All job categories
export const allJobType = async (req, res, next) => {
  try {
    const jobT = await JobType.find();
    res.status(200).json({
      success: true,
      jobT,
    });
  } catch (error) {
    next(error);
  }
};

//update job type
export const updateJobType = async (req, res, next) => {
  try {
    const jobT = await JobType.findByIdAndUpdate(req.params.type_id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      jobT,
    });
  } catch (error) {
    next(error);
  }
};

//delete job type
export const deleteJobType = async (req, res, next) => {
  try {
    const jobTyp = await JobType.findById(req.params.type_id);
    if (!jobTyp) {
      return next(new ErrorResponse("Job type not found", 404));
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.type_id)) {
      return next(new ErrorResponse("Invalid Job Type ID", 400));
    }

    const jobT = await JobType.findByIdAndDelete(req.params.type_id);
    if (!jobT) {
      return next(new ErrorResponse("Job type not found", 404));
    }
    res.status(200).json({
      success: true,
      message: "Job type deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteJobType:", error);
    next(new ErrorResponse("Internal server error", 500));
  }
};
