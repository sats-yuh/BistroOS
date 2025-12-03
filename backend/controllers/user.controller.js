import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { UserModel } from "../models/userModel.js";
import mongoose from "mongoose";

const userRoles = () => ["admin", "cashier", "kitchenStaff"];
const userStatus = () => ["enabled", "disabled"];

const generateRefreshAndAccessToken = async (userId) => {
  try {
    const user = await UserModel.findOne({ _id: userId });

    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();

    const decodedAccess = jwt.decode(accessToken);
    const decodedRefresh = jwt.decode(refreshToken);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { refreshToken, accessToken };
  } catch (error) {
    console.log("❌ Error generating tokens:", error.message);
    if (!error.message) {
      error.message =
        "something went wrong while generating refresh and access tokens";
    }
    throw error;
  }
};

const userSignup = async (req, res, next) => {
  try {
    const acceptableRoles = userRoles();
    const acceptableUserStatus = userStatus();

    const { firstName, lastName, email, password, phoneNumber, role, status } =
      req.body;

    console.log(firstName, lastName, email, password, phoneNumber, role);

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !phoneNumber ||
      !role
    ) {
      throw new ApiError(400, "Required Fields Empty");
    }

    if (
      !acceptableRoles.some(
        (eachAcceptableType) => role.toLowerCase() === eachAcceptableType
      )
    ) {
      throw new ApiError(406, "user type unacceptable");
    }
    if (status) {
      if (
        !acceptableUserStatus.some(
          (eachAccepatbleStatus) =>
            status.toLowerCase() === eachAccepatbleStatus
        )
      ) {
        throw new ApiError(406, "user status unacceptable");
      }
    }

    const existingUser = await UserModel.findOne({
      $or: [{ email: email }],
    });
    if (existingUser) {
      if (existingUser.email === email) {
        throw new ApiError(409, "User already exists with the provided email");
      } else {
        throw new ApiError(409, "Company name already registered");
      }
    }

    let roles = [];
    if (role.toLowerCase() === "admin") {
      roles = ["admin"];
    }
    if (role.toLowerCase() === "cashier") {
      roles = ["cashier"];
    }
    if (role.toLowerCase() === "kitchenStaff") {
      roles = ["kitchenStaff"];
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userFields = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
      status,
    };

    const savedUser = await UserModel.create(userFields);
    const recentlySavedUser = await UserModel.findOne({
      _id: savedUser._id,
    }).select("-__v -password -refreshToken");

    return res
      .status(200)
      .json(
        new ApiResponse(201, recentlySavedUser, "user signed up successfully")
      );
  } catch (error) {
    if (!error.message) {
      error.message = "something went wrong while creating user";
    }
    next(error);
  }
};

// LOGIN CONTROLLER
const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    // Find user by email
    const user = await UserModel.findOne({ email: email.toLowerCase() });

    // Check if user exists
    if (!user) {
      throw new ApiError(404, "User not found with this email");
    }

    // Check if user account is enabled
    if (user.status !== "enabled") {
      throw new ApiError(
        403,
        "Account is disabled. Please contact administrator"
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password");
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateRefreshAndAccessToken(
      user._id
    );

    // Get user data without sensitive information
    const loggedInUser = await UserModel.findById(user._id).select(
      "-password -refreshToken -__v"
    );

    // Set both access token and refresh token in HTTP-only cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    // Set access token cookie (short-lived)
    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Set refresh token cookie (long-lived)
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return response with access token (for mobile/API clients) and user data
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken, // Also return in response for clients that don't use cookies
          refreshToken, // Optional: return for mobile apps
        },
        "Login successful"
      )
    );
  } catch (error) {
    if (!error.message) {
      error.message = "Something went wrong during login";
    }
    next(error);
  }
};

// LOGOUT CONTROLLER
const userLogout = async (req, res, next) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }

    // Clear refresh token from database
    await UserModel.findByIdAndUpdate(
      userId,
      {
        $unset: { refreshToken: 1 },
      },
      { new: true }
    );

    // Clear cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Logged out successfully"));
  } catch (error) {
    if (!error.message) {
      error.message = "Something went wrong during logout";
    }
    next(error);
  }
};

// GET CURRENT USER PROFILE
const getCurrentUser = async (req, res, next) => {
  try {
    const user = req.user; // Assuming auth middleware sets req.user

    if (!user) {
      throw new ApiError(401, "Unauthorized request");
    }

    const currentUser = await UserModel.findById(user._id).select(
      "-password -refreshToken -__v"
    );

    if (!currentUser) {
      throw new ApiError(404, "User not found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, currentUser, "User profile retrieved successfully")
      );
  } catch (error) {
    if (!error.message) {
      error.message = "Something went wrong while fetching user profile";
    }
    next(error);
  }
};

const refreshAccessToken = async (req, res, next) => {
  try {
    // Get refresh token from HTTP-only cookie or request body
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(
        401,
        "Unauthorized request. No refresh token provided."
      );
    }

    let decodedRefreshToken;
    try {
      decodedRefreshToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
    } catch (error) {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    const user = await UserModel.findOne({ _id: decodedRefreshToken?._id });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is invalid or expired");
    }

    const { refreshToken: newRefreshToken, accessToken } =
      await generateRefreshAndAccessToken(user?._id);

    // Set new tokens in HTTP-only cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", newRefreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          accessToken,
          refreshToken: newRefreshToken, // Optional: return for mobile apps
        },
        "Access token refreshed successfully"
      )
    );
  } catch (error) {
    if (!error.message) {
      error.message = "Something went wrong while refreshing access token";
    }
    next(error);
  }
};

// Export all controllers
export {
  userSignup,
  userLogin,
  userLogout,
  getCurrentUser,
  refreshAccessToken,
};
