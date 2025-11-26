require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const userRoutes = require("./routes/userRoute");

const app = express();
const PORT = process.env.PORT || 8000;

connectDB();
app.use(express.json());

// Routes
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.listen(PORT, () => {
  console.log(`☑️ Server running on port ${PORT}`);
});
