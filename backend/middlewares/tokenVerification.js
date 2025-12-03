import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { UserModel } from "../models/userModel.js";

export const verifyJWT = async (req, res, next) => {
  try {
    // Try to get token from Authorization header first, then from cookie
    const token =
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.cookies?.accessToken;

    if (!token) {
      throw new ApiError(401, "Unauthorized request. Please provide token!");
    }

    // Verify token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find user
    const user = await UserModel.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "User does not exist!");
    }

    // Check if user is enabled
    if (user.status !== "enabled") {
      throw new ApiError(
        403,
        "Account is disabled. Please contact administrator."
      );
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);

    if (error.name === "JsonWebTokenError") {
      return next(new ApiError(401, "Invalid token!"));
    }
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Token expired!"));
    }
    next(new ApiError(401, error.message || "Authentication failed"));
  }
};

// Optional: Role-based middleware
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized request");
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "Access denied. Insufficient permissions.");
    }

    next();
  };
};
