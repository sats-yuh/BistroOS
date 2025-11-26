import mongoose from "mongoose";

const dbConnect = () => {
  const DB_URL =
    process.env.NODE_ENV === "DEV"
      ? process.env.DB_URL_DEV
      : process.env.DB_URL_PROD;

  if (!DB_URL) {
    throw new Error("MongoDB URI is not defined in .env");
  }

  return mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export { dbConnect };
