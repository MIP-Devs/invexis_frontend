"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Filter, Download, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { fetchProducts, deleteProduct } from "@/features/products/productsSlice";
import { fetchCategories } from "@/features/categories/categoriesSlice";
import { fetchWarehouses } from "@/features/warehouses/warehousesSlice";

import ProductTable from "./ProductTable";
import ProductStats from "./ProductStats";

export default function ProductList() {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();

  const productsState = useSelector((state) => state.products || {});
  const categoriesState = useSelector((state) => state.categories || {});
  const warehousesState = useSelector((state) => state.warehouses || {});

  const products = Array.isArray(productsState.items) ? productsState.items : [];
  const categories = Array.isArray(categoriesState.items) ? categoriesState.items : [];
  const warehouses = Array.isArray(warehousesState.items) ? warehousesState.items : [];

  const loading = productsState.loading || false;
  const pagination = productsState.pagination || { page: 1, pages: 1 };

  const [selectedIds, setSelectedIds] = useState([]);
  const [filters, setFilters] = useState({ category: null, search: "" });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 20 }));
    dispatch(fetchCategories());
    dispatch(fetchWarehouses());
  }, [dispatch]);

  useEffect(() => {
    const currentPage = pagination?.page || 1;
    dispatch(fetchProducts({ page: currentPage, limit: 20, ...filters }));
  }, [dispatch, pagination?.page, filters]);

  const handleDelete = async (id) => {
    if (typeof window === "undefined") return;
    if (!window.confirm("Delete this product?")) return;
    try {
      await dispatch(deleteProduct(id)).unwrap();
      toast.success("Product deleted successfully");
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  const handleBulkDelete = async () => {
    if (typeof window === "undefined") return;
    if (!window.confirm(`Delete ${selectedIds.length} products?`)) return;
    try {
      await Promise.all(selectedIds.map((id) => dispatch(deleteProduct(id)).unwrap()));
      toast.success(`${selectedIds.length} products deleted`);
      setSelectedIds([]);
    } catch (err) {
      toast.error("Some products failed to delete");
    }
  };

  const handleExport = () => {
    const csv = [
      ["Product", "Category", "Price", "Stock", "Status"],
      ...products.map((p) => [
        p.name,
        p.category?.name || "N/A",
        p.price,
        p.stock,
        p.stock > 0 ? "In Stock" : "Out of Stock",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const handleView = (id) => {
    // Build absolute path from current pathname to avoid relative resolution issues
    const base = (pathname || '').replace(/\/$/, '');
    const target = base ? `${base}/${id}` : `/inventory/products/${id}`;
    router.push(target);
  };

  const handleEdit = (id) => {
    const base = (pathname || '').replace(/\/$/, '');
    const target = base ? `${base}/${id}/edit` : `/inventory/products/${id}/edit`;
    router.push(target);
  };

  const stats = {
    total: products.length,
    inStock: products.filter((p) => p.stock > 0).length,
    lowStock: products.filter((p) => p.stock < 20 && p.stock > 0).length,
    outOfStock: products.filter((p) => p.stock === 0).length,
  };

  return (
    <div className="space-y-6">
      <ProductStats stats={stats} />

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-sm text-gray-500 mt-1">{stats.total} total products</p>
          </div>
          <div className="flex gap-3">
            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                <Trash2 size={18} />
                Delete ({selectedIds.length})
              </button>
            )}
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition">
              <Filter size={18} />
              <span onClick={() => setShowFilters(!showFilters)}>Filters</span>
            </button>
            <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition">
              <Download size={18} />
              Export
            </button>
            <button
              onClick={() => {
                const base = (pathname || '').replace(/\/$/, '');
                const target = base ? `${base}/add` : `/inventory/products/add`;
                router.push(target);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition shadow-lg"
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>
        </div>

        <div className="mb-4 flex gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
          />
          <select
            value={filters.category || ""}
            onChange={(e) => setFilters({ ...filters, category: e.target.value || null })}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Categories</option>
            {categories && categories.length > 0
              ? categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))
              : null}
          </select>
        </div>

        {showFilters && (
          <div className="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex gap-4 items-center">
              <div>
                <label className="text-sm text-gray-600 block mb-1">Warehouse</label>
                <select
                  value={filters.warehouse || ""}
                  onChange={(e) => setFilters({ ...filters, warehouse: e.target.value || null })}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="">All Warehouses</option>
                  {warehouses.map((w) => (
                    <option key={w._id} value={w._id}>{w.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Status</label>
                <select
                  value={filters.status || ""}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value || null })}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="">Any</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="ml-auto">
                <button onClick={() => setShowFilters(false)} className="px-3 py-2 bg-white border rounded">Close</button>
              </div>
            </div>
          </div>
        )}

        <ProductTable products={products} loading={loading} selectedIds={selectedIds} onSelectIds={setSelectedIds} onDelete={handleDelete} onView={handleView} onEdit={handleEdit} />
      </div>
    </div>
  );
}