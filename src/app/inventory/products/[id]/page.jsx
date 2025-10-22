"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { ArrowLeft, Package, Tag } from "lucide-react";

const productData = [
  {
    id: 1,
    name: "Running Shoes H520",
    category: "Footwear",
    price: "$440",
    stock: 25,
    status: "Available",
    salesTrend: [
      { day: "Mon", sales: 50 },
      { day: "Tue", sales: 80 },
      { day: "Wed", sales: 65 },
      { day: "Thu", sales: 95 },
      { day: "Fri", sales: 75 },
    ],
  },
  {
    id: 2,
    name: "Bluetooth Speaker",
    category: "Electronics",
    price: "$240",
    stock: 10,
    status: "Low Stock",
    salesTrend: [
      { day: "Mon", sales: 30 },
      { day: "Tue", sales: 40 },
      { day: "Wed", sales: 35 },
      { day: "Thu", sales: 50 },
      { day: "Fri", sales: 45 },
    ],
  },
  {
    id: 3,
    name: "Handbag",
    category: "Fashion",
    price: "$180",
    stock: 50,
    status: "Available",
    salesTrend: [
      { day: "Mon", sales: 70 },
      { day: "Tue", sales: 65 },
      { day: "Wed", sales: 90 },
      { day: "Thu", sales: 85 },
      { day: "Fri", sales: 100 },
    ],
  },
];

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const product = productData.find((p) => p.id === Number(id));

  if (!product)
    return <div className="p-6 text-center text-gray-500">Product not found</div>;

  return (
    <motion.div
      className="p-6 bg-gray-50 min-h-screen text-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <button
        onClick={() => router.back()}
        className="flex items-center text-blue-600 hover:underline mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </button>

      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <h1 className="text-2xl font-semibold mb-4">{product.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-gray-500 text-sm flex items-center gap-2">
              <Package size={16} /> Category:{" "}
              <span className="font-medium text-gray-800">
                {product.category}
              </span>
            </p>
            <p className="text-gray-500 text-sm flex items-center gap-2 mt-2">
              <Tag size={16} /> Price:{" "}
              <span className="font-medium text-gray-800">{product.price}</span>
            </p>
            <p
              className={`text-sm mt-2 ${
                product.stock < 15 ? "text-red-500" : "text-gray-500"
              }`}
            >
              Stock:{" "}
              <span className="font-medium text-gray-800">
                {product.stock}
              </span>
            </p>
            <p
              className={`mt-2 font-medium ${
                product.status === "Low Stock"
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {product.status}
            </p>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={product.salesTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
