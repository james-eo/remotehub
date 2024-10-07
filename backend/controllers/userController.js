import User from "../models/userModel.js";
import ErrorResponse from "../utils/errorResponse.js";

// Display all users
export const allUsers = async (req, res, next) => {
  // Enable pagination
  const pageSize = 10; // results per page
  const page = Number(req.query.page) || 1; // Page
  const count = await User.find({}).estimatedDocumentCount();
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .select("-password")
      .skip(pageSize * page - pageSize)
      .limit(pageSize);
    res.status(200).json({
      success: true,
      users,
      page,
      pages: Math.ceil(count / pageSize),
      count,
    });
    next();
  } catch (error) {
    return next(error);
  }
};

// Single user

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
    next();
  } catch (error) {
    return next(error);
  }
};

// Update user

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
    next();
  } catch (error) {
    return next(error);
  }
};

// Delete user

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      // user: {},
    });
    next();
  } catch (error) {
    return next(error);
  }
};
