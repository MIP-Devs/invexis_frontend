"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  PlusCircle,
  Bell,
  Search,
  Trash2,
  Edit2,
  Eye,
  MapPin,
  Users,
  ShoppingBag,
  BarChart2,
  X,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

/* ----------------------------- Theme / Data ----------------------------- */
const THEME = {
  bg: "bg-gray-50",
  panel: "bg-white",
  accent: "text-orange-500",
  muted: "text-gray-600",
};

const initialBranches = [
  {
    id: "b-001",
    name: "Central Mall Outlet",
    manager: "Alice Johnson",
    location: "Downtown, Block A",
    monthlySales: 42340,
    status: "Active",
    trend: [30, 40, 35, 50, 60, 55, 62],
  },
  {
    id: "b-002",
    name: "Riverside Shop",
    manager: "Mark Evans",
    location: "Riverside Ave",
    monthlySales: 28900,
    status: "Active",
    trend: [20, 25, 30, 22, 28, 34, 30],
  },
  {
    id: "b-003",
    name: "North Plaza",
    manager: "Sofia Kim",
    location: "North Rd",
    monthlySales: 15420,
    status: "Under Review",
    trend: [10, 18, 12, 22, 20, 15, 14],
  },
];

/* ----------------------------- Small Components ----------------------------- */
function KpiCard({ title, value, icon }) {
  return (
    <div className="rounded-xl p-4 shadow-sm border border-gray-200 flex items-start gap-3 bg-white">
      <div className="p-2 rounded-md bg-orange-100 text-orange-500">
        {icon}
      </div>
      <div>
        <div className="text-xs text-gray-500">{title}</div>
        <div className="text-lg font-semibold text-gray-800">{value}</div>
      </div>
    </div>
  );
}

function MiniSparkline({ data, color = "#F97316" }) {
  const chartData = (data || []).map((v, i) => ({ x: i, y: v }));
  return (
    <div className="w-36 h-12">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="gradMini" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.35} />
              <stop offset="95%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="y"
            stroke={color}
            fill="url(#gradMini)"
            strokeWidth={2}
            dot={{ r: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ----------------------------- Main Component ----------------------------- */
export default function ShopsPage() {
  const [branches, setBranches] = useState(initialBranches);
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [notifTarget, setNotifTarget] = useState("All");
  const [notifText, setNotifText] = useState("");

  const [newBranch, setNewBranch] = useState({
    name: "",
    manager: "",
    location: "",
    monthlySales: "",
    status: "Active",
  });

  const filtered = useMemo(() => {
    return branches.filter((b) => {
      const matchesQuery =
        b.name.toLowerCase().includes(query.toLowerCase()) ||
        b.manager.toLowerCase().includes(query.toLowerCase()) ||
        b.location.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = filterStatus === "All" || b.status === filterStatus;
      return matchesQuery && matchesStatus;
    });
  }, [branches, query, filterStatus]);

  /* ----------------------------- Actions ----------------------------- */
  function handleAddBranch(e) {
    e.preventDefault();
    if (!newBranch.name.trim()) return alert("Provide branch name");
    const created = {
      id: `b-${Math.random().toString(36).slice(2, 7)}`,
      ...newBranch,
      monthlySales: Number(newBranch.monthlySales) || 0,
      trend: [20, 30, 40, 35, 45, 50, 55],
    };
    setBranches((prev) => [created, ...prev]);
    setShowAddModal(false);
    setNewBranch({ name: "", manager: "", location: "", monthlySales: "", status: "Active" });
  }

  function handleDeleteBranch(id) {
    if (!confirm("Are you sure you want to delete this branch?")) return;
    setBranches((prev) => prev.filter((b) => b.id !== id));
  }

  function handleSendNotification(e) {
    e.preventDefault();
    if (!notifText.trim()) return alert("Please enter a message");
    alert(`Notification sent to ${notifTarget}: "${notifText}"`);
    setNotifText("");
    setShowNotifModal(false);
  }

  return (
    <div className={`min-h-screen ${THEME.bg} py-8 px-1 sm:px-1`}>
      <div className="max-w-20xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-md p-2 bg-orange-100 text-orange-500">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-gray-900 text-xl font-semibold">Shops</h1>
              <p className="text-sm text-gray-600">
                Manage branches, send announcements & monitor performance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative hidden sm:block">
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={16}
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search branches, manager or location"
                className="pl-10 pr-3 py-2 rounded-md border border-gray-200 bg-white text-gray-700 w-72 focus:ring-2 focus:ring-orange-200 outline-none"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-md text-sm shadow"
            >
              <PlusCircle size={16} /> Add Branch
            </button>
            <button
              onClick={() => setShowNotifModal(true)}
              className="flex items-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-600 px-3 py-2 rounded-md text-sm border border-orange-200"
            >
              <Bell size={16} /> Announce
            </button>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KpiCard
            title="Total Branches"
            value={branches.length}
            icon={<Users className="w-5 h-5" />}
          />
          <KpiCard
            title="Active Branches"
            value={branches.filter((b) => b.status === "Active").length}
            icon={<MapPin className="w-5 h-5" />}
          />
          <KpiCard
            title="Total Monthly Sales"
            value={`$${branches
              .reduce((s, b) => s + b.monthlySales, 0)
              .toLocaleString()}`}
            icon={<ShoppingBag className="w-5 h-5" />}
          />
          <KpiCard
            title="Avg. Branch Sales"
            value={`$${Math.round(
              branches.reduce((s, b) => s + b.monthlySales, 0) / branches.length
            ).toLocaleString()}`}
            icon={<BarChart2 className="w-5 h-5" />}
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-700">Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-200 bg-white text-gray-700 px-2 py-1 rounded-md"
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Under Review">Under Review</option>
              </select>
            </div>
            <div className="text-sm text-gray-500">
              Showing <span className="text-gray-800">{filtered.length}</span>{" "}
              branches
            </div>
          </div>

          <div className="overflow-hidden rounded-md">
            <table className="w-full text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="py-3 px-3">Branch</th>
                  <th className="py-3 px-3">Manager</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Monthly Sales</th>
                  <th className="py-3 px-3">Performance</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr
                    key={b.id}
                    className="border-t border-gray-100 hover:bg-orange-50 transition"
                  >
                    <td className="py-3 px-3 font-medium text-gray-800">
                      {b.name}
                      <div className="text-xs text-gray-400">{b.id}</div>
                    </td>
                    <td className="py-3 px-3 text-gray-700">{b.manager}</td>
                    <td className="py-3 px-3 text-gray-600 flex items-center gap-1">
                      <MapPin size={12} className="text-orange-400" />
                      {b.location}
                    </td>
                    <td className="py-3 px-3 text-orange-600 font-semibold">
                      ${b.monthlySales.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <MiniSparkline data={b.trend} color="#F97316" />
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          b.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => alert("View branch")}
                          className="p-2 rounded-md bg-gray-50 hover:bg-orange-100"
                        >
                          <Eye size={14} className="text-gray-700" />
                        </button>
                        <button
                          onClick={() => alert("Edit branch")}
                          className="p-2 rounded-md bg-gray-50 hover:bg-orange-100"
                        >
                          <Edit2 size={14} className="text-gray-700" />
                        </button>
                        <button
                          onClick={() => setShowNotifModal(true)}
                          className="p-2 rounded-md bg-gray-50 hover:bg-orange-100"
                        >
                          <Bell size={14} className="text-gray-700" />
                        </button>
                        <button
                          onClick={() => handleDeleteBranch(b.id)}
                          className="p-2 rounded-md bg-red-50 hover:bg-red-100"
                        >
                          <Trash2 size={14} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-6 text-center text-gray-500 italic"
                    >
                      No branches found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Branch Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowAddModal(false)}
          />
          <motion.form
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onSubmit={handleAddBranch}
            className="relative z-10 w-full max-w-lg bg-white rounded-xl shadow-lg p-6 border border-gray-200"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Add New Branch
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                placeholder="Branch name"
                className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-orange-200 outline-none"
                value={newBranch.name}
                onChange={(e) =>
                  setNewBranch((s) => ({ ...s, name: e.target.value }))
                }
              />
              <input
                placeholder="Manager"
                className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-orange-200 outline-none"
                value={newBranch.manager}
                onChange={(e) =>
                  setNewBranch((s) => ({ ...s, manager: e.target.value }))
                }
              />
              <input
                placeholder="Location"
                className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-orange-200 outline-none"
                value={newBranch.location}
                onChange={(e) =>
                  setNewBranch((s) => ({ ...s, location: e.target.value }))
                }
              />
              <input
                placeholder="Monthly sales"
                className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-orange-200 outline-none"
                value={newBranch.monthlySales}
                onChange={(e) =>
                  setNewBranch((s) => ({
                    ...s,
                    monthlySales: e.target.value,
                  }))
                }
              />
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-2 rounded bg-orange-500 hover:bg-orange-600 text-white"
              >
                Create
              </button>
            </div>
          </motion.form>
        </div>
      )}

      {/* Notification Modal */}
      {showNotifModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowNotifModal(false)}
          />
          <motion.form
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            onSubmit={handleSendNotification}
            className="relative z-10 w-full max-w-lg bg-white rounded-xl shadow-lg p-6 border border-gray-200"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Send Announcement
              </h3>
              <button
                type="button"
                onClick={() => setShowNotifModal(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <textarea
              rows={4}
              placeholder="Write your message here..."
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-orange-200 outline-none"
              value={notifText}
              onChange={(e) => setNotifText(e.target.value)}
            />

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNotifModal(false)}
                className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-2 rounded bg-orange-500 hover:bg-orange-600 text-white"
              >
                Send
              </button>
            </div>
          </motion.form>
        </div>
      )}
    </div>
  );
}
