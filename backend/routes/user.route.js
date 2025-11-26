import express from "express";
import { userSignup } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/signUp", userSignup);

export default router;
