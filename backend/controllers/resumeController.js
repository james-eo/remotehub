import Resume from "../models/resumeModel.js";
import ErrorResponse from "../utils/errorResponse.js";

export const getResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.id });
    if (!resume) {
      return next(new ErrorResponse("Resume not found", 404));
    }
    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

export const updateResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { userId: req.user.id },
      req.body,
      { new: true, upsert: true, runValidators: true }
    );
    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

// controllers/jobController.js (add this method)
export const getJobRecommendations = async (req, res, next) => {
  try {
    // This is a simplified recommendation system. In a real-world scenario,
    // you'd want to implement a more sophisticated algorithm based on user preferences,
    // job application history, skills, etc.
    const recommendations = await Job.find({}).sort({ createdAt: -1 }).limit(5);
    res.status(200).json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    next(error);
  }
};
