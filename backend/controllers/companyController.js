import Company from "../models/companyModel.js";
import ErrorResponse from "../utils/errorResponse.js";

export const getCompanyReviews = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return next(new ErrorResponse("Company not found", 404));
    }
    res.status(200).json({
      success: true,
      data: company.reviews,
    });
  } catch (error) {
    next(error);
  }
};

export const addCompanyReview = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return next(new ErrorResponse("Company not found", 404));
    }
    const newReview = {
      userId: req.user.id,
      rating: req.body.rating,
      title: req.body.title,
      content: req.body.content,
    };
    company.reviews.push(newReview);
    await company.save();
    res.status(201).json({
      success: true,
      data: newReview,
    });
  } catch (error) {
    next(error);
  }
};
