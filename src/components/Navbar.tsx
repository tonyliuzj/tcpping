import React from "react";

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        <span className="font-bold text-xl text-blue-600 tracking-tight">
          TCPing Dashboard
        </span>
        {/* Add nav links here */}
        <div className="hidden sm:flex gap-6 text-gray-700 font-medium">
          <a href="#" className="hover:text-blue-600 transition">Home</a>
          <a href="#" className="hover:text-blue-600 transition">About</a>
          <a href="#" className="hover:text-blue-600 transition">Docs</a>
        </div>
      </div>
    </nav>
  );
}
