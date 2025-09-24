'use client'

import { useState } from "react";
import Link from "next/link";

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/teacher/attandance", label: "Take Attendance" },
    { href: "/teacher/show-attandance", label: "Show Attendance" },
    { href: "/teacher/register-face", label: "Face Registration" },
    { href: "/teacher/feedback", label: "Send Feedback" },
    { href: "/", label: "Home" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="p-4 bg-gray-800  text-center  shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
        {/* Mobile menu button */}
        <button
          className="sm:hidden px-3 py-2 bg-gray-700/50 rounded-md"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "Close" : "Menu"}
        </button>
      </header>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`fixed sm:static inset-y-0 left-0 w-64 bg-gray-800/90 p-6 flex flex-col gap-4 transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out sm:translate-x-0 z-50`}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 rounded-lg bg-gray-700/40 hover:bg-gray-700/60 transition-colors duration-200 text-center sm:text-left"
              onClick={() => setIsOpen(false)} // close on mobile click
            >
              {link.label}
            </Link>
          ))}
        </aside>

        {/* Overlay for mobile */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 sm:hidden"
            onClick={() => setIsOpen(false)}
          ></div>
        )}

        {/* Content */}
        <main className="flex-1 p-6 sm:ml-64">{children}</main>
      </div>
    </div>
  );
}
