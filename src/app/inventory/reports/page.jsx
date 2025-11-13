"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  ShoppingBag,
  Package,
  CreditCard,
  Banknote,
  BarChart2,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

/* ------------------------- Sample Data ------------------------- */
const sampleKpis = {
  companyEmployees: 128,
  totalShops: 12,
  totalSales: 84235,
  outstandingDebts: 12040,
};

const shopsSample = [
  { id: "s1", name: "Central", branches: 4, manager: "Alice", sales: 42340 },
  { id: "s2", name: "Riverside", branches: 3, manager: "Mark", sales: 28900 },
  { id: "s3", name: "North", branches: 5, manager: "Sofia", sales: 13000 },
];

const salesSeries = [
  { month: "Jan", sales: 12000 },
  { month: "Feb", sales: 9500 },
  { month: "Mar", sales: 15000 },
  { month: "Apr", sales: 11000 },
  { month: "May", sales: 17000 },
  { month: "Jun", sales: 20000 },
];

const inventorySample = [
  { sku: "SKU-001", name: "Running Shoes H520", stock: 25, status: "OK" },
  { sku: "SKU-012", name: "Bluetooth Speaker", stock: 8, status: "Low" },
  { sku: "SKU-023", name: "Handbag Deluxe", stock: 60, status: "OK" },
];

const ecommerceSample = [
  { id: "o1", title: "Order #9843", value: "$320", status: "Shipped" },
  { id: "o2", title: "Order #9844", value: "$120", status: "Pending" },
];

const debtsSample = [
  { id: "d1", party: "Supplier A", amount: 4000, due: "2025-11-10" },
  { id: "d2", party: "Supplier B", amount: 8040, due: "2025-12-01" },
];

const paymentsSample = [
  { id: "p1", payer: "Customer X", amount: 320, date: "2025-10-02", method: "Card" },
  { id: "p2", payer: "Customer Y", amount: 120, date: "2025-10-05", method: "Mobile Money" },
];

const pieCategories = [
  { name: "Footwear", value: 40, color: "#FB923C" },
  { name: "Electronics", value: 35, color: "#F97316" },
  { name: "Fashion", value: 25, color: "#FB8500" },
];

/* ------------------------- Component ------------------------- */
export default function ReportPage() {
  const tabs = [
    { id: "company", label: "Company" },
    { id: "shops", label: "Shops" },
    { id: "sales", label: "Sales" },
    { id: "inventory", label: "Inventory" },
    { id: "ecommerce", label: "E-commerce" },
    { id: "debts", label: "Debts" },
    { id: "payments", label: "Payments" },
  ];

  // Refs for sections
  const sectionRefs = useRef({});
  tabs.forEach((t) => {
    if (!sectionRefs.current[t.id]) sectionRefs.current[t.id] = React.createRef();
  });

  const [activeTab, setActiveTab] = useState(tabs[0].id);

  // Observe sections to update active tab on scroll
  useEffect(() => {
    const obsOptions = { root: null, rootMargin: "-30% 0px -50% 0px", threshold: 0 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.getAttribute("data-section"));
        }
      });
    }, obsOptions);

    Object.values(sectionRefs.current).forEach((r) => {
      if (r.current) observer.observe(r.current);
    });

    return () => observer.disconnect();
  }, []);

  // Scroll to section
  function scrollTo(id) {
    const ref = sectionRefs.current[id];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
      // set active immediately for UX
      setActiveTab(id);
    }
  }

  /* ------------------------- Render UI ------------------------- */
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* fixed tab bar container */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-20xl mx-auto px-1 sm:px-1 lg:px-1">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              <div className="text-orange-500">
                <BarChart2 />
              </div>
              <div>
                <h2 className="text-base font-semibold">Reports</h2>
                <div className="text-xs text-gray-500">Overview of company-wide services</div>
              </div>
            </div>

            <nav
              aria-label="Report sections"
              className="flex-1 ml-6 overflow-auto scrollbar-hide"
            >
              <ul className="flex gap-6 items-center">
                {tabs.map((t) => (
                  <li key={t.id} className="py-3">
                    <button
                      onClick={() => scrollTo(t.id)}
                      className={`relative text-sm font-medium px-1 focus:outline-none ${
                        activeTab === t.id ? "text-orange-600" : "text-gray-600 hover:text-gray-800"
                      }`}
                      aria-current={activeTab === t.id ? "true" : undefined}
                    >
                      {t.label}
                      {/* minimal thin underline */}
                      <span
                        className={`absolute left-0 right-0 -bottom-3 h-0.5 transition-opacity duration-200 ${
                          activeTab === t.id ? "bg-orange-500 opacity-100" : "opacity-0"
                        }`}
                        aria-hidden
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* content */}
      <main className="max-w-20xl mx-auto px-4 sm:px-1 lg:px-1 py-8 space-y-10">
        {/* Company */}
        <section
          ref={sectionRefs.current.company}
          data-section="company"
          id="company"
          className="scroll-mt-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* KPIs */}
            <div className="lg:col-span-2 bg-white rounded-lg p-5 shadow-sm border">
              <h3 className="text-lg font-medium mb-4">Company Overview</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                  <div className="text-xs text-gray-500">Employees</div>
                  <div className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                    <Users className="text-orange-500" /> {sampleKpis.companyEmployees}
                  </div>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                  <div className="text-xs text-gray-500">Total Shops</div>
                  <div className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                    <Package className="text-orange-500" /> {sampleKpis.totalShops}
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg border col-span-1 sm:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-xs text-gray-500">Total Sales (last 6 months)</div>
                      <div className="text-xl font-semibold">${sampleKpis.totalSales.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={salesSeries}>
                        <defs>
                          <linearGradient id="areaCompany" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FB923C" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#FB923C" stopOpacity={0.03} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#f3f4f6" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="sales" stroke="#F97316" fill="url(#areaCompany)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            <aside className="bg-white rounded-lg p-5 shadow-sm border">
              <h4 className="text-sm font-medium mb-3">Quick Actions</h4>
              <div className="flex flex-col gap-2">
                <button className="py-2 px-3 rounded-md bg-orange-500 text-white text-sm">Create Company Announcement</button>
                <button className="py-2 px-3 rounded-md border border-gray-200 text-sm">Export Company Report (PDF)</button>
                <button className="py-2 px-3 rounded-md border border-gray-200 text-sm">Manage Company Settings</button>
              </div>
            </aside>
          </div>
        </section>

        {/* Shops */}
        <section ref={sectionRefs.current.shops} data-section="shops" id="shops" className="scroll-mt-24">
          <div className="bg-white rounded-lg p-5 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Shops Overview</h3>
              <div className="text-sm text-gray-500">Total: {shopsSample.length}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {shopsSample.map((s) => (
                <div key={s.id} className="p-4 rounded-lg border">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{s.name}</div>
                      <div className="text-xs text-gray-500">{s.manager}</div>
                    </div>
                    <div className="text-orange-600 font-semibold">${s.sales.toLocaleString()}</div>
                  </div>

                  <div className="mt-3 text-xs text-gray-500">Branches: {s.branches}</div>

                  <div className="mt-3 h-20">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={s.trend ? s.trend.map((v, i) => ({ i, v })) : []}>
                        <Line type="monotone" dataKey="v" stroke="#FB923C" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sales */}
        <section ref={sectionRefs.current.sales} data-section="sales" id="sales" className="scroll-mt-24">
          <div className="bg-white rounded-lg p-5 shadow-sm border">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-lg font-medium">Sales</h3>
                <p className="text-sm text-gray-500">Detailed sales performance across channels</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded-md border text-sm">Export CSV</button>
                <button className="px-3 py-1 rounded-md bg-orange-500 text-white text-sm">Filter</button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white p-4 rounded border">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesSeries}>
                        <CartesianGrid stroke="#f3f4f6" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="sales" fill="#FB923C" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div>
                <div className="p-4 border rounded">
                  <div className="text-sm text-gray-500">Top performing months</div>
                  <ul className="mt-3 space-y-2 text-sm">
                    {salesSeries.slice().sort((a,b)=>b.sales-a.sales).slice(0,3).map((s) => (
                      <li key={s.month} className="flex justify-between">
                        <span>{s.month}</span>
                        <span className="font-semibold">${s.sales.toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Inventory */}
        <section ref={sectionRefs.current.inventory} data-section="inventory" id="inventory" className="scroll-mt-24">
          <div className="bg-white rounded-lg p-5 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Inventory</h3>
              <div className="text-sm text-gray-500">Track stock & status</div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="text-xs text-gray-500 uppercase">
                  <tr>
                    <th className="py-2 pr-4">SKU</th>
                    <th className="py-2 pr-4">Product</th>
                    <th className="py-2 pr-4">Stock</th>
                    <th className="py-2 pr-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inventorySample.map((it) => (
                    <tr key={it.sku} className="border-t">
                      <td className="py-2 pr-4 text-gray-700">{it.sku}</td>
                      <td className="py-2 pr-4">{it.name}</td>
                      <td className="py-2 pr-4 font-semibold text-gray-800">{it.stock}</td>
                      <td className="py-2 pr-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${it.status === "Low" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>
                          {it.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* E-commerce */}
        <section ref={sectionRefs.current.ecommerce} data-section="ecommerce" id="ecommerce" className="scroll-mt-24">
          <div className="bg-white rounded-lg p-5 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">E-commerce Orders</h3>
              <div className="text-sm text-gray-500">{ecommerceSample.length} recent orders</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ecommerceSample.map((o) => (
                <div key={o.id} className="p-4 border rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{o.title}</div>
                      <div className="text-xs text-gray-500">{o.status}</div>
                    </div>
                    <div className="text-orange-600 font-semibold">{o.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Debts */}
        <section ref={sectionRefs.current.debts} data-section="debts" id="debts" className="scroll-mt-24">
          <div className="bg-white rounded-lg p-5 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Debts</h3>
              <div className="text-sm text-gray-500">Outstanding amount: <span className="text-orange-600 font-semibold">${sampleKpis.outstandingDebts.toLocaleString()}</span></div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-gray-500 uppercase">
                  <tr>
                    <th className="py-2 pr-4">Creditor</th>
                    <th className="py-2 pr-4">Amount</th>
                    <th className="py-2 pr-4">Due</th>
                  </tr>
                </thead>
                <tbody>
                  {debtsSample.map((d) => (
                    <tr key={d.id} className="border-t">
                      <td className="py-2 pr-4">{d.party}</td>
                      <td className="py-2 pr-4 font-semibold text-orange-600">${d.amount.toLocaleString()}</td>
                      <td className="py-2 pr-4 text-gray-600">{d.due}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Payments */}
        <section ref={sectionRefs.current.payments} data-section="payments" id="payments" className="scroll-mt-24">
          <div className="bg-white rounded-lg p-5 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Payments</h3>
              <div className="text-sm text-gray-500">Latest transactions</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded">
                <div className="text-sm text-gray-600 mb-2">Recent payments</div>
                <ul className="space-y-3">
                  {paymentsSample.map((p) => (
                    <li key={p.id} className="flex justify-between items-center">
                      <div>
                        <div className="text-sm font-medium">{p.payer}</div>
                        <div className="text-xs text-gray-500">{p.date} • {p.method}</div>
                      </div>
                      <div className="text-orange-600 font-semibold">${p.amount}</div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 border rounded">
                <div className="text-sm text-gray-600 mb-3">Payment method distribution</div>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieCategories} dataKey="value" nameKey="name" outerRadius={60} innerRadius={30}>
                        {pieCategories.map((c, i) => <Cell key={i} fill={c.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
