"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Upload, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createCategory, updateCategory, fetchCategories } from "@/features/categories/categoriesSlice";
import { toast } from "react-hot-toast";

export default function AddCategoryModal({ onClose, editData = null, forceLevel = null }) {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.categories);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(editData?.image?.url || null);

  const [formData, setFormData] = useState({
    name: editData?.name || "",
    slug: editData?.slug || "",
    description: editData?.description || "",
    level: editData?.level || forceLevel || 1,
    parentCategory: editData?.parentCategory || "",
    parentLevel1: "",
    parentLevel2: "",
    image: {
      url: editData?.image?.url || "",
      alt: editData?.image?.alt || ""
    },
    seo: {
      metaTitle: editData?.seo?.metaTitle || "",
      metaDescription: editData?.seo?.metaDescription || "",
      keywords: editData?.seo?.keywords || []
    },
    attributes: editData?.attributes || []
  });

  const [keyword, setKeyword] = useState("");
  const [newAttribute, setNewAttribute] = useState({
    name: "",
    type: "text",
    required: false,
    options: []
  });
  const [optionInput, setOptionInput] = useState("");

  useEffect(() => {
    dispatch(fetchCategories({ limit: 100 }));
  }, [dispatch]);

  // When categories load, if editing, prefill cascading parent selects
  useEffect(() => {
    if (!items || items.length === 0) return;
    if (editData && editData.parentCategory) {
      const getId = (pc) => (typeof pc === 'string' ? pc : pc?._id || "");
      const parentId = getId(editData.parentCategory);
      if (editData.level === 2) {
        setFormData((prev) => ({ ...prev, parentCategory: parentId, parentLevel1: parentId }));
      } else if (editData.level === 3) {
        const level2 = items.find((c) => (c._id === parentId) || (typeof c._id !== 'undefined' && c._id === parentId));
        const parentLevel1 = level2?.parentCategory ? (typeof level2.parentCategory === 'string' ? level2.parentCategory : level2.parentCategory?._id) : "";
        setFormData((prev) => ({ ...prev, parentCategory: parentId, parentLevel2: parentId, parentLevel1: parentLevel1 || "" }));
      }
    }
  }, [items, editData]);

  // Auto-generate slug from name
  useEffect(() => {
    if (!editData && formData.name) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.name, editData]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({
          ...formData,
          image: {
            url: reader.result,
            alt: formData.name || "Category image"
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const addKeyword = () => {
    if (keyword.trim() && !formData.seo.keywords.includes(keyword.trim())) {
      setFormData({
        ...formData,
        seo: {
          ...formData.seo,
          keywords: [...formData.seo.keywords, keyword.trim()]
        }
      });
      setKeyword("");
    }
  };

  const removeKeyword = (index) => {
    setFormData({
      ...formData,
      seo: {
        ...formData.seo,
        keywords: formData.seo.keywords.filter((_, i) => i !== index)
      }
    });
  };

  const addOption = () => {
    if (optionInput.trim() && !newAttribute.options.includes(optionInput.trim())) {
      setNewAttribute({
        ...newAttribute,
        options: [...newAttribute.options, optionInput.trim()]
      });
      setOptionInput("");
    }
  };

  const removeOption = (index) => {
    setNewAttribute({
      ...newAttribute,
      options: newAttribute.options.filter((_, i) => i !== index)
    });
  };

  const addAttribute = () => {
    if (newAttribute.name.trim()) {
      setFormData({
        ...formData,
        attributes: [...formData.attributes, { ...newAttribute }]
      });
      setNewAttribute({ name: "", type: "text", required: false, options: [] });
    }
  };

  const removeAttribute = (index) => {
    setFormData({
      ...formData,
      attributes: formData.attributes.filter((_, i) => i !== index)
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return false;
    }
    if (!formData.slug.trim()) {
      toast.error("Slug is required");
      return false;
    }
    // Level 2 requires Level 1 parent. Level 3 requires Level1 and Level2 selection.
    if (formData.level === 2 && !formData.parentLevel1) {
      toast.error("Please select a Level 1 (main) category as parent for Level 2");
      return false;
    }
    if (formData.level === 3) {
      if (!formData.parentLevel1) {
        toast.error("Please select a Level 1 (main) category first");
        return false;
      }
      if (!formData.parentLevel2) {
        toast.error("Please select a Level 2 (sub) category as parent for Level 3");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        ...formData,
        parentCategory: formData.parentCategory || undefined,
        image: formData.image.url ? formData.image : undefined
      };

      if (editData) {
        await dispatch(updateCategory({ id: editData._id, updates: payload })).unwrap();
        toast.success("Category updated successfully! ✨");
      } else {
        await dispatch(createCategory(payload)).unwrap();
        toast.success("Category created successfully! 🎉");
      }
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  // Immediate parent options helpers
  const level1Options = items.filter((cat) => Number(cat.level) === 1);
  const level2Options = (parentLevel1Id) => items.filter((cat) => Number(cat.level) === 2 && (
    // handle stored parentCategory as string or object
    (typeof cat.parentCategory === 'string' && cat.parentCategory === parentLevel1Id) ||
    (cat.parentCategory && typeof cat.parentCategory === 'object' && cat.parentCategory._id === parentLevel1Id)
  ));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-linear-to-r from-orange-500 to-orange-600 text-white px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
            <h2 className="text-2xl font-bold">
              {editData ? "Edit Category" : "Add New Category"}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Category Name */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g., Electronics"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="electronics"
                  />
                  <p className="text-xs text-gray-500 mt-1">Auto-generated from name</p>
                </div>

                {/* Category Level */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Category Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => {
                      if (forceLevel) return; // prevent change when forced
                      setFormData({ ...formData, level: Number(e.target.value), parentCategory: "", parentLevel1: "", parentLevel2: "" });
                    }}
                    disabled={!!forceLevel}
                    className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value={1}>Level 1 (Main Category)</option>
                    <option value={2}>Level 2 (Sub Category)</option>
                    <option value={3}>Level 3 (Sub-Sub Category)</option>
                  </select>
                  {forceLevel === 3 && (
                    <p className="text-xs text-gray-500 mt-1">You can only create Level 3 categories. Choose the main and sub category parents below.</p>
                  )}
                </div>

                {/* Parent Category (cascading selects) */}
                {formData.level > 1 && (
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Parent Category <span className="text-red-500">*</span>
                    </label>

                    {/* Level 2 creation: choose Level 1 parent */}
                    {formData.level === 2 && (
                      <select
                        required
                        value={formData.parentLevel1}
                        onChange={(e) => setFormData({ ...formData, parentLevel1: e.target.value, parentCategory: e.target.value })}
                        className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Select Level 1 (Main) Category</option>
                        {level1Options.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* Level 3 creation: choose Level 1 then Level 2 parent */}
                    {formData.level === 3 && (
                      <div className="space-y-3">
                        <select
                          required
                          value={formData.parentLevel1}
                          onChange={(e) => setFormData({ ...formData, parentLevel1: e.target.value, parentLevel2: "", parentCategory: "" })}
                          className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="">Select Level 1 (Main) Category</option>
                          {level1Options.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>

                        <select
                          required
                          value={formData.parentLevel2}
                          onChange={(e) => setFormData({ ...formData, parentLevel2: e.target.value, parentCategory: e.target.value })}
                          className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500"
                          disabled={!formData.parentLevel1}
                        >
                          <option value="">Select Level 2 (Sub) Category</option>
                          {level2Options(formData.parentLevel1).map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>

                        {!formData.parentLevel1 && (
                          <p className="text-xs text-gray-500">Choose a Level 1 category to load Level 2 options</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Brief description of the category..."
                  />
                </div>

                {/* SEO Keywords */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">SEO Keywords</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                      className="flex-1 px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Add keyword..."
                    />
                    <button
                      type="button"
                      onClick={addKeyword}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.seo.keywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm flex items-center gap-2"
                      >
                        {kw}
                        <button type="button" onClick={() => removeKeyword(idx)} className="hover:text-orange-900">
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Category Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-500 transition bg-gray-50">
                    {imagePreview ? (
                      <div className="relative">
                        <img src={imagePreview} alt="Preview" className="mx-auto h-48 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setFormData({ ...formData, image: { url: "", alt: "" } });
                          }}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto mb-3 text-gray-400" size={48} />
                        <p className="text-sm text-gray-600 mb-3">Upload Category Image</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer px-6 py-3 bg-orange-500 text-white rounded-lg inline-block hover:bg-orange-600 transition"
                        >
                          Choose File
                        </label>
                        <p className="text-xs text-gray-500 mt-2">Max 5MB</p>
                      </>
                    )}
                  </div>
                </div>

                {/* SEO Meta Title */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Meta Title (SEO)</label>
                  <input
                    type="text"
                    value={formData.seo.metaTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, seo: { ...formData.seo, metaTitle: e.target.value } })
                    }
                    className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="SEO title for search engines"
                  />
                </div>

                {/* SEO Meta Description */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Meta Description</label>
                  <textarea
                    value={formData.seo.metaDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seo: { ...formData.seo, metaDescription: e.target.value }
                      })
                    }
                    rows={3}
                    className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Brief description for search results..."
                  />
                </div>

                {/* Attributes Section */}
                <div className="border-2 border-orange-200 rounded-xl p-4 bg-orange-50">
                  <h3 className="font-semibold mb-3 text-gray-800">Product Attributes</h3>
                  
                  <div className="space-y-2 mb-3">
                    <input
                      type="text"
                      placeholder="Attribute name (e.g., Style)"
                      value={newAttribute.name}
                      onChange={(e) => setNewAttribute({ ...newAttribute, name: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                    
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={newAttribute.type}
                        onChange={(e) => setNewAttribute({ ...newAttribute, type: e.target.value })}
                        className="px-3 py-2 border rounded-lg"
                      >
                        <option value="text">Text</option>
                        <option value="select">Select</option>
                        <option value="number">Number</option>
                      </select>
                      <label className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-white">
                        <input
                          type="checkbox"
                          checked={newAttribute.required}
                          onChange={(e) => setNewAttribute({ ...newAttribute, required: e.target.checked })}
                        />
                        <span className="text-sm">Required</span>
                      </label>
                    </div>

                    {newAttribute.type === "select" && (
                      <>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add option..."
                            value={optionInput}
                            onChange={(e) => setOptionInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addOption())}
                            className="flex-1 px-3 py-2 border rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={addOption}
                            className="px-3 py-2 bg-orange-500 text-white rounded-lg"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {newAttribute.options.map((opt, idx) => (
                            <span key={idx} className="px-2 py-1 bg-white rounded text-xs flex items-center gap-1">
                              {opt}
                              <button type="button" onClick={() => removeOption(idx)}>
                                <X size={12} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={addAttribute}
                      className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                    >
                      Add Attribute
                    </button>
                  </div>

                  {/* Display Added Attributes */}
                  {formData.attributes.length > 0 && (
                    <div className="space-y-2">
                      {formData.attributes.map((attr, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-white rounded border">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{attr.name}</p>
                            <p className="text-xs text-gray-500">
                              {attr.type} {attr.required && "• Required"}
                              {attr.options?.length > 0 && ` • ${attr.options.length} options`}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttribute(idx)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 transition font-medium shadow-lg"
              >
                {loading ? "Saving..." : editData ? "Update Category" : "Create Category"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}