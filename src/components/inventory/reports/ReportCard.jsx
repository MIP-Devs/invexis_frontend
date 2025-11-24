"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function ReportCard({ stat, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`${stat.bgColor} p-3 rounded-xl`}>
          {stat.icon}
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${
          stat.changeType === "increase" ? "text-green-600" : "text-red-600"
        }`}>
          {stat.changeType === "increase" ? (
            <TrendingUp size={16} />
          ) : (
            <TrendingDown size={16} />
          )}
          <span>{stat.change}</span>
        </div>
      </div>
      <h3 className="text-sm text-gray-600 mb-1">{stat.title}</h3>
      <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
    </motion.div>
  );
}