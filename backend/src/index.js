import express from "express";
import userRouter from "./user/user.routes.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import TransactionRouter from "./transaction/transaction.route.js";
import DashboardRouter from "./dashboard/dashboard.route.js";

dotenv.config();

const app = express();

// DB
await mongoose.connect(process.env.DB_URL)
  .then(() => console.log("Database Connected"))
  .catch(() => console.log("Database not connected"));


// CORS
const allowedOrigin = process.env.DOMAIN ? process.env.DOMAIN.replace(/\/+$/, "") : true;
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));

app.use(cookieParser());

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/user", userRouter);
app.use("/api/transaction",TransactionRouter)
app.use("/api/dashboard",DashboardRouter)

// Start server 
const port = process.env.PORT || 3030;
app.listen(port, () => console.log(`Server is running on port ${port}`));