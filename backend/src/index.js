import express from "express";
import userRouter from "./user/user.routes.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

dotenv.config();

const app = express();

// DB
await mongoose.connect(process.env.DB_URL)
  .then(() => console.log("Database Connected"))
  .catch(() => console.log("Database not connected"));

// CORS
app.use(cors({
  origin: process.env.DOMAIN,
  credentials: true
}));

app.use(cookieParser());

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/user", userRouter);

// Start server (MOVE HERE)
app.listen(3030, () => console.log("Server is running on port 3030"));