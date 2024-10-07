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
      return next(
        new ErrorResponse("Please provide add your email address", 403)
      );
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
// export const signup = async (req, res) => {
//   try {
//     const { fullName, userName, email, password, confirmPassword, gender } =
//       req.body;
//     // if (!fullName || !userName || !email || !password || !confirmPassword) {
//     //   return res.status(422).json({ error: "Please fill all the fields" });
//     // }
//     if (password !== confirmPassword) {
//       return res.status(400).json({ error: "Passwords do not match" });
//     }
//     const user = await User.findOne({ userName }); // || { email });

//     if (user) {
//       return res.status(400).json({ error: "Username already exists" });
//     }
//     // HASH PASSWORD HERE

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // https://avatar-placeholder.iran.liara.run/

//     const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${userName}`;

//     const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${userName}`;

//     const newUser = new User({
//       fullName,
//       userName,
//       email,
//       password: hashedPassword,
//       gender,
//       profilePicture: gender === "male" ? boyProfilePic : girlProfilePic,
//     });

//     if (newUser) {
//       generateTokenAndSetCookie(newUser._id, res);
//       await newUser.save();

//       res.status(201).json({
//         _id: newUser._id,
//         fullName: newUser.fullName,
//         userName: newUser.userName,
//         email: newUser.email,
//         profilePicture: newUser.profilePicture,
//       });
//     } else {
//       res.status(400).json({ error: "Invalid user data" });
//     }
//   } catch (error) {
//     console.log("Error in SignUp Controller", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// export const login = async (req, res) => {
//   try {
//     const { userNameOrEmail, password } = req.body;

//     if (!userNameOrEmail || !password) {
//       return res.status(422).json({ error: "Please fill all the fields" });
//     }

//     const user = await User.findOne({
//       $or: [{ userName: userNameOrEmail }, { email: userNameOrEmail }],
//     });

//     const validPassword = await bcrypt.compare(password, user?.password || "");

//     if (!user || !validPassword) {
//       return res.status(400).json({ error: "Invalid username or password" });
//     }

//     generateTokenAndSetCookie(user._id, res);

//     res.status(200).json({
//       _id: user._id,
//       fullName: user.fullName,
//       userName: user.userName,
//       email: user.email,
//       profilePicture: user.profilePicture,
//     });
//   } catch (error) {
//     console.log("Error in Login Controller", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// export const logout = (req, res) => {
//   try {
//     res.clearCookie("jwt", " ", { maxAge: 0 });
//     res.status(200).json({ message: "Logged out successfully" });
//   } catch (error) {
//     console.log("Error in Logout Controller", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
