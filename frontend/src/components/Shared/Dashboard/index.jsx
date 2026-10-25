import { useState, useEffect, useMemo } from "react";
import { Popover, DatePicker, Button, Select } from "antd";
import {
  BarChartOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined,
  DownOutlined,
  LineChartOutlined,
  MinusCircleOutlined,
  PieChartOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import http from "../../../utils/http.js";
import Loader from "../Loader.jsx";

const PREDEFINED_RANGES = [
  {
    label: "Today",
    key: "today",
    getDates: () => ({
      startDate: dayjs().format("YYYY-MM-DD"),
      endDate: dayjs().format("YYYY-MM-DD"),
    }),
  },
  {
    label: "This Week",
    key: "this_week",
    getDates: () => ({
      startDate: dayjs().startOf("week").format("YYYY-MM-DD"),
      endDate: dayjs().endOf("week").format("YYYY-MM-DD"),
    }),
  },
  {
    label: "This Month",
    key: "this_month",
    getDates: () => ({
      startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
      endDate: dayjs().endOf("month").format("YYYY-MM-DD"),
    }),
  },
  {
    label: "Last Month",
    key: "last_month",
    getDates: () => ({
      startDate: dayjs().subtract(1, "month").startOf("month").format("YYYY-MM-DD"),
      endDate: dayjs().subtract(1, "month").endOf("month").format("YYYY-MM-DD"),
    }),
  },
  {
    label: "Last 30 Days",
    key: "last_30_days",
    getDates: () => ({
      startDate: dayjs().subtract(29, "day").format("YYYY-MM-DD"),
      endDate: dayjs().format("YYYY-MM-DD"),
    }),
  },
  {
    label: "Last 6 Months",
    key: "last_6_months",
    getDates: () => ({
      startDate: dayjs().subtract(5, "month").startOf("month").format("YYYY-MM-DD"),
      endDate: dayjs().endOf("month").format("YYYY-MM-DD"),
    }),
  },
  {
    label: "This Year",
    key: "this_year",
    getDates: () => ({
      startDate: dayjs().startOf("year").format("YYYY-MM-DD"),
      endDate: dayjs().endOf("year").format("YYYY-MM-DD"),
    }),
  },
];

const getCategoryIcon = (title = "", category = "") => {
  const text = `${title} ${category}`.toLowerCase();
  if (text.includes("zomato") || text.includes("swiggy") || text.includes("food") || text.includes("dining")) return "🍴";
  if (text.includes("salary") || text.includes("income")) return "💼";
  if (text.includes("metro") || text.includes("transport") || text.includes("cab") || text.includes("fuel")) return "🚆";
  if (text.includes("amazon") || text.includes("shop")) return "🛍️";
  if (text.includes("bill") || text.includes("electricity") || text.includes("utility")) return "⚡";
  if (text.includes("movie") || text.includes("entertainment") || text.includes("netflix")) return "🎬";
  return "🏷️";
};

const getCategoryBadgeStyle = (category = "") => {
  const cat = category.toLowerCase();
  if (cat.includes("food")) return "bg-rose-50 text-rose-600 border border-rose-100";
  if (cat.includes("income") || cat.includes("salary")) return "bg-blue-50 text-blue-600 border border-blue-100";
  if (cat.includes("trans")) return "bg-amber-50 text-amber-700 border border-amber-100";
  if (cat.includes("shop")) return "bg-purple-50 text-purple-600 border border-purple-100";
  if (cat.includes("bill")) return "bg-sky-50 text-sky-600 border border-sky-100";
  if (cat.includes("entert")) return "bg-pink-50 text-pink-600 border border-pink-100";
  return "bg-gray-100 text-gray-700 border border-gray-200";
};

const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const incomeVal = payload.find((p) => p.dataKey === "income")?.value || 0;
    const expenseVal = payload.find((p) => p.dataKey === "expense")?.value || 0;

    return (
      <div className="bg-slate-900 text-white px-3 py-2.5 rounded-lg shadow-xl text-xs space-y-1 z-50">
        <p className="font-semibold text-gray-200">{label} 2026</p>
        <div className="flex items-center gap-2 text-blue-400">
          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
          <span>Income: ₹{Number(incomeVal).toLocaleString("en-IN")}</span>
        </div>
        <div className="flex items-center gap-2 text-red-400">
          <span className="w-2 h-2 rounded-full bg-red-400 inline-block"></span>
          <span>Expense: ₹{Number(expenseVal).toLocaleString("en-IN")}</span>
        </div>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  // Step 2: Date range state in React dashboard
  const [dateRange, setDateRange] = useState({
    startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
    endDate: dayjs().endOf("month").format("YYYY-MM-DD"),
    label: "This Month",
    key: "this_month",
  });

  // Custom date range pickers state
  const [customStart, setCustomStart] = useState(dayjs().startOf("month"));
  const [customEnd, setCustomEnd] = useState(dayjs().endOf("month"));
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Filters for individual chart cards
  const [incomeExpenseFilter, setIncomeExpenseFilter] = useState("last6");
  const [categoryFilter, setCategoryFilter] = useState("this_month");
  const [trendMetric, setTrendMetric] = useState("expenses");

  // Dashboard backend data state
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // User session info for personalized greeting
  const sessionUser = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem("userInfo") || "{}");
    } catch {
      return {};
    }
  }, []);

  // Fetch report when date range changes (Step 2: Send selected dates as query params)
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    http
      .get("/api/dashboard/report", {
        params: {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        },
      })
      .then((res) => {
        if (isMounted) {
          setReport(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Dashboard report error:", err);
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [dateRange.startDate, dateRange.endDate]);

  // Handler for predefined range dropdown
  const handleSelectPredefined = (range) => {
    const dates = range.getDates();
    setDateRange({
      startDate: dates.startDate,
      endDate: dates.endDate,
      label: range.label,
      key: range.key,
    });
    setCustomStart(dayjs(dates.startDate));
    setCustomEnd(dayjs(dates.endDate));
    setPopoverOpen(false);
  };

  // Handler for custom start and end date pickers
  const handleApplyCustom = () => {
    if (!customStart || !customEnd) return;
    const startStr = customStart.format("YYYY-MM-DD");
    const endStr = customEnd.format("YYYY-MM-DD");

    setDateRange({
      startDate: startStr,
      endDate: endStr,
      label: "Custom Range",
      key: "custom",
    });
    setPopoverOpen(false);
  };

  // Formatted date range to display near dashboard heading
  const formattedRangeText = useMemo(() => {
    const s = dayjs(dateRange.startDate);
    const e = dayjs(dateRange.endDate);
    return `${s.format("MMM D, YYYY")} - ${e.format("MMM D, YYYY")}`;
  }, [dateRange.startDate, dateRange.endDate]);

  // Greeting name
  const userName = useMemo(() => {
    const raw = report?.user?.fullname || sessionUser?.fullname || "Mansi";
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }, [report?.user?.fullname, sessionUser?.fullname]);

  if (loading && !report) {
    return <Loader />;
  }

  const summary = report?.summary || {
    totalTransaction: 24,
    totalCredit: 45000,
    totalDebit: 22340,
    balance: 22660,
    totalTransactionChange: "+12%",
    totalCreditChange: "8%",
    totalDebitChange: "+5%",
    balanceChange: "15%",
  };

  const incomeVsExpenses = report?.incomeVsExpenses || [];
  const spendingCategories = report?.spendingByCategory?.categories || [];
  const totalSpent = report?.spendingByCategory?.totalSpent || summary.totalDebit || 22340;
  const monthlyTrend = report?.monthlyTrend || [];
  const recentTransactions = report?.recentTransactions || [];
  const userRole = sessionUser?.role || "user";

  // Popover content with predefined range dropdown & custom pickers
  const dateRangePopoverContent = (
    <div className="p-3 w-72 sm:w-80 space-y-3">
      <div>
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
          Predefined Ranges
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          {PREDEFINED_RANGES.map((item) => {
            const isActive = dateRange.key === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleSelectPredefined(item)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium text-left transition cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "hover:bg-gray-100 text-gray-700 bg-gray-50"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-3">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
          Custom Date Range
        </span>
        <div className="space-y-2">
          <div>
            <label className="text-[11px] text-gray-500 font-medium block mb-1">
              Start Date
            </label>
            <DatePicker
              className="w-full text-xs"
              value={customStart}
              onChange={(d) => setCustomStart(d)}
              format="YYYY-MM-DD"
              allowClear={false}
            />
          </div>
          <div>
            <label className="text-[11px] text-gray-500 font-medium block mb-1">
              End Date
            </label>
            <DatePicker
              className="w-full text-xs"
              value={customEnd}
              onChange={(d) => setCustomEnd(d)}
              format="YYYY-MM-DD"
              allowClear={false}
            />
          </div>
          <Button
            type="primary"
            size="small"
            className="w-full !bg-blue-600 !h-8 text-xs font-semibold mt-1 rounded-lg"
            onClick={handleApplyCustom}
          >
            Apply Custom Range
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-6">
      {/* Step 1 & 2: Header with Greeting & Selected Date Range Trigger near Heading */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            Welcome back, {userName}! <span>👋</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Here's a summary of your finances for this period.
          </p>
        </div>

        {/* Date Range Selector Pill near heading */}
        <Popover
          content={dateRangePopoverContent}
          trigger="click"
          open={popoverOpen}
          onOpenChange={setPopoverOpen}
          placement="bottomRight"
        >
          <button
            type="button"
            className="flex items-center gap-2.5 bg-white border border-gray-200 hover:border-blue-400 shadow-xs px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-700 transition cursor-pointer self-start md:self-auto"
          >
            <CalendarOutlined className="text-gray-500 text-sm" />
            <span className="font-semibold text-gray-800">{formattedRangeText}</span>
            <DownOutlined className="text-[10px] text-gray-400 ml-1" />
          </button>
        </Popover>
      </div>

      {/* Summary Statistics Cards (4 Cards in a row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Transactions */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-sm shadow-blue-200">
            <BarChartOutlined className="text-white text-xl" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Transactions</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">
              {summary.totalTransaction}
            </h3>
            <p className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
              <span>▲</span>
              <span>{summary.totalTransactionChange || "+12%"}</span>
              <span className="text-gray-400 font-normal">vs last month</span>
            </p>
          </div>
        </div>

        {/* Card 2: Total Credits */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
          <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center shrink-0 shadow-sm shadow-emerald-200">
            <PlusCircleOutlined className="text-white text-xl" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Credits</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-0.5">
              ₹{Number(summary.totalCredit).toLocaleString("en-IN")}
            </h3>
            <p className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
              <span>▲</span>
              <span>{summary.totalCreditChange || "8%"}</span>
              <span className="text-gray-400 font-normal">vs last month</span>
            </p>
          </div>
        </div>

        {/* Card 3: Total Debits */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
          <div className="w-12 h-12 rounded-full bg-rose-500 flex items-center justify-center shrink-0 shadow-sm shadow-rose-200">
            <MinusCircleOutlined className="text-white text-xl" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Debits</p>
            <h3 className="text-2xl font-bold text-rose-500 mt-0.5">
              ₹{Number(summary.totalDebit).toLocaleString("en-IN")}
            </h3>
            <p className="text-xs font-semibold text-rose-500 mt-1 flex items-center gap-1">
              <span>▲</span>
              <span>{summary.totalDebitChange || "+5%"}</span>
              <span className="text-gray-400 font-normal">vs last month</span>
            </p>
          </div>
        </div>

        {/* Card 4: Balance */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
          <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center shrink-0 shadow-sm shadow-purple-200">
            <DollarCircleOutlined className="text-white text-xl" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Balance</p>
            <h3 className="text-2xl font-bold text-purple-600 mt-0.5">
              ₹{Number(summary.balance).toLocaleString("en-IN")}
            </h3>
            <p className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
              <span>▲</span>
              <span>{summary.balanceChange || "15%"}</span>
              <span className="text-gray-400 font-normal">vs last month</span>
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: Middle Section - Two columns on desktop, collapses into one column on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Income vs Expenses Card */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BarChartOutlined className="text-blue-600 text-lg" />
              <h2 className="text-base font-bold text-gray-800">Income vs Expenses</h2>
            </div>
            <Select
              size="small"
              value={incomeExpenseFilter}
              onChange={setIncomeExpenseFilter}
              className="w-32"
              options={[
                { label: "Last 6 Months", value: "last6" },
                { label: "Last 30 Days", value: "last30" },
                { label: "This Year", value: "year" },
              ]}
            />
          </div>

          {/* Chart Legend */}
          <div className="flex items-center gap-4 text-xs font-medium text-gray-600 mb-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
              Income
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
              Expense
            </span>
          </div>

          {/* Grouped Bar Chart */}
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeVsExpenses} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  stroke="#94a3b8"
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                  fontSize={11}
                />
                <YAxis
                  tickFormatter={(val) => (val === 0 ? "0" : `${val / 1000}K`)}
                  stroke="#94a3b8"
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="income" fill="#2563eb" radius={[3, 3, 0, 0]} maxBarSize={12} />
                <Bar dataKey="expense" fill="#f87171" radius={[3, 3, 0, 0]} maxBarSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Spending by Category Card */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <PieChartOutlined className="text-blue-600 text-lg" />
              <h2 className="text-base font-bold text-gray-800">Spending by Category</h2>
            </div>
            <Select
              size="small"
              value={categoryFilter}
              onChange={setCategoryFilter}
              className="w-28"
              options={[
                { label: "This Month", value: "this_month" },
                { label: "Last Month", value: "last_month" },
                { label: "All Time", value: "all" },
              ]}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-2">
            {/* Donut Chart with Centered Total Spent */}
            <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={spendingCategories}
                    dataKey="amount"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {spendingCategories.map((entry, index) => (
                      <Cell key={`cat-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => `₹${Number(val).toLocaleString("en-IN")}`}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-lg font-bold text-gray-900 leading-tight">
                  ₹{Number(totalSpent).toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-gray-400 font-medium">Total Spent</span>
              </div>
            </div>

            {/* Category Breakdown Legend */}
            <div className="flex-1 w-full space-y-2">
              {spendingCategories.map((cat, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs sm:text-sm py-1 border-b border-gray-50 last:border-none"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    ></span>
                    <span className="text-gray-700 font-medium">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400 font-medium text-right w-10">
                      {cat.percentage}%
                    </span>
                    <span className="text-gray-800 font-semibold text-right w-16">
                      ₹{Number(cat.amount).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step 1: Lower Section - Two columns on desktop, collapses into one column on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Monthly Trend Card */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <LineChartOutlined className="text-blue-600 text-lg" />
              <h2 className="text-base font-bold text-gray-800">Monthly Trend</h2>
            </div>
            <Select
              size="small"
              value={trendMetric}
              onChange={setTrendMetric}
              className="w-28"
              options={[
                { label: "Expenses", value: "expenses" },
                { label: "Income", value: "income" },
                { label: "Balance", value: "balance" },
              ]}
            />
          </div>

          <div className="w-full h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend}>
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  stroke="#94a3b8"
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                  fontSize={11}
                />
                <YAxis
                  tickFormatter={(val) => (val === 0 ? "0" : `${val / 1000}K`)}
                  stroke="#94a3b8"
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                />
                <Tooltip
                  formatter={(val) => [`₹${Number(val).toLocaleString("en-IN")}`, "Amount"]}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#trendGradient)"
                  dot={{ r: 4, fill: "#2563eb", strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Recent Transactions Card */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ClockCircleOutlined className="text-blue-600 text-lg" />
                <h2 className="text-base font-bold text-gray-800">Recent Transactions</h2>
              </div>
              <Link
                to={userRole === "admin" ? "/app/admin/dashboard" : "/app/user/transactions"}
                className="text-blue-600 hover:text-blue-700 text-xs font-semibold hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-medium text-xs">
                    <th className="pb-2.5 font-medium">Title</th>
                    <th className="pb-2.5 font-medium">Category</th>
                    <th className="pb-2.5 font-medium">Type</th>
                    <th className="pb-2.5 font-medium text-right">Amount</th>
                    <th className="pb-2.5 font-medium text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentTransactions.map((txn, index) => {
                    const isCredit =
                      txn.transactionType === "cr" || txn.transactionType === "credit";
                    const catBadgeStyle = getCategoryBadgeStyle(txn.category);
                    const icon = getCategoryIcon(txn.title, txn.category);

                    return (
                      <tr key={txn._id || index} className="hover:bg-gray-50/50 transition">
                        <td className="py-3 pr-2 flex items-center gap-2 font-medium text-gray-800">
                          <span className="text-sm">{icon}</span>
                          <span className="truncate max-w-[120px] sm:max-w-[150px] capitalize">
                            {txn.title}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium capitalize ${catBadgeStyle}`}
                          >
                            {txn.category || "Others"}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              isCredit
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-rose-50 text-rose-500"
                            }`}
                          >
                            {isCredit ? "Credit" : "Debit"}
                          </span>
                        </td>
                        <td
                          className={`py-3 px-2 text-right font-semibold ${
                            isCredit ? "text-emerald-600" : "text-rose-500"
                          }`}
                        >
                          {isCredit ? "+" : "-"} ₹{Number(txn.amount).toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 pl-2 text-right text-gray-400 text-xs whitespace-nowrap">
                          {dayjs(txn.createdAt).format("DD MMM YYYY")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
