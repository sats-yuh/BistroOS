import express from "express";
import {
  userSignup,
  userLogin,
  userLogout,
  getCurrentUser,
  refreshAccessToken,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/tokenVerification.js ";

const router = express.Router();

// Public routes (no authentication required)
router.post("/signup", userSignup);
router.post("/login", userLogin);
router.post("/refresh-token", refreshAccessToken);

// Protected routes (authentication required)
router.post("/logout", verifyJWT, userLogout);
router.get("/me", verifyJWT, getCurrentUser);

export default router;
