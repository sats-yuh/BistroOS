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

const refreshAccessToken = async (req, res, next) => {
  try {
    // Get refresh token from HTTP-only cookie instead of request body
    const incomingRefreshToken = req.cookies.refreshToken;
    if (!incomingRefreshToken) {
      throw new ApiError(401, "unauthorized request");
    }
    let decodedRefreshToken;
    try {
      decodedRefreshToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
    } catch (error) {
      error.statusCode = 401;
      error.data = null;
      error.success = false;
      error.name = "jwt error";
      next(error);
    }
    const user = await UserModel.findOne({ _id: decodedRefreshToken?._id });
    if (!user) {
      throw new ApiError(404, "unknown user");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "unauthorized request");
    }
    const { refreshToken: newRefreshToken, accessToken } =
      await generateRefreshAndAccessToken(user?._id);

    // Set new refresh token in HTTP-only cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, { accessToken }, "token refreshed successfully")
      );
  } catch (error) {
    if (!error.message) {
      error.message = "something went wrong while generating access token";
    }
    next(error);
  }
};

export { userSignup, refreshAccessToken };
