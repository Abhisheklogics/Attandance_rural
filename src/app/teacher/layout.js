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
    <div className="min-h-screen flex flex-col  text-white">
      
      {/* Header */}
      <header className="p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
        <button
          className="sm:hidden px-3 py-2 rounded-md"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "Close" : "Menu"}
        </button>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`fixed sm:static inset-y-0 left-0 w-64  p-6 flex flex-col gap-4 rounded-tr-3xl rounded-br-3xl transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out sm:translate-x-0 z-50`}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-3 rounded-lg bg-blue-700/40 hover:bg-gray-700/60 transition-colors duration-200 text-center sm:text-left font-medium shadow-sm"
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
        <main className=" md:w-[400px] flex-1 p-6 sm:ml-64  rounded-tl-3xl rounded-bl-3xl shadow-inner">
          {children}
        </main>
      </div>
    </div>
  );
}
