import User from "../models/userModel.js";
import ErrorResponse from "../utils/errorResponse.js";

export const signup = async (req, res, next) => {
  const { email } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ErrorResponse("User already exists", 400));
  }
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      success: true,
      user, //data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Check if email and password is provided
    if (!email) {
      return next(new ErrorResponse("Please provide your email address", 403));
    }

    if (!password) {
      return next(new ErrorResponse("Please provide your password", 403));
    }

    // Find user with requested email
    const user = await User.findOne({
      email,
    }); //.select("+password");

    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 400));
    }

    // Check if password is correct
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 400));
    }

    // Create token
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();
  res
    .status(statusCode)
    .cookie("token", token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true, // prevents XSS(cross site scripting) attacks
      sameSite: "strict", // prevents CSRF(cross site request forgery) attacks

      secure: process.env.NODE_ENV === "production" ? true : false,
    })
    .json({ success: true, token, user });
};

export const signout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Signed out successfully",
  });
};

// User Profile

export const userProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
