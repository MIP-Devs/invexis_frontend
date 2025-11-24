// src/app/inventory/products/add/page.jsx
"use client";

import { useState } from "react";
import useAuth from '@/hooks/useAuth';
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { createProduct } from "@/features/products/productsSlice";
import useProductForm from "@/components/inventory/products/ProductFormHooks/useProductForm";
import StepBasicInfo from "@/components/inventory/products/ProductFormSteps/StepBasicInfo";
import StepInventory from "@/components/inventory/products/ProductFormSteps/StepInventory";
import StepMedia from "@/components/inventory/products/ProductFormSteps/StepMedia";
import StepAdvanced from "@/components/inventory/products/ProductFormSteps/StepAdvanced";
import StepMoreInfo from "@/components/inventory/products/ProductFormSteps/StepMoreInfo";
import { AnimatePresence } from "framer-motion";

const steps = [
  { id: 1, title: "Basic Info" },
  { id: 2, title: "More Info" },
  { id: 3, title: "Inventory" },
  { id: 4, title: "Media" },
  { id: 5, title: "Advanced" },
];

export default function AddProductPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { items: categories = [] } = useSelector((state) => state.categories || { items: [] });
  const { items: warehouses = [] } = useSelector((state) => state.warehouses || { items: [] });

  const {
    formData,
    errors,
    currentStep,
    updateFormData,
    updateNestedField,
    validateStep,
    handleImageUpload,
    removeImage,
    setPrimaryImage,
    addTag,
    removeTag,
    tagInput,
    setTagInput,
    nextStep,
    prevStep,
  } = useProductForm();

  const { user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!validateStep(5)) {
      toast.error("Please fix all errors before saving");
      return;
    }


    // Normalize & collect payload for API
    const basePrice =
      formData.pricing?.basePrice !== undefined && formData.pricing?.basePrice !== ""
        ? Number(formData.pricing.basePrice)
        : formData.price
        ? Number(formData.price)
        : null;

    const costPrice =
      formData.pricing?.cost !== undefined && formData.pricing?.cost !== ""
        ? Number(formData.pricing.cost)
        : formData.costPrice
        ? Number(formData.costPrice)
        : null;

    const normalizedStock = formData.stock !== undefined && formData.stock !== "" ? Number(formData.stock) : null;

    const fullProductData = {
      name: (formData.name || "").trim(),
      sku: formData.sku || undefined,
      category: formData.category || undefined,
      brand: formData.brand || undefined,
      tags: Array.isArray(formData.tags) ? formData.tags : [],

      description: formData.description || undefined,
      specifications: formData.specifications || {},

      stock: normalizedStock,
      minStockLevel: formData.minStockLevel ? Number(formData.minStockLevel) : undefined,
      maxStockLevel: formData.maxStockLevel ? Number(formData.maxStockLevel) : undefined,
      warehouse: formData.warehouse || undefined,
      expiryDate: formData.expiryDate || undefined,

      images: Array.isArray(formData.images) ? formData.images : [],

      pricing: {
        basePrice: basePrice,
        salePrice:
          formData.pricing?.salePrice !== undefined && formData.pricing?.salePrice !== ""
            ? Number(formData.pricing.salePrice)
            : undefined,
        currency: formData.pricing?.currency || "USD",
        cost: costPrice,
      },

      // legacy fields kept for compatibility
      price: basePrice,
      costPrice: costPrice,

      status: formData.status || "active",
      visibility: formData.visibility || "public",
      isTaxable: !!formData.isTaxable,
      trackInventory: !!formData.trackInventory,
      allowBackorder: !!formData.allowBackorder,
      isPerishable: !!formData.isPerishable,
      notes: formData.notes || undefined,
      // product identifiers
      asin: formData.asin || formData.specifications?.asin || undefined,
      // companyId is required by the backend - prefer authenticated user's company
      companyId: user?.company?.id || user?.company_id || user?.company?._id || user?.company || undefined,
    };

    // Basic client-side validation before sending to API
    if (!fullProductData.name) {
      toast.error("Product name is required");
      return;
    }
    if (!fullProductData.category) {
      toast.error("Category is required");
      return;
    }
    if (fullProductData.pricing.basePrice === null || isNaN(fullProductData.pricing.basePrice) || fullProductData.pricing.basePrice <= 0) {
      toast.error("Valid product price is required");
      return;
    }

    // If SKU not provided, generate a unique SKU client-side so DB receives a unique code
    const generateSku = (product) => {
      // Prefer brand initials + short name + timestamp
      const brand = (product.brand || '').toString().trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
      const brandPart = brand ? brand.slice(0, 3) : 'PRD';
      const namePart = (product.name || '').toString().trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6) || 'ITEM';
      const ts = Date.now().toString(36).toUpperCase();
      const random = Math.floor(Math.random() * 900 + 100).toString();
      return `${brandPart}-${namePart}-${ts}-${random}`;
    };

    if (!fullProductData.sku) {
      fullProductData.sku = generateSku(fullProductData);
    }

    // Ensure ASIN exists (backend requires it). Use provided ASIN or fall back to SKU.
    if (!fullProductData.asin) {
      fullProductData.asin = fullProductData.sku;
    }

    // Ensure slug exists (backend requires it)
    const slugify = (s = '') =>
      s
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-_]/g, '');
    if (!fullProductData.slug && fullProductData.name) fullProductData.slug = slugify(fullProductData.name);

    // Normalize description to object with `short` which backend requires
    if (!fullProductData.description) {
      fullProductData.description = { short: '' };
    } else if (typeof fullProductData.description === 'string') {
      fullProductData.description = { short: fullProductData.description };
    } else if (typeof fullProductData.description === 'object' && !fullProductData.description.short) {
      fullProductData.description.short = '';
    }

    // Ensure pricing.basePrice exists (fallback to price)
    if (!fullProductData.pricing) fullProductData.pricing = { basePrice: fullProductData.price || null, currency: 'USD' };
    if ((fullProductData.pricing.basePrice === undefined || fullProductData.pricing.basePrice === null) && fullProductData.price) {
      fullProductData.pricing.basePrice = Number(fullProductData.price);
    }

    console.log("FULL PRODUCT DATA COLLECTED FROM ALL STEPS (normalized):", fullProductData);

    console.log("FULL PRODUCT DATA COLLECTED FROM ALL STEPS:", fullProductData);

    setIsSubmitting(true);

    if (!fullProductData.companyId) {
      console.warn('Creating product without companyId — backend may reject this. Auth user:', user);
    }

    // General sanitizer for payloads (used for both JSON and multipart paths)
    const sanitize = (obj) => {
      const out = Array.isArray(obj) ? [] : {};
      for (const [k, v] of Object.entries(obj)) {
        if (v === undefined || v === null) continue;
        if (typeof v === 'string') {
          const trimmed = v.trim();
          if (trimmed === '') continue;
          out[k] = trimmed;
          continue;
        }
        if (Array.isArray(v)) {
          const items = v
            .map((it) => (typeof it === 'object' && it !== null ? sanitize(it) : it))
            .filter((it) => !(it === null || it === undefined || (typeof it === 'string' && it.trim() === '')));
          if (items.length === 0) continue;
          out[k] = items;
          continue;
        }
        if (typeof v === 'object') {
          const nested = sanitize(v);
          if (nested && Object.keys(nested).length > 0) out[k] = nested;
          continue;
        }
        // numbers, booleans
        out[k] = v;
      }
      return out;
    };

    try {
      // Sanitize images: remove invalid file-system paths that browsers can't load (e.g., file:// or Windows drive paths)
      const sanitizeImagesArray = (imgs) => {
        if (!Array.isArray(imgs)) return [];
        return imgs.filter((im) => {
          const url = typeof im === 'string' ? im : im?.url || '';
          if (!url) return false;
          const lower = url.toLowerCase();
          // remove local file references
          if (lower.startsWith('file:')) return false;
          // windows absolute paths like C:\ or \server\ -> remove
          if (/^[a-z]:\\/i.test(url) || /^\\\\/.test(url)) return false;
          return true;
        }).map((im) => (typeof im === 'string' ? im : im));
      };

      // sanitizer is defined above so catch handler can reuse it

      // Ensure variations (if present) don't contain null/empty skus which would trigger duplicate-null unique index errors
      if (Array.isArray(fullProductData.variations)) {
        fullProductData.variations = fullProductData.variations.filter((v) => v && v.sku);
        if (fullProductData.variations.length === 0) delete fullProductData.variations;
      } else if ('variations' in fullProductData) {
        delete fullProductData.variations;
      }

      fullProductData.images = sanitizeImagesArray(fullProductData.images || []);

      // If images contain data URLs (base64) we'll send multipart/form-data
      const images = Array.isArray(fullProductData.images) ? fullProductData.images : [];
      const dataUrlImages = images.filter((im) => {
        const url = typeof im === 'string' ? im : im?.url || '';
        return typeof url === 'string' && url.startsWith('data:');
      });

      // helper to convert dataURL to Blob
      const dataURLToBlob = (dataURL) => {
        const parts = dataURL.split(',');
        const meta = parts[0];
        const isBase64 = meta.indexOf('base64') >= 0;
        const contentType = meta.split(':')[1].split(';')[0];
        const raw = parts[1];
        const rawData = isBase64 ? atob(raw) : decodeURIComponent(raw);
        const uInt8Array = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
          uInt8Array[i] = rawData.charCodeAt(i);
        }
        return new Blob([uInt8Array], { type: contentType });
      };

      if (dataUrlImages.length > 0) {
        // enforce per-file and total size limits (per-file 8MB, total 20MB)
        const PER_FILE_LIMIT = 8 * 1024 * 1024; // 8MB
        const TOTAL_LIMIT = 20 * 1024 * 1024; // 20MB
        let totalSize = 0;
        const form = new FormData();

        // copy payload without images (we'll include non-data URLs as metadata)
        const payload = { ...fullProductData, images: [] };

        // If variations exist, remove any entries with falsy sku (server index may reject null skus)
        if (Array.isArray(payload.variations)) {
          payload.variations = payload.variations.filter((v) => v && v.sku);
          if (payload.variations.length === 0) delete payload.variations;
        }

        images.forEach((im, idx) => {
          const url = typeof im === 'string' ? im : im?.url || '';
          if (typeof url === 'string' && url.startsWith('data:')) {
            const blob = dataURLToBlob(url);
            // Validate MIME type
            if (!blob.type || !blob.type.startsWith('image/')) {
              throw new Error(`Invalid file type for image ${idx + 1}`);
            }
            if (blob.size > PER_FILE_LIMIT) {
              throw new Error(`Image ${idx + 1} exceeds ${PER_FILE_LIMIT / (1024 * 1024)}MB limit`);
            }
            totalSize += blob.size;
            form.append('images', blob, `image_${Date.now()}_${idx}.jpg`);
          } else if (url) {
            // preserve existing image URL/meta in payload
            payload.images.push(typeof im === 'string' ? im : { url: url, alt: im.alt, isPrimary: im.isPrimary });
          }
        });

        if (totalSize > TOTAL_LIMIT) {
          throw new Error(`Total upload size exceeds ${TOTAL_LIMIT / (1024 * 1024)}MB`);
        }

        // Now sanitize payload (after preserved images have been added)
        const sanitizedPayload = sanitize(payload);

        // Instead of a single `payload` field, append individual fields.
        // Many backends expect top-level multipart fields instead of a nested JSON payload.
        const appendValue = (key, value) => {
          if (value === undefined || value === null) return;
          if (typeof value === 'object') {
            form.append(key, JSON.stringify(value));
          } else {
            form.append(key, String(value));
          }
        };

        const SKIP_KEYS = ['images', 'slug', 'pricing', 'description', 'price'];
        for (const [k, v] of Object.entries(sanitizedPayload)) {
          if (SKIP_KEYS.includes(k)) continue;
          appendValue(k, v);
        }

        // Also append nested fields commonly required by the backend as separate form keys
        // so multipart parsers that don't JSON-parse fields can still receive them.
        if (sanitizedPayload.pricing && (sanitizedPayload.pricing.basePrice !== undefined && sanitizedPayload.pricing.basePrice !== null)) {
          form.append('pricing.basePrice', String(sanitizedPayload.pricing.basePrice));
          // also top-level for safety
          form.append('price', String(sanitizedPayload.pricing.basePrice));
        }

        if (sanitizedPayload.description && typeof sanitizedPayload.description === 'object') {
          form.append('description.short', String(sanitizedPayload.description.short || ''));
        }

        if (sanitizedPayload.slug) {
          form.append('slug', String(sanitizedPayload.slug));
        }

        // If there are preserved existing image URLs/meta, send them as `existingImages`
        if (sanitizedPayload.images && sanitizedPayload.images.length > 0) {
          form.append('existingImages', JSON.stringify(sanitizedPayload.images));
        }

        // Log FormData keys for debugging (will show File objects for images)
        try {
          for (const pair of form.entries()) {
            // Do not stringify File objects, just log the entry key and type
            const val = pair[1];
            if (val instanceof File || (typeof File !== 'undefined' && val && val.constructor && val.constructor.name === 'File')) {
              console.info('FormData entry:', pair[0], '-> File', val.name, val.type, val.size);
            } else if (val && val instanceof Blob) {
              console.info('FormData entry:', pair[0], '-> Blob', val.type, val.size);
            } else {
              console.info('FormData entry:', pair[0], '->', pair[1]);
            }
          }
        } catch (e) {
          // Some environments don't allow iterating FormData; ignore iteration errors.
          console.info('Could not iterate FormData entries:', e?.message || e);
        }

        // dispatch FormData (thunk supports FormData now)
        await dispatch(createProduct(form)).unwrap();
      } else {
        // Send as JSON - sanitize and strip empty/invalid fields (including variations)
        const jsonPayload = sanitize(fullProductData);
        if (Array.isArray(jsonPayload.variations)) {
          jsonPayload.variations = jsonPayload.variations.filter((v) => v && v.sku);
          if (jsonPayload.variations.length === 0) delete jsonPayload.variations;
        }
        await dispatch(createProduct(jsonPayload)).unwrap();
      }
      toast.success("Product created successfully!");
      router.push("/en/inventory/products");
    } catch (error) {
      // Normalize different error shapes (thunk rejectWithValue, axios error, string)
      // This implementation is defensive so malformed server responses or 500 pages
      // won't crash the client when we try to read nested fields.
      const normalizeError = (err) => {
        try {
          if (!err) return "Unknown error";
          if (typeof err === "string") return err;

          // RTK unwrap rejection sometimes returns payload directly
          if (err.payload) {
            const p = err.payload;
            if (!p) return "Unknown payload error";
            if (typeof p === "string") return p;
            if (p.message) return p.message;
            if (p.error) return p.error;
            try { return JSON.stringify(p); } catch (e) { /* ignore */ }
          }

          // Axios error shape
          if (err.response) {
            const resp = err.response;
            const d = resp.data;
            if (d) {
              if (typeof d === 'string') return d;
              if (d.message) return d.message;
              if (d.error) return d.error;
              try { return JSON.stringify(d); } catch (e) { /* ignore */ }
            }
            // Fall back to status and statusText
            if (resp.status && resp.statusText) return `${resp.status} ${resp.statusText}`;
            if (resp.status) return `HTTP ${resp.status}`;
          }

          if (err.message) return err.message;
          if (err.error) return err.error;
          // Last resort: try to stringify the object
          try { return Object.keys(err).length ? JSON.stringify(err) : String(err); } catch (e) { return String(err); }
        } catch (ex) {
          return String(ex || 'Unknown error during error normalization');
        }
      };

      const errMsg = normalizeError(error) || "Failed to create product";
      // If server reports duplicate-null on variations.sku, try a single retry
      // that sends a sanitized JSON payload (no images) and injects a unique
      // variation SKU to avoid the unique-null index conflict.
      try {
        const isDupNull = typeof errMsg === 'string' && /variations\.sku|duplicate key/.test(errMsg) && /null/.test(errMsg);
        if (isDupNull && fullProductData) {
          const retryPayload = sanitize(fullProductData);
          delete retryPayload.images;
          const baseSku = retryPayload.sku || retryPayload.asin || `TMP-${Date.now()}`;
          retryPayload.variations = [{ sku: `${baseSku}-${Date.now()}` }];
          toast('Detected duplicate-null index; retrying without images.');
          setIsSubmitting(true);
          try {
            await dispatch(createProduct(retryPayload)).unwrap();
            toast.success('Product created (images omitted). Upload images later.');
            router.push('/en/inventory/products');
            return;
          } catch (retryErr) {
            console.warn('Retry failed', retryErr);
            // continue to surface original error below
          } finally {
            setIsSubmitting(false);
          }
        }
      } catch (ex) {
        console.warn('Retry check failed', ex);
      }
      // Log both raw and normalized for easier debugging
      console.error("Create product failed (raw):", error);
      console.error("Create product failed (message):", errMsg);

      // Provide actionable guidance for common network/CORS/timeout problems
      const lower = (errMsg || '').toString().toLowerCase();
      // Detect server-side permission errors (EACCES) and provide guidance
      try {
        const serverErr = error?.response?.data || null;
        if ((serverErr && typeof serverErr.error === 'string' && serverErr.error.toLowerCase().includes('eacces')) || (errMsg && errMsg.includes('eacces'))) {
          console.warn('Detected server-side file permission error (EACCES) when uploading files.', serverErr);
          toast.error('Upload failed: server cannot write files. Please check backend upload directory permissions.');
          setIsSubmitting(false);
          return;
        }
      } catch (ex) {
        // ignore
      }
      if (lower.includes('network error') || lower.includes('failed to fetch') || lower.includes('cors') || lower.includes('preflight')) {
        toast.error('Network/CORS error: the browser blocked the request. Ensure the API server allows CORS from this origin and is reachable. See console for details.');
        // add a console hint for backend devs
        console.warn('CORS/Network hint: Add header Access-Control-Allow-Origin: * (or your origin) on the API and ensure OPTIONS preflight responds with appropriate CORS headers.');
      } else if (lower.includes('timeout') || lower.includes('ecoonaborted') || lower.includes('exceeded')) {
        toast.error('Request timed out. Try again or increase client/server timeouts.');
      } else if (lower.includes('413') || lower.includes('payload too large') || lower.includes('request entity too large')) {
        toast.error('Payload too large. Reduce image sizes or upload fewer files.');
      } else {
        toast.error(errMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-12">
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto">
        {/* Mobile Steps */}
        <div className="lg:hidden mb-10">
          <div className="flex items-center justify-center gap-6">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    currentStep >= step.id
                      ? "bg-[#FB923C] text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {currentStep > step.id ? <Check size={16} /> : step.id}
                </div>
                <p className="text-xs text-[#333]">{step.title}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-12 items-start">
          {/* Form */}
          <div className="flex-1">
            <div className="border-2 border-[#d1d5db] rounded-3xl p-8 bg-white">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-[#081422]">
                  {steps[currentStep - 1].title}
                </h2>
                <p className="text-[#6b7280] mt-2">
                  Step {currentStep} of {steps.length}
                </p>
              </div>

              <div className="space-y-6">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <StepBasicInfo formData={formData} updateFormData={updateFormData} errors={errors} categories={categories} />
                  )}
                  {currentStep === 2 && (
                    <StepMoreInfo formData={formData} updateFormData={updateFormData} updateNestedField={updateNestedField} errors={errors} />
                  )}
                  {currentStep === 3 && (
                    <StepInventory formData={formData} updateFormData={updateFormData} updateNestedField={updateNestedField} errors={errors} warehouses={warehouses} />
                  )}
                  {currentStep === 4 && (
                    <StepMedia
                      formData={formData}
                      handleImageUpload={handleImageUpload}
                      removeImage={removeImage}
                      setPrimaryImage={setPrimaryImage}
                      addTag={addTag}
                      removeTag={removeTag}
                      tagInput={tagInput}
                      setTagInput={setTagInput}
                    />
                  )}
                  {currentStep === 5 && (
                    <StepAdvanced formData={formData} updateFormData={updateFormData} updateNestedField={updateNestedField} errors={errors} />
                  )}
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-10">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all ${
                    currentStep === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "border-2 border-gray-300 text-[#081422] hover:border-[#FB923C]"
                  }`}
                >
                  <ChevronLeft size={20} />
                  Previous
                </button>

                {currentStep === 5 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-8 py-3 bg-[#FB923C] text-white rounded-2xl hover:bg-[#f97316] disabled:opacity-60 transition font-semibold"
                  >
                    <Check size={20} />
                    {isSubmitting ? "Saving..." : "Save Product"}
                  </button>
                ) : (
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-2 px-8 py-3 bg-[#FB923C] text-white rounded-2xl hover:bg-[#f97316] transition font-semibold"
                  >
                    Next
                    <ChevronRight size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-72">
            <div className="relative">
              <div
                className="absolute left-6 top-0 w-1 bg-linear-to-b from-[#FB923C] to-gray-300 transition-all duration-500"
                style={{ height: `${(currentStep / steps.length) * 100}%` }}
              />
              <div className="space-y-8 relative z-10">
                {steps.map((step) => (
                  <div key={step.id} className="flex items-start gap-4">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center font-semibold transition-all shrink-0 ${
                        step.id < currentStep
                          ? "bg-[#FB923C] text-white"
                          : step.id === currentStep
                          ? "bg-[#FB923C] text-white ring-4 ring-orange-100"
                          : "border-2 border-gray-300 text-gray-500 bg-white"
                      }`}
                    >
                      {step.id < currentStep ? <Check size={24} /> : step.id}
                    </div>
                    <div className="pt-2">
                      <p className={`font-semibold text-sm ${step.id <= currentStep ? "text-[#081422]" : "text-gray-500"}`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500">Step {step.id} of 5</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}