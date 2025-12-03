import express from "express";
import http from "http";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import multer from "multer";

import cookieParser from "cookie-parser";

// dotenv.config("../.env");
dotenv.config({ path: "../.env" });

const app = express();
const server = http.createServer(app);
const upload = multer();

app.use(
  cors({
    origin: process.env.FRONTEND_URL_DEV, // http://localhost:3000
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("../public"));

app.use(morgan("tiny"));

app.get("/", (req, res) => {
  return res.send("Hello JS Developer");
});

// app specific middlewares
import userRoute from "./routes/user.route.js";

app.use("/api/v1/users", userRoute);

app.use((error, _, res, __) => {
  console.log("global handle", error);
  if (!error.statusCode) {
    error.statusCode = 500;
    error.success = false;
    error.data = null;
  }
  if (!error.message) {
    error.message = "something went wrong";
  }
  return res.status(error.statusCode).json(error);
});
// Log 404 errors
app.all("*", (req, res) => {
  return res.status(404).json({ error: "Route not found!" });
});
export { server };
