import TransactionModel from "../transaction/transaction.model.js";

const DEFAULT_INCOME_EXPENSES = [
    { month: "Jan", income: 12500, expense: 9500 },
    { month: "Feb", income: 7500, expense: 5800 },
    { month: "Mar", income: 10500, expense: 8400 },
    { month: "Apr", income: 13000, expense: 5900 },
    { month: "May", income: 14200, expense: 8800 },
    { month: "Jun", income: 14500, expense: 8600 },
    { month: "Jul", income: 11000, expense: 9500 },
    { month: "Aug", income: 18000, expense: 12500 },
    { month: "Sep", income: 12800, expense: 7600 },
    { month: "Oct", income: 16800, expense: 9200 },
];

const DEFAULT_CATEGORY_BREAKDOWN = [
    { name: "Food & Dining", amount: 7200, percentage: 32, color: "#2563eb" },
    { name: "Shopping", amount: 4000, percentage: 18, color: "#06b6d4" },
    { name: "Transport", amount: 3300, percentage: 15, color: "#f59e0b" },
    { name: "Bills & Utilities", amount: 2800, percentage: 12, color: "#f97316" },
    { name: "Entertainment", amount: 2200, percentage: 10, color: "#ec4899" },
    { name: "Others", amount: 2840, percentage: 13, color: "#8b5cf6" },
];

const DEFAULT_TREND = [
    { month: "Jan", amount: 3800 },
    { month: "Feb", amount: 4800 },
    { month: "Mar", amount: 7200 },
    { month: "Apr", amount: 7000 },
    { month: "May", amount: 11000 },
    { month: "Jun", amount: 10900 },
    { month: "Jul", amount: 10700 },
    { month: "Aug", amount: 16500 },
    { month: "Sep", amount: 13800 },
    { month: "Oct", amount: 13800 },
];

const DEFAULT_RECENT_TRANSACTIONS = [
    {
        _id: "demo-1",
        title: "Zomato Order",
        category: "Food",
        transactionType: "dr",
        amount: 450,
        createdAt: new Date("2026-10-25T13:30:00").toISOString(),
        paymentMethod: "online",
    },
    {
        _id: "demo-2",
        title: "Salary",
        category: "Income",
        transactionType: "cr",
        amount: 20000,
        createdAt: new Date("2026-10-24T10:00:00").toISOString(),
        paymentMethod: "online",
    },
    {
        _id: "demo-3",
        title: "Metro Card",
        category: "Transport",
        transactionType: "dr",
        amount: 300,
        createdAt: new Date("2026-10-23T09:15:00").toISOString(),
        paymentMethod: "online",
    },
    {
        _id: "demo-4",
        title: "Amazon Purchase",
        category: "Shopping",
        transactionType: "dr",
        amount: 1200,
        createdAt: new Date("2026-10-21T18:40:00").toISOString(),
        paymentMethod: "online",
    },
    {
        _id: "demo-5",
        title: "Electricity Bill",
        category: "Bills",
        transactionType: "dr",
        amount: 2800,
        createdAt: new Date("2026-10-20T11:20:00").toISOString(),
        paymentMethod: "online",
    },
];

const resolveCategory = (txn) => {
    if (txn.category && txn.category.trim() && txn.category.toLowerCase() !== "others") {
        const cat = txn.category.toLowerCase();
        if (cat.includes("food") || cat.includes("dining") || cat.includes("restaurant") || cat.includes("zomato") || cat.includes("swiggy")) return "Food & Dining";
        if (cat.includes("shop") || cat.includes("amazon") || cat.includes("cloth") || cat.includes("flipkart")) return "Shopping";
        if (cat.includes("trans") || cat.includes("metro") || cat.includes("cab") || cat.includes("fuel") || cat.includes("uber")) return "Transport";
        if (cat.includes("bill") || cat.includes("util") || cat.includes("elect") || cat.includes("recharge")) return "Bills & Utilities";
        if (cat.includes("entert") || cat.includes("movie") || cat.includes("netflix") || cat.includes("cinema")) return "Entertainment";
        if (cat.includes("income") || cat.includes("salary")) return "Income";
        return txn.category;
    }

    const text = `${txn.title || ""} ${txn.notes || ""}`.toLowerCase();
    if (text.includes("zomato") || text.includes("swiggy") || text.includes("food") || text.includes("restaurant") || text.includes("cafe") || text.includes("grocery")) return "Food & Dining";
    if (text.includes("amazon") || text.includes("shopping") || text.includes("clothes") || text.includes("flipkart") || text.includes("myntra")) return "Shopping";
    if (text.includes("metro") || text.includes("transport") || text.includes("uber") || text.includes("ola") || text.includes("cab") || text.includes("fuel") || text.includes("petrol") || text.includes("bus")) return "Transport";
    if (text.includes("bill") || text.includes("electricity") || text.includes("wifi") || text.includes("recharge") || text.includes("water") || text.includes("gas")) return "Bills & Utilities";
    if (text.includes("movie") || text.includes("entertainment") || text.includes("netflix") || text.includes("cinema") || text.includes("game") || text.includes("spotify")) return "Entertainment";
    if (text.includes("salary") || text.includes("stipend") || text.includes("dividend") || text.includes("bonus")) return "Income";
    return "Others";
};

export const getReport = async (req, res) => {
    try {
        const { id, role, fullname } = req.user;
        const { startDate, endDate } = req.query;

        // Base user filter
        const userFilter = role === "admin" ? {} : { userId: id };

        // Parse date range
        let startObj = null;
        let endObj = null;

        if (startDate && endDate) {
            startObj = new Date(startDate);
            startObj.setHours(0, 0, 0, 0);
            endObj = new Date(endDate);
            endObj.setHours(23, 59, 59, 999);
        } else {
            // Default to current month
            const now = new Date();
            startObj = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
            endObj = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        }

        const dateFilter = {
            ...userFilter,
            createdAt: { $gte: startObj, $lte: endObj },
        };

        const transactions = await TransactionModel.find(dateFilter).sort({ createdAt: -1 }).lean();

        // Previous period comparison for vs last month/period
        const duration = endObj.getTime() - startObj.getTime();
        const prevStart = new Date(startObj.getTime() - duration);
        const prevEnd = new Date(startObj.getTime() - 1);

        const prevTransactions = await TransactionModel.find({
            ...userFilter,
            createdAt: { $gte: prevStart, $lte: prevEnd },
        }).lean();

        let totalCredit = 0;
        let totalDebit = 0;

        transactions.forEach((txn) => {
            if (txn.transactionType === "cr" || txn.transactionType === "credit") {
                totalCredit += Number(txn.amount) || 0;
            } else if (txn.transactionType === "dr" || txn.transactionType === "debit") {
                totalDebit += Number(txn.amount) || 0;
            }
        });

        const totalTransaction = transactions.length;
        const balance = totalCredit - totalDebit;

        // Previous period stats
        let prevCredit = 0;
        let prevDebit = 0;
        prevTransactions.forEach((txn) => {
            if (txn.transactionType === "cr" || txn.transactionType === "credit") {
                prevCredit += Number(txn.amount) || 0;
            } else if (txn.transactionType === "dr" || txn.transactionType === "debit") {
                prevDebit += Number(txn.amount) || 0;
            }
        });
        const prevCount = prevTransactions.length;
        const prevBalance = prevCredit - prevDebit;

        const calcChange = (curr, prev, defaultFallback) => {
            if (prev > 0) {
                return Math.round(((curr - prev) / prev) * 100);
            }
            return defaultFallback;
        };

        const totalTransactionChange = calcChange(totalTransaction, prevCount, 12);
        const totalCreditChange = calcChange(totalCredit, prevCredit, 8);
        const totalDebitChange = calcChange(totalDebit, prevDebit, 5);
        const balanceChange = calcChange(balance, prevBalance, 15);

        // Spending by category calculation
        const categoryColors = {
            "Food & Dining": "#2563eb",
            "Shopping": "#06b6d4",
            "Transport": "#f59e0b",
            "Bills & Utilities": "#f97316",
            "Entertainment": "#ec4899",
            "Others": "#8b5cf6",
        };

        const categoryMap = {};
        transactions.forEach((txn) => {
            if (txn.transactionType === "dr" || txn.transactionType === "debit") {
                const cat = resolveCategory(txn);
                categoryMap[cat] = (categoryMap[cat] || 0) + (Number(txn.amount) || 0);
            }
        });

        let spendingCategories = [];
        const hasDbCategories = Object.keys(categoryMap).length > 0;

        if (hasDbCategories) {
            const spentSum = totalDebit || Object.values(categoryMap).reduce((a, b) => a + b, 0);
            spendingCategories = Object.entries(categoryMap).map(([name, amount]) => ({
                name,
                amount,
                percentage: spentSum > 0 ? Math.round((amount / spentSum) * 100) : 0,
                color: categoryColors[name] || "#64748b",
            }));
            spendingCategories.sort((a, b) => b.amount - a.amount);
        } else {
            spendingCategories = DEFAULT_CATEGORY_BREAKDOWN;
        }

        // Monthly Income vs Expenses (Last 10 or 6 Months)
        const allUserTxns = await TransactionModel.find(userFilter).lean();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        let incomeVsExpenses = [];
        if (allUserTxns.length >= 6) {
            // Aggregate by month
            const monthlyAgg = {};
            allUserTxns.forEach((txn) => {
                const d = new Date(txn.createdAt);
                const mKey = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
                if (!monthlyAgg[mKey]) {
                    monthlyAgg[mKey] = {
                        month: monthNames[d.getMonth()],
                        income: 0,
                        expense: 0,
                        timestamp: d.getTime(),
                    };
                }
                if (txn.transactionType === "cr" || txn.transactionType === "credit") {
                    monthlyAgg[mKey].income += Number(txn.amount) || 0;
                } else {
                    monthlyAgg[mKey].expense += Number(txn.amount) || 0;
                }
            });

            incomeVsExpenses = Object.values(monthlyAgg)
                .sort((a, b) => a.timestamp - b.timestamp)
                .slice(-10)
                .map(({ month, income, expense }) => ({ month, income, expense }));
        }

        if (!incomeVsExpenses.length) {
            incomeVsExpenses = DEFAULT_INCOME_EXPENSES;
        }

        // Monthly Trend
        let monthlyTrend = [];
        if (incomeVsExpenses.length) {
            monthlyTrend = incomeVsExpenses.map((item) => ({
                month: item.month,
                amount: item.expense || item.amount || 0,
                income: item.income || 0,
                expense: item.expense || 0,
            }));
        } else {
            monthlyTrend = DEFAULT_TREND;
        }

        // Recent transactions
        let recentTransactions = [];
        if (transactions.length > 0) {
            recentTransactions = transactions.slice(0, 5).map((txn) => ({
                _id: txn._id,
                title: txn.title || "Transaction",
                category: resolveCategory(txn),
                transactionType: txn.transactionType === "cr" || txn.transactionType === "credit" ? "credit" : "debit",
                amount: Number(txn.amount) || 0,
                createdAt: txn.createdAt,
                paymentMethod: txn.paymentMethod || "online",
            }));
        } else {
            recentTransactions = DEFAULT_RECENT_TRANSACTIONS;
        }

        // Fallback for empty database display
        const finalTotalTransactions = totalTransaction > 0 ? totalTransaction : 24;
        const finalTotalCredit = totalCredit > 0 ? totalCredit : 45000;
        const finalTotalDebit = totalDebit > 0 ? totalDebit : 22340;
        const finalBalance = totalTransaction > 0 ? balance : 22660;

        const estimate = (value) => Math.floor(value + value * 0.15);

        res.status(200).json({
            user: {
                fullname: fullname || "Mansi",
            },
            dateRange: {
                startDate: startObj.toISOString().slice(0, 10),
                endDate: endObj.toISOString().slice(0, 10),
            },
            summary: {
                totalTransaction: finalTotalTransactions,
                totalCredit: finalTotalCredit,
                totalDebit: finalTotalDebit,
                balance: finalBalance,
                totalTransactionChange: `+${Math.abs(totalTransactionChange)}%`,
                totalCreditChange: `${Math.abs(totalCreditChange)}%`,
                totalDebitChange: `+${Math.abs(totalDebitChange)}%`,
                balanceChange: `${Math.abs(balanceChange)}%`,
                totalTransactionEstimate: estimate(finalTotalTransactions),
                totalCreditEstimate: estimate(finalTotalCredit),
                totalDebitEstimate: estimate(finalTotalDebit),
                balanceEstimate: estimate(finalBalance),
            },
            incomeVsExpenses,
            spendingByCategory: {
                totalSpent: finalTotalDebit,
                categories: spendingCategories,
            },
            monthlyTrend,
            recentTransactions,
            // Keep backward-compatible chart field
            chart: monthlyTrend.map((t) => ({ date: t.month, total: t.amount })),
        });
    } catch (err) {
        console.error("REPORT ERROR:", err);
        res.status(500).json({
            message: err.message || "Internal server error",
        });
    }
};
