// src/components/inventory/products/ProductFormSteps/StepInventory.jsx
"use client";

import { motion } from "framer-motion";
import { Package } from "lucide-react";

// Realistic mock warehouses (used when real data is missing or undefined)
const MOCK_WAREHOUSES = [
  { _id: "wh1", name: "Main Warehouse", location: { city: "Kigali" } },
  { _id: "wh2", name: "Secondary Storage", location: { city: "Huye" } },
  { _id: "wh3", name: "Regional Depot", location: { city: "Musanze" } },
  { _id: "wh4", name: "Central Hub", location: { city: "Kigali" } },
];

export default function StepInventory({ 
  formData, 
  updateFormData, 
  updateNestedField, 
  errors, 
  warehouses = [] // can be undefined
}) {
  // BULLETPROOF: Always use a valid array
  const safeWarehouses = Array.isArray(warehouses) && warehouses.length > 0 
    ? warehouses 
    : MOCK_WAREHOUSES;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      {/* Stock Levels */}
      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#333] mb-2">
            Stock Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.stock || ""}
            onChange={(e) => updateFormData({ stock: e.target.value })}
            className={`w-full px-5 py-4 border rounded-xl focus:outline-none focus:border-[#FB923C] focus:ring-4 focus:ring-orange-100 transition ${
              errors.stock ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="0"
            min="0"
          />
          {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#333] mb-2">
            Min Stock Level
          </label>
          <input
            type="number"
            value={formData.minStockLevel || ""}
            onChange={(e) => updateFormData({ minStockLevel: e.target.value })}
            className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#FB923C] focus:ring-4 focus:ring-orange-100 transition"
            placeholder="10"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#333] mb-2">
            Max Stock Level
          </label>
          <input
            type="number"
            value={formData.maxStockLevel || ""}
            onChange={(e) => updateFormData({ maxStockLevel: e.target.value })}
            className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#FB923C] focus:ring-4 focus:ring-orange-100 transition"
            placeholder="100"
            min="0"
          />
        </div>
      </div>

      {/* Warehouse Location */}
      <div>
        <label className="block text-sm font-medium text-[#333] mb-2">
          Warehouse Location <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.warehouse || ""}
          onChange={(e) => updateFormData({ warehouse: e.target.value })}
          className={`w-full px-5 py-4 border rounded-xl focus:outline-none focus:border-[#FB923C] focus:ring-4 focus:ring-orange-100 transition ${
            errors.warehouse ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select Warehouse</option>
          {safeWarehouses.map((wh) => (
            <option key={wh._id} value={wh._id}>
              {wh.name} - {wh.location?.city || "N/A"}
            </option>
          ))}
        </select>
        {errors.warehouse && <p className="text-red-500 text-xs mt-1">{errors.warehouse}</p>}
      </div>

      {/* Expiry Date */}
      <div>
        <label className="block text-sm font-medium text-[#333] mb-2">
          Expiry Date (Optional)
        </label>
        <input
          type="date"
          value={formData.expiryDate || ""}
          onChange={(e) => updateFormData({ expiryDate: e.target.value })}
          className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#FB923C] focus:ring-4 focus:ring-orange-100 transition"
          min={new Date().toISOString().split("T")[0]}
        />
      </div>

      {/* Specifications */}
      <div className="border border-gray-200 rounded-2xl bg-white p-8">
        <h3 className="text-xl font-semibold text-[#1F1F1F] mb-6 flex items-center gap-3">
          <Package size={24} className="text-[#FB923C]" />
          Product Specifications (Optional)
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <input
            type="text"
            value={formData.specifications?.brand || ""}
            onChange={(e) => updateNestedField("specifications", "brand", e.target.value)}
            className="px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#FB923C] focus:ring-4 focus:ring-orange-100 transition"
            placeholder="Brand"
          />
          <input
            type="text"
            value={formData.specifications?.model || ""}
            onChange={(e) => updateNestedField("specifications", "model", e.target.value)}
            className="px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#FB923C] focus:ring-4 focus:ring-orange-100 transition"
            placeholder="Model"
          />
          <input
            type="text"
            value={formData.specifications?.color || ""}
            onChange={(e) => updateNestedField("specifications", "color", e.target.value)}
            className="px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#FB923C] focus:ring-4 focus:ring-orange-100 transition"
            placeholder="Color"
          />
          <input
            type="text"
            value={formData.specifications?.warranty || ""}
            onChange={(e) => updateNestedField("specifications", "warranty", e.target.value)}
            className="px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#FB923C] focus:ring-4 focus:ring-orange-100 transition"
            placeholder="Warranty (e.g., 1 year)"
          />
        </div>
      </div>
    </motion.div>
  );
}