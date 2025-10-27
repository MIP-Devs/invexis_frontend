"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  FileDown,
  FileSpreadsheet,
  Printer,
  Search,
  AlertTriangle,
  Clock,
  X,
  BarChart3,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Area,
  AreaChart,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

/* ───────────────── SAMPLE DATA & CHART SETS ───────────────── */
const chartDataSets = {
  weekly: [
    { name: "Mon", orders: 50, inHand: 30 },
    { name: "Tue", orders: 65, inHand: 55 },
    { name: "Wed", orders: 45, inHand: 35 },
    { name: "Thu", orders: 80, inHand: 60 },
    { name: "Fri", orders: 60, inHand: 50 },
    { name: "Sat", orders: 90, inHand: 70 },
    { name: "Sun", orders: 55, inHand: 40 },
  ],
  monthly: [
    { name: "Jan", orders: 70, inHand: 50 },
    { name: "Feb", orders: 40, inHand: 60 },
    { name: "Mar", orders: 80, inHand: 55 },
    { name: "Apr", orders: 55, inHand: 35 },
    { name: "May", orders: 85, inHand: 75 },
    { name: "Jun", orders: 45, inHand: 50 },
  ],
  yearly: [
    { name: "Jan", orders: 92, inHand: 30 },
    { name: "Feb", orders: 22, inHand: 70 },
    { name: "Mar", orders: 86, inHand: 60 },
    { name: "Apr", orders: 55, inHand: 35 },
    { name: "May", orders: 78, inHand: 45 },
    { name: "Jun", orders: 42, inHand: 38 },
  ],
};

const baseCategoryData = [
  { name: "Footwear", value: 40, color: "#6366f1" },
  { name: "Electronics", value: 35, color: "#f59e0b" },
  { name: "Fashion", value: 25, color: "#10b981" },
];

const smoothSalesData = [
  { month: "Jan", orders: 95, inHand: 35 },
  { month: "Feb", orders: 20, inHand: 65 },
  { month: "Mar", orders: 80, inHand: 75 },
  { month: "Apr", orders: 60, inHand: 45 },
  { month: "May", orders: 85, inHand: 70 },
  { month: "Jun", orders: 50, inHand: 40 },
];

const baseActivities = [
  {
    id: 1,
    category: "Footwear",
    action: "Added 200 Units of Nike Air Max",
    time: "2h ago",
  },
  {
    id: 2,
    category: "Electronics",
    action: "Updated Product Prices",
    time: "Yesterday",
  },
  {
    id: 3,
    category: "Electronics",
    action: "Low stock warning: Bluetooth Speaker",
    time: "2 days ago",
  },
  {
    id: 4,
    category: "Fashion",
    action: "New seasonal handbags uploaded",
    time: "3 days ago",
  },
];

const initialProducts = [
  {
    id: 1,
    product: "Running Shoes H520",
    category: "Footwear",
    sales: "$440",
    stock: 25,
    status: "Available",
  },
  {
    id: 2,
    product: "Bluetooth Speaker",
    category: "Electronics",
    sales: "$240",
    stock: 10,
    status: "Low Stock",
  },
  {
    id: 3,
    product: "Handbag",
    category: "Fashion",
    sales: "$180",
    stock: 50,
    status: "Available",
  },
];

/* ───────────────── COMPONENT ───────────────── */
export default function ReportDashboard() {
  const router = useRouter();

  // filters / UI state
  const [chartPeriod, setChartPeriod] = useState("yearly");
  const [chartData, setChartData] = useState(chartDataSets.yearly);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [showWarning, setShowWarning] = useState(true);

  useEffect(() => setChartData(chartDataSets[chartPeriod]), [chartPeriod]);

  // warning auto-close (1 minute)
  useEffect(() => {
    if (!showWarning) return;
    const t = setTimeout(() => setShowWarning(false), 60000);
    return () => clearTimeout(t);
  }, [showWarning]);

  const filteredProducts = initialProducts.filter((p) => {
    const matchesSearch = p.product
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = initialProducts.filter((p) => p.stock < 15);
  const filteredCategories =
    filterCategory === "All"
      ? baseCategoryData
      : baseCategoryData.filter((c) => c.name === filterCategory);
  const filteredActivities =
    filterCategory === "All"
      ? baseActivities
      : baseActivities.filter((a) => a.category === filterCategory);

  /* -------------------- Exports -------------------- */
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Inventory Report", 14, 16);
    autoTable(doc, {
      startY: 22,
      head: [["Product", "Category", "Sales", "Stock", "Status"]],
      body: filteredProducts.map((p) => [
        p.product,
        p.category,
        p.sales,
        p.stock,
        p.status,
      ]),
    });
    doc.save("report.pdf");
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredProducts);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, "report.xlsx");
  };

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-[#f9fafc] text-gray-800 px-4 sm:px-6 lg:px-8 py-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-lg sm:text-2xl font-semibold">Report Dashboard</h1>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 text-sm rounded-md hover:bg-blue-700 w-full sm:w-auto justify-center"
          >
            <FileDown size={14} /> PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 bg-green-600 text-white px-3 py-1.5 text-sm rounded-md hover:bg-green-700 w-full sm:w-auto justify-center"
          >
            <FileSpreadsheet size={14} /> Excel
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-gray-600 text-white px-3 py-1.5 text-sm rounded-md hover:bg-gray-700 w-full sm:w-auto justify-center"
          >
            <Printer size={14} /> Print
          </button>
        </div>
      </div>

      {/* WARNING BANNER (auto-close or manual close) */}
      {showWarning && lowStockItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-l-4 border-red-300 p-3 mb-6 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
        >
          <div className="flex gap-3 items-center">
            <AlertTriangle className="text-yellow-700 w-5 h-5" />
            <div className="text-sm">
              <span className="font-medium">
                {lowStockItems.length} low stock item(s)
              </span>
              <div className="text-xs text-gray-600">
                <button
                  onClick={() => {
                    setFilterCategory("Electronics");
                    setShowWarning(false);
                  }}
                  className="underline text-blue-600"
                >
                  View details
                </button>{" "}
                or check product list.
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowWarning(false)}
            className="self-end sm:self-auto text-gray-600 hover:text-gray-800"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            title: "Total Revenue",
            value: "$205.25k",
            icon: <ShoppingBag className="text-purple-600" />,
            color: "purple",
            trend: "+4.5%",
          },
          {
            title: "Total Customers",
            value: "2,755",
            icon: <Users className="text-blue-600" />,
            color: "blue",
            trend: "+3.2%",
          },
          {
            title: "Total Products",
            value: "2058",
            icon: <Package className="text-yellow-600" />,
            color: "yellow",
            trend: "+4.1%",
          },
          {
            title: "Low Stock Items",
            value: `${lowStockItems.length}`,
            icon: <TrendingUp className="text-red-500" />,
            color: "red",
            trend: "-1.2%",
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-lg p-4 shadow-sm border"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500">{card.title}</p>
                <div className="text-lg font-semibold">{card.value}</div>
              </div>
              <div className={`p-2 rounded-md bg-${card.color}-100`}>
                {card.icon}
              </div>
            </div>
            <div
              className={`mt-2 text-xs ${
                card.trend.startsWith("-") ? "text-red-600" : "text-green-600"
              }`}
            >
              {card.trend}
            </div>
          </motion.div>
        ))}
      </div>

      {/* CHARTS: Sales Analytics + Category Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sales Analytics (dual-line area-like with gradients) */}
        <motion.div
          className="bg-white rounded-lg p-4 shadow-sm border lg:col-span-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="text-base font-semibold text-gray-800">
                Smooth Sales Analytics
              </h2>
              <p className="text-sm text-gray-500">
                Quick analytics on orderings (smoothed view)
              </p>
            </div>

            {/* 👇 PERIOD BUTTONS */}
            <div className="flex gap-2">
              {["weekly", "monthly", "yearly"].map((p) => (
                <button
                  key={p}
                  onClick={() => setChartPeriod(p)}
                  className={`px-3 py-1 text-sm rounded-md border ${
                    chartPeriod === p
                      ? "bg-gray-200 font-medium"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="colorInHand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#4F46E5"
                  fill="url(#colorOrders)"
                />
                <Area
                  type="monotone"
                  dataKey="inHand"
                  stroke="#EF4444"
                  fill="url(#colorInHand)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          className="bg-white rounded-lg p-4 shadow-sm border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 className="text-base font-semibold text-gray-800 mb-2">
            Category Distribution
          </h3>
          <div className="h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={filteredCategories}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  innerRadius={40}
                  label
                >
                  {filteredCategories.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* SEARCH + FILTER (above table) */}
      <div className="bg-white rounded-lg p-4 shadow-sm border mb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border rounded-md text-sm outline-none focus:ring focus:ring-blue-100"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm"
          >
            <option value="All">All Categories</option>
            {baseCategoryData.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* PRODUCT TABLE */}
      <motion.div
        className="bg-white rounded-lg p-4 shadow-sm border mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          Detailed Report
        </h3>

        {/* table is responsive with fixed columns; no horizontal scroll required */}
        <div className="overflow-hidden">
          <table className="w-full text-left text-sm table-fixed">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-2 w-1/4">Product</th>
                <th className="py-2 w-1/5">Category</th>
                <th className="py-2 w-1/5">Sales</th>
                <th className="py-2 w-1/6">Stock</th>
                <th className="py-2 w-1/6">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((row, i) => (
                  <motion.tr
                    key={row.id}
                    className="border-b hover:bg-gray-50 transition cursor-pointer"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => {
                      // Product detail route (app router)
                      // Product detail page should be placed at: app/inventory/products/[id]/page.jsx
                      router.push(`/inventory/products/${row.id}`);
                    }}
                  >
                    <td className="py-3 pr-2">{row.product}</td>
                    <td className="py-3">{row.category}</td>
                    <td className="py-3">{row.sales}</td>
                    <td
                      className={`py-3 ${
                        row.stock < 15 ? "text-red-500 font-medium" : ""
                      }`}
                    >
                      {row.stock}
                    </td>
                    <td
                      className={`${
                        row.status === "Low Stock"
                          ? "text-red-500 font-medium"
                          : "text-green-600 font-medium"
                      } py-3`}
                    >
                      {row.status}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 py-6">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* RECENT ACTIVITIES & QUICK STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="bg-white rounded-lg p-4 shadow-sm border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 className="text-base font-semibold text-gray-800 mb-3">
            Recent Activities
          </h3>
          <div className="space-y-3 text-sm">
            {filteredActivities.map((a) => (
              <div key={a.id} className="flex gap-3">
                <Clock className="text-gray-400 w-4 h-4 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-800">{a.action}</div>
                  <div className="text-xs text-gray-500">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg p-4 shadow-sm border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 className="text-base font-semibold text-gray-800 mb-3">
            Quick Stats
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <BarChart3 className="text-indigo-500 w-4 h-4" />
              <div>
                Active Categories:{" "}
                <span className="font-medium">{filteredCategories.length}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TrendingUp className="text-green-500 w-4 h-4" />
              <div>
                Low Stock %:{" "}
                <span className="font-medium">
                  {Math.round(
                    (lowStockItems.length / initialProducts.length) * 100
                  )}
                  %
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShoppingBag className="text-purple-500 w-4 h-4" />
              <div>
                Average Sales: <span className="font-medium">$320</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
