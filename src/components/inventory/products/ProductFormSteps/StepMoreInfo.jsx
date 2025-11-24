"use client";

import { motion } from "framer-motion";

export default function StepMoreInfo({ formData, updateFormData, updateNestedField = null, errors, showAdvanced = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-semibold mb-2">Short Description</label>
        <input
          type="text"
          value={(formData.description && formData.description.short) || ""}
          onChange={(e) => {
            if (updateNestedField) updateNestedField('description','short', e.target.value);
            else updateFormData({ description: { ...(formData.description || {}), short: e.target.value } });
          }}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          placeholder="Short summary (one line)"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Long Description</label>
        <textarea
          value={(formData.description && formData.description.long) || ""}
          onChange={(e) => {
            if (updateNestedField) updateNestedField('description','long', e.target.value);
            else updateFormData({ description: { ...(formData.description || {}), long: e.target.value } });
          }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 360)}px`;
            }}
            rows={6}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 resize-none max-h-72 overflow-auto"
          placeholder="Detailed product description..."
        />
      </div>


      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Manufacturer</label>
          <input
            type="text"
            value={formData.manufacturer || ""}
            onChange={(e) => updateFormData({ manufacturer: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            placeholder="Manufacturer"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">(Optional) Secondary Info</label>
          <input
            type="text"
            value={formData.supplier || ""}
            onChange={(e) => updateFormData({ supplier: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            placeholder="Supplier / secondary info"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Tags (comma separated)</label>
        <input
          type="text"
          value={(formData.tags || []).join(", ")}
          onChange={(e) => updateFormData({ tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          placeholder="e.g., headphones, audio, bose"
        />
      </div>
    </motion.div>
  );
}
