"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  CheckCircle,
  Star,
  CalendarDays,
  DollarSign,
  ReceiptText,
  X,
  Smartphone,
  Banknote,
} from "lucide-react";

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);

  const plans = [
    {
      name: "Basic",
      price: "$9.99/mo",
      description: "Essential tools for individuals or small teams.",
      features: [
        "Up to 5 users",
        "1GB storage",
        "Email support",
        "Basic analytics",
      ],
      gradient: "from-gray-50 to-gray-100",
    },
    {
      name: "Normal",
      price: "$19.99/mo",
      description: "For growing teams and expanding operations.",
      features: [
        "Up to 20 users",
        "10GB storage",
        "Priority support",
        "Advanced analytics",
      ],
      gradient: "from-orange-50 to-orange-100",
    },
    {
      name: "Professional",
      price: "$39.99/mo",
      description: "Best for established companies with large-scale needs.",
      features: [
        "Unlimited users",
        "50GB storage",
        "Dedicated account manager",
        "Full system access",
      ],
      gradient: "from-orange-100 to-white",
      highlight: true,
    },
  ];

  const paymentHistory = [
    {
      id: 1,
      plan: "Normal",
      amount: "$19.99",
      date: "Nov 1, 2025",
      status: "Paid",
      method: "Card",
    },
    {
      id: 2,
      plan: "Basic",
      amount: "$9.99",
      date: "Oct 1, 2025",
      status: "Paid",
      method: "Mobile Money",
    },
    {
      id: 3,
      plan: "Professional",
      amount: "$39.99",
      date: "Sep 1, 2025",
      status: "Failed",
      method: "Card",
    },
  ];

  const handleProceed = () => {
    if (!selectedPlan) return;
    setShowPaymentModal(true);
  };

  const confirmPayment = () => {
    if (!selectedMethod) return;
    alert(
      `Processing ${selectedPlan} plan payment via ${selectedMethod}...`
    );
    setShowPaymentModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-2 px-6">
      <div className="max-w-20xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-3">
          <motion.h1
            className="text-4xl font-extrabold text-gray-900"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Manage Your Subscription
          </motion.h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Select the plan that fits your business growth and view your payment
            history in one place.
          </p>
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 place-self-center gap-8 max-w-6xl">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              className={`relative rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition bg-gradient-to-b ${plan.gradient} cursor-pointer ${
                selectedPlan === plan.name
                  ? "ring-2 ring-orange-500"
                  : "hover:border-orange-300"
              }`}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedPlan(plan.name)}
            >
              {plan.highlight && (
                <div className="absolute -top-3 right-6 bg-orange-500 text-white text-xs px-3 py-1 rounded-full shadow">
                  Popular
                </div>
              )}

              <div className="p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {plan.name}
                  </h2>
                  {plan.highlight && (
                    <Star className="text-orange-500 w-5 h-5" />
                  )}
                </div>

                <p className="text-gray-600 text-sm leading-relaxed">
                  {plan.description}
                </p>

                <div className="text-4xl font-extrabold text-orange-600">
                  {plan.price}
                </div>

                <ul className="space-y-2 text-gray-700 text-sm">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle
                        size={16}
                        className="text-orange-500 mr-2 flex-shrink-0"
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                    selectedPlan === plan.name
                      ? "bg-orange-600 text-white"
                      : "bg-white border border-orange-400 text-orange-600 hover:bg-orange-50"
                  }`}
                >
                  <CreditCard size={18} />
                  {selectedPlan === plan.name
                    ? "Selected"
                    : "Select This Plan"}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Proceed Button */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <button
            disabled={!selectedPlan}
            onClick={handleProceed}
            className={`px-10 py-4 rounded-xl text-lg font-semibold transition flex items-center justify-center gap-3 mx-auto shadow-md ${
              selectedPlan
                ? "bg-orange-600 hover:bg-orange-700 text-white"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            <CreditCard size={20} />
            {selectedPlan
              ? `Proceed to Pay for ${selectedPlan}`
              : "Select a Plan to Continue"}
          </button>
        </motion.div>

        {/* Payment History */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Payment History
              </h2>
              <p className="text-gray-500 text-sm">
                Track all your previous transactions
              </p>
            </div>
            <button className="text-sm text-orange-500 hover:underline">
              Export Report
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-700 border-collapse">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Plan</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Method</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((item) => (
                  <motion.tr
                    key={item.id}
                    className="border-t hover:bg-orange-50 transition"
                    whileHover={{ scale: 1.01 }}
                  >
                    <td className="p-3 flex items-center gap-2 text-gray-700">
                      <CalendarDays size={14} className="text-orange-500" />
                      {item.date}
                    </td>
                    <td className="p-3 font-medium">{item.plan}</td>
                    <td className="p-3 flex items-center gap-1 text-gray-800">
                      <DollarSign size={14} className="text-orange-500" />
                      {item.amount}
                    </td>
                    <td className="p-3">{item.method}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === "Paid"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 font-medium">
                        <ReceiptText size={14} /> Invoice
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* 🧾 Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 w-[90%] md:w-[450px] shadow-lg relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                Select Payment Method
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                You are paying for <span className="font-semibold">{selectedPlan}</span> plan.
              </p>

              <div className="space-y-3">
                {[
                  { name: "Card Payment", icon: CreditCard },
                  { name: "Mobile Money", icon: Smartphone },
                  { name: "Bank Transfer", icon: Banknote },
                ].map((method) => (
                  <div
                    key={method.name}
                    onClick={() => setSelectedMethod(method.name)}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
                      selectedMethod === method.name
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-orange-300"
                    }`}
                  >
                    <method.icon
                      className={`${
                        selectedMethod === method.name
                          ? "text-orange-600"
                          : "text-gray-500"
                      }`}
                    />
                    <span className="text-gray-700 font-medium text-sm">
                      {method.name}
                    </span>
                  </div>
                ))}
              </div>

              <button
                disabled={!selectedMethod}
                onClick={confirmPayment}
                className={`mt-6 w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                  selectedMethod
                    ? "bg-orange-600 hover:bg-orange-700 text-white"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                <CheckCircle size={18} />
                {selectedMethod
                  ? `Confirm ${selectedMethod}`
                  : "Select a Payment Method"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
