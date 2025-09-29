'use client'

import { useState } from "react";
import Link from "next/link";

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/teacher/attandance", label: "Take Attendance" },
    { href: "/teacher/show-attandance", label: "Show Attendance" },
    { href: "/teacher/register-face", label: "Face Registration" },
    { href: "/", label: "Home" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      {/* Header */}
      <header className="p-4 sm:p-6 shadow-md flex justify-between items-center bg-blue-900">
        <h1 className="text-xl sm:text-2xl font-bold tracking-wide">
          Teacher Dashboard
        </h1>
        <button
          className="sm:hidden px-3 py-2 rounded-md bg-blue-700/50 hover:bg-blue-700 transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "Close" : "Menu"}
        </button>
      </header>

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <aside
          className={`fixed sm:static top-0 left-0 h-full w-64 bg-gradient-to-b from-blue-900 to-indigo-950 p-6 flex flex-col gap-4 transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out sm:translate-x-0 z-50`}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-3 rounded-lg bg-blue-700/30 hover:bg-blue-600/60 transition-colors duration-200 font-medium shadow-sm text-center sm:text-left"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </aside>

        {/* Mobile overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 sm:hidden"
            onClick={() => setIsOpen(false)}
          ></div>
        )}

        {/* Main content */}
        <main className=" md:ml-[0px] flex-1 p-6 sm:p-10 sm:ml-64 bg-gray-900/30 rounded-tl-3xl rounded-bl-3xl shadow-inner overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
