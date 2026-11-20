import mongoose from "mongoose";
import TransactionModel from "./transaction.model.js";

const CATEGORY_COLORS = {
    "Food & Dining": "#2563eb",
    "Shopping": "#06b6d4",
    "Transport": "#f59e0b",
    "Bills & Utilities": "#f97316",
    "Entertainment": "#ec4899",
    "Income": "#10b981",
    "Others": "#8b5cf6",
};

export const inferCategory = (title = "", notes = "") => {
    const text = `${title} ${notes}`.toLowerCase();
    if (text.includes("zomato") || text.includes("swiggy") || text.includes("food") || text.includes("dining") || text.includes("restaurant") || text.includes("cafe") || text.includes("grocery")) {
        return "Food & Dining";
    }
    if (text.includes("amazon") || text.includes("shop") || text.includes("cloth") || text.includes("flipkart") || text.includes("myntra") || text.includes("mall")) {
        return "Shopping";
    }
    if (text.includes("metro") || text.includes("trans") || text.includes("uber") || text.includes("ola") || text.includes("cab") || text.includes("fuel") || text.includes("petrol") || text.includes("bus")) {
        return "Transport";
    }
    if (text.includes("bill") || text.includes("elect") || text.includes("wifi") || text.includes("water") || text.includes("util") || text.includes("recharge") || text.includes("gas")) {
        return "Bills & Utilities";
    }
    if (text.includes("movie") || text.includes("entert") || text.includes("netflix") || text.includes("cinema") || text.includes("game") || text.includes("spotify")) {
        return "Entertainment";
    }
    if (text.includes("salary") || text.includes("stipend") || text.includes("dividend") || text.includes("bonus") || text.includes("income")) {
        return "Income";
    }
    return "Others";
};

export const normalizeCategory = (cat, title = "", notes = "") => {
    if (!cat || cat.trim() === "" || cat.toLowerCase() === "others") {
        return inferCategory(title, notes);
    }
    const c = cat.toLowerCase().trim();
    if (c.includes("food") || c.includes("dining") || c.includes("restaurant")) return "Food & Dining";
    if (c.includes("shop")) return "Shopping";
    if (c.includes("trans") || c.includes("travel") || c.includes("cab")) return "Transport";
    if (c.includes("bill") || c.includes("util") || c.includes("elect")) return "Bills & Utilities";
    if (c.includes("entert") || c.includes("movie")) return "Entertainment";
    if (c.includes("income") || c.includes("salary")) return "Income";
    return cat.charAt(0).toUpperCase() + cat.slice(1);
};

export const getAuthenticatedUserId = (req) => {
    if (!req.user || !req.user.id) {
        throw new Error("Unauthorized");
    }
    const idStr = String(req.user.id);
    return mongoose.Types.ObjectId.isValid(idStr)
        ? new mongoose.Types.ObjectId(idStr)
        : idStr;
};

export const parseDateRange = (startDate, endDate) => {
    let startObj = null;
    let endObj = null;

    if (startDate && endDate) {
        startObj = new Date(startDate);
        startObj.setHours(0, 0, 0, 0);
        endObj = new Date(endDate);
        endObj.setHours(23, 59, 59, 999);
    }

    return { startObj, endObj };
};

// Calculation Helper: Summary Stats (Credits minus debits, net activity, and overall account balance)
export const calculateStats = async (userId, startObj, endObj) => {
    const periodFilter = { userId };
    if (startObj && endObj) {
        periodFilter.createdAt = { $gte: startObj, $lte: endObj };
    }

    const periodTransactions = await TransactionModel.find(periodFilter).lean();

    let totalCredits = 0;
    let totalDebits = 0;

    periodTransactions.forEach((txn) => {
        const amt = Number(txn.amount) || 0;
        if (txn.transactionType === "cr" || txn.transactionType === "credit") {
            totalCredits += amt;
        } else if (txn.transactionType === "dr" || txn.transactionType === "debit") {
            totalDebits += amt;
        }
    });

    const totalTransactions = periodTransactions.length;
    // Net activity during the defined period (credits minus debits)
    const periodBalance = totalCredits - totalDebits;

    // Overall account balance across all time for this user
    const allUserTransactions = await TransactionModel.find({ userId })
        .select("transactionType amount")
        .lean();

    let allTimeCredits = 0;
    let allTimeDebits = 0;
    allUserTransactions.forEach((txn) => {
        const amt = Number(txn.amount) || 0;
        if (txn.transactionType === "cr" || txn.transactionType === "credit") {
            allTimeCredits += amt;
        } else if (txn.transactionType === "dr" || txn.transactionType === "debit") {
            allTimeDebits += amt;
        }
    });
    const overallBalance = allTimeCredits - allTimeDebits;

    // Compare with previous period of equal duration
    let totalTransactionChange = "0%";
    let totalCreditChange = "0%";
    let totalDebitChange = "0%";
    let balanceChange = "0%";

    if (startObj && endObj) {
        const duration = endObj.getTime() - startObj.getTime();
        const prevStart = new Date(startObj.getTime() - duration);
        const prevEnd = new Date(startObj.getTime() - 1);

        const prevTransactions = await TransactionModel.find({
            userId,
            createdAt: { $gte: prevStart, $lte: prevEnd },
        }).lean();

        let prevCredits = 0;
        let prevDebits = 0;
        prevTransactions.forEach((txn) => {
            const amt = Number(txn.amount) || 0;
            if (txn.transactionType === "cr" || txn.transactionType === "credit") {
                prevCredits += amt;
            } else if (txn.transactionType === "dr" || txn.transactionType === "debit") {
                prevDebits += amt;
            }
        });

        const prevCount = prevTransactions.length;
        const prevBalance = prevCredits - prevDebits;

        const calcPercentChange = (curr, prev) => {
            if (prev === 0) {
                return curr > 0 ? "+100%" : "0%";
            }
            const diff = ((curr - prev) / Math.abs(prev)) * 100;
            const sign = diff > 0 ? "+" : "";
            return `${sign}${Math.round(diff)}%`;
        };

        totalTransactionChange = calcPercentChange(totalTransactions, prevCount);
        totalCreditChange = calcPercentChange(totalCredits, prevCredits);
        totalDebitChange = calcPercentChange(totalDebits, prevDebits);
        balanceChange = calcPercentChange(periodBalance, prevBalance);
    }

    return {
        totalTransactions,
        totalTransaction: totalTransactions,
        totalCredits,
        totalCredit: totalCredits,
        totalDebits,
        totalDebit: totalDebits,
        balance: periodBalance, // Net activity for selected period
        netActivity: periodBalance,
        overallBalance,         // Overall account balance across all time
        totalTransactionChange,
        totalCreditChange,
        totalDebitChange,
        balanceChange,
    };
};

// Calculation Helper: Category-wise spending (Percentages calculated strictly using total debits)
export const calculateCategoryBreakdown = async (userId, startObj, endObj) => {
    const filter = {
        userId,
        transactionType: { $in: ["dr", "debit"] },
    };
    if (startObj && endObj) {
        filter.createdAt = { $gte: startObj, $lte: endObj };
    }

    const debitTransactions = await TransactionModel.find(filter).lean();

    let totalDebits = 0;
    const categoryTotals = {};

    debitTransactions.forEach((txn) => {
        const amt = Number(txn.amount) || 0;
        totalDebits += amt;
        const catName = normalizeCategory(txn.category, txn.title, txn.notes);
        categoryTotals[catName] = (categoryTotals[catName] || 0) + amt;
    });

    const categories = Object.entries(categoryTotals).map(([name, amount]) => {
        // Calculate percentages using total debits, not credits plus debits
        const percentage = totalDebits > 0 ? Number(((amount / totalDebits) * 100).toFixed(1)) : 0;
        return {
            name,
            amount,
            percentage,
            color: CATEGORY_COLORS[name] || "#64748b",
        };
    });

    categories.sort((a, b) => b.amount - a.amount);

    return {
        totalSpent: totalDebits,
        totalDebits,
        categories,
    };
};

// Calculation Helper: Monthly Income & Expenses (Returns months with zero transactions as zero-valued data points)
export const calculateMonthlyTrends = async (userId, startObj, endObj, monthsParam) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Determine calendar months sequence
    const monthsList = [];
    const targetEnd = endObj ? new Date(endObj) : new Date();
    let numMonths = parseInt(monthsParam, 10) || 6;

    if (startObj && endObj) {
        const monthDiff = (endObj.getFullYear() - startObj.getFullYear()) * 12 + (endObj.getMonth() - startObj.getMonth()) + 1;
        if (monthDiff > 1) {
            numMonths = Math.min(Math.max(monthDiff, 2), 24);
        }
    }

    for (let i = numMonths - 1; i >= 0; i--) {
        const d = new Date(targetEnd.getFullYear(), targetEnd.getMonth() - i, 1);
        const y = d.getFullYear();
        const m = d.getMonth();
        const key = `${y}-${String(m + 1).padStart(2, "0")}`;
        monthsList.push({
            key,
            month: monthNames[m],
            year: y,
            income: 0,
            expense: 0,
            amount: 0,
            balance: 0,
        });
    }

    const firstMonthDate = new Date(monthsList[0].year, monthNames.indexOf(monthsList[0].month), 1);
    const lastMonthDate = new Date(monthsList[monthsList.length - 1].year, monthNames.indexOf(monthsList[monthsList.length - 1].month) + 1, 0, 23, 59, 59, 999);

    const transactions = await TransactionModel.find({
        userId,
        createdAt: { $gte: firstMonthDate, $lte: lastMonthDate },
    }).lean();

    const monthMap = {};
    monthsList.forEach((m) => {
        monthMap[m.key] = m;
    });

    transactions.forEach((txn) => {
        const d = new Date(txn.createdAt);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (monthMap[key]) {
            const amt = Number(txn.amount) || 0;
            if (txn.transactionType === "cr" || txn.transactionType === "credit") {
                monthMap[key].income += amt;
            } else if (txn.transactionType === "dr" || txn.transactionType === "debit") {
                monthMap[key].expense += amt;
                monthMap[key].amount += amt;
            }
            monthMap[key].balance = monthMap[key].income - monthMap[key].expense;
        }
    });

    return monthsList;
};

// Calculation Helper: Recent Transactions (Sorted by date in descending order with limit)
export const getRecentTransactionsList = async (userId, startObj, endObj, limitCount = 5) => {
    const filter = { userId };
    if (startObj && endObj) {
        filter.createdAt = { $gte: startObj, $lte: endObj };
    }

    const limit = Math.min(Math.max(parseInt(limitCount, 10) || 5, 1), 50);

    const txns = await TransactionModel.find(filter)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

    return txns.map((txn) => ({
        _id: txn._id,
        title: txn.title,
        category: normalizeCategory(txn.category, txn.title, txn.notes),
        transactionType: txn.transactionType === "cr" || txn.transactionType === "credit" ? "credit" : "debit",
        amount: Number(txn.amount) || 0,
        paymentMethod: txn.paymentMethod || "online",
        notes: txn.notes || "",
        createdAt: txn.createdAt,
        date: txn.createdAt,
    }));
};

// API: GET /api/transactions/stats
export const getStats = async (req, res) => {
    try {
        const userId = getAuthenticatedUserId(req);
        const { startDate, endDate } = req.query;
        const { startObj, endObj } = parseDateRange(startDate, endDate);
        const stats = await calculateStats(userId, startObj, endObj);
        res.status(200).json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message || "Internal server error" });
    }
};

// API: GET /api/transactions/category-breakdown
export const getCategoryBreakdown = async (req, res) => {
    try {
        const userId = getAuthenticatedUserId(req);
        const { startDate, endDate } = req.query;
        const { startObj, endObj } = parseDateRange(startDate, endDate);
        const breakdown = await calculateCategoryBreakdown(userId, startObj, endObj);
        res.status(200).json(breakdown);
    } catch (err) {
        res.status(500).json({ message: err.message || "Internal server error" });
    }
};

// API: GET /api/transactions/monthly-trends
export const getMonthlyTrends = async (req, res) => {
    try {
        const userId = getAuthenticatedUserId(req);
        const { startDate, endDate, months } = req.query;
        const { startObj, endObj } = parseDateRange(startDate, endDate);
        const trends = await calculateMonthlyTrends(userId, startObj, endObj, months);
        res.status(200).json(trends);
    } catch (err) {
        res.status(500).json({ message: err.message || "Internal server error" });
    }
};

// API: GET /api/transactions/recent
export const getRecent = async (req, res) => {
    try {
        const userId = getAuthenticatedUserId(req);
        const { startDate, endDate, limit } = req.query;
        const { startObj, endObj } = parseDateRange(startDate, endDate);
        const recent = await getRecentTransactionsList(userId, startObj, endObj, limit);
        res.status(200).json(recent);
    } catch (err) {
        res.status(500).json({ message: err.message || "Internal server error" });
    }
};

// API: GET /api/transactions/dashboard (Combined dashboard endpoint)
export const getDashboard = async (req, res) => {
    try {
        const userId = getAuthenticatedUserId(req);
        const { startDate, endDate, months } = req.query;
        const { startObj, endObj } = parseDateRange(startDate, endDate);

        const [stats, categoryBreakdown, monthlyTrends, recent] = await Promise.all([
            calculateStats(userId, startObj, endObj),
            calculateCategoryBreakdown(userId, startObj, endObj),
            calculateMonthlyTrends(userId, startObj, endObj, months),
            getRecentTransactionsList(userId, startObj, endObj, 5),
        ]);

        res.status(200).json({
            user: {
                fullname: req.user?.fullname || "User",
            },
            dateRange: {
                startDate: startObj ? startObj.toISOString().slice(0, 10) : null,
                endDate: endObj ? endObj.toISOString().slice(0, 10) : null,
            },
            summary: stats,
            spendingByCategory: categoryBreakdown,
            incomeVsExpenses: monthlyTrends.map((item) => ({
                month: item.month,
                year: item.year,
                income: item.income,
                expense: item.expense,
            })),
            monthlyTrend: monthlyTrends.map((item) => ({
                month: item.month,
                year: item.year,
                amount: item.amount,
                income: item.income,
                expense: item.expense,
                balance: item.balance,
            })),
            recentTransactions: recent,
            chart: monthlyTrends.map((t) => ({ date: t.month, total: t.amount })),
        });
    } catch (err) {
        res.status(500).json({ message: err.message || "Internal server error" });
    }
};

// CRUD Transactions
export const createTransaction = async (req, res) => {
    try {
        const data = req.body;
        const { id } = req.user;
        data.userId = id;

        if (!data.category || !data.category.trim()) {
            data.category = inferCategory(data.title, data.notes);
        }

        const transaction = await new TransactionModel(data).save();
        res.json(transaction);
    } catch (err) {
        res.status(500).json({
            message: err.message || "Internal server error.",
        });
    }
};

export const updateTransaction = async (req, res) => {
    try {
        const data = req.body;
        const { id } = req.params;

        if (!data.category || !data.category.trim()) {
            data.category = inferCategory(data.title, data.notes);
        }

        const transaction = await TransactionModel.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            data,
            { new: true }
        );

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found",
            });
        }
        res.json(transaction);
    } catch (err) {
        res.status(500).json({
            message: err.message || "Internal server error.",
        });
    }
};

export const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await TransactionModel.findOneAndDelete({
            _id: id,
            userId: req.user.id,
        });

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found",
            });
        }
        res.json(transaction);
    } catch (err) {
        res.status(500).json({
            message: err.message || "Internal server error.",
        });
    }
};

export const getTransaction = async (req, res) => {
    try {
        const { id } = req.user;
        const transactions = await TransactionModel.find({ userId: id }).sort({ createdAt: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({
            message: err.message || "Internal server error.",
        });
    }
};
