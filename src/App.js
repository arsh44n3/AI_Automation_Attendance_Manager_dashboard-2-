import React from "react";
import Dashboard from "./Dashboard";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard />
      {/* 👇 must be inside return */}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
