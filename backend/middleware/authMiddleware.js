import ErrorResponse from "../utils/errorResponse.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Protect routes
export const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorResponse("Unauthorized - Access denied", 401));
  }

  // Verify token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    console.log("JWT verification failed", error);
    return next(new ErrorResponse("Unauthorized - Access denied", 401));
  }
};

// Grant access to specific roles
export const isAdmin = (req, res, next) => {
  if (req.user.role === 0) {
    return next(new ErrorResponse("Access denied - Not an Admin", 401));
  }
  next();
};
