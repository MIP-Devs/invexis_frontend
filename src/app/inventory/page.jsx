"use client"

import React from "react";

import { useEffect, useState } from "react";
import SideBar from "@/components/layouts/SideBar";
import NavBar from "@/components/layouts/NavBar";
import ProtectedRoute from "@/lib/ProtectedRoute";



export default function Inventory({ children }) {
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-expanded");
    if (saved !== null) setExpanded(saved === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", String(expanded));
  }, [expanded]);

  const sidebarRem = expanded ? 16 : 5;

  return (
    <div>
      <p>Hello</p>
    </div>
  );
}
