import { Router } from "express";
import {
    createTransaction,
    deleteTransaction,
    getTransaction,
    updateTransaction,
    getStats,
    getCategoryBreakdown,
    getMonthlyTrends,
    getRecent,
    getDashboard,
} from "./transaction.controller.js";
import { AdminUserGuard } from "../middleware/guard.middleware.js";

const TransactionRouter = Router();

// Analytics endpoints
TransactionRouter.get("/stats", AdminUserGuard, getStats);
TransactionRouter.get("/category-breakdown", AdminUserGuard, getCategoryBreakdown);
TransactionRouter.get("/monthly-trends", AdminUserGuard, getMonthlyTrends);
TransactionRouter.get("/recent", AdminUserGuard, getRecent);
TransactionRouter.get("/dashboard", AdminUserGuard, getDashboard);

// Transaction CRUD endpoints
TransactionRouter.post("/create", AdminUserGuard, createTransaction);
TransactionRouter.put("/update/:id", AdminUserGuard, updateTransaction);
TransactionRouter.delete("/delete/:id", AdminUserGuard, deleteTransaction);
TransactionRouter.get("/get", AdminUserGuard, getTransaction);

export default TransactionRouter;
