"use client"
import { useState, useEffect } from "react";
import TopNavBar from "@/components/layouts/NavBar";
import SideBar from "@/components/layouts/SideBar";

const OrderDetails = () => {
  // Simulated API data
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Simulate fetching from API
    const fakeOrder = {
      id: 6010,
      status: "Refunded",
      date: "20 Sep 2025 11:08 pm",
      products: [
        {
          id: "16H9UR0",
          name: "Urban Explorer Sneakers",
          qty: 1,
          price: 83.74,
          img: "https://via.placeholder.com/80x80.png?text=Sneakers",
        },
        {
          id: "16H9UR1",
          name: "Classic Leather Loafers",
          qty: 2,
          price: 97.14,
          img: "https://via.placeholder.com/80x80.png?text=Loafers",
        },
        {
          id: "16H9UR2",
          name: "Mountain Trekking Boots",
          qty: 3,
          price: 68.71,
          img: "https://via.placeholder.com/80x80.png?text=Boots",
        },
      ],
      subtotal: 484.15,
      customer: {
        name: "Jayvion Simon",
        email: "nannie.abernathy70@yahoo.com",
        ip: "192.158.1.38",
        avatar: "https://via.placeholder.com/80.png?text=JS",
      },
      delivery: {
        shipBy: "DHL",
        speed: "Standard",
        tracking: "SPX03739199373",
      },
    };

    setOrder(fakeOrder);
  }, []);

  if (!order) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="relative z-30 sm:px-5   transition-all duration-300 ml-20">
      <TopNavBar />
      <SideBar />
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-2xl font-bold">
          Order #{order.id}{" "}
          <span className="ml-2 px-2 py-1 text-sm rounded bg-gray-200 text-gray-600">
            {order.status}
          </span>
        </h1>
        <p className="text-gray-500 mt-2 sm:mt-0">{order.date}</p>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left: Products */}
        <div className="col-span-2 bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-4">Details</h2>
          <div className="space-y-4">
            {order.products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between border-b pb-3"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm">x{product.qty}</p>
                  <p className="font-semibold">${product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <p className="font-semibold">
              Subtotal: ${order.subtotal.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Right: Customer + Delivery */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-4">Customer</h2>
            <div className="flex items-center gap-4">
              <img
                src={order.customer.avatar}
                alt={order.customer.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-medium">{order.customer.name}</p>
                <p className="text-sm text-gray-500">{order.customer.email}</p>
                <p className="text-xs text-gray-400">
                  IP: {order.customer.ip}
                </p>
              </div>
            </div>
            <button className="mt-3 text-red-600 text-sm font-medium hover:underline">
              + Add to blacklist
            </button>
          </div>

          {/* Delivery */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-4">Delivery</h2>
            <p>
              <span className="font-medium">Ship by:</span> {order.delivery.shipBy}
            </p>
            <p>
              <span className="font-medium">Speedy:</span> {order.delivery.speed}
            </p>
            <p>
              <span className="font-medium">Tracking No:</span>{" "}
              <a
                href="#"
                className="text-blue-600 hover:underline"
              >
                {order.delivery.tracking}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
