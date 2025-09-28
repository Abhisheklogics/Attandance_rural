"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LangSwitcher from "../components/LangSwitcher";

// Translation files
import en from "./locales/en/home.json";
import hi from "./locales/hi/home.json";
import pa from "./locales/pa/home.json";

const translations = { en, hi, pa };

export default function Home() {
  const [lang, setLang] = useState("en");
  const [t, setT] = useState(en);

  useEffect(() => {
    const savedLang = localStorage.getItem("preferredLang") || "en";
    setLang(savedLang);
    setT(translations[savedLang]);
  }, []);

  const cardStyles =
    "group relative rounded-3xl p-8 text-center shadow-2xl transform transition-all duration-500 hover:scale-105 hover:-translate-y-2";

  const cardBgGradient = (from, to, hoverFrom, hoverTo, shadow) =>
    `bg-gradient-to-br from-${from} to-${to} hover:from-${hoverFrom} hover:to-${hoverTo} shadow-${shadow}`;

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-black-900 via-blue-900 to-green-950 text-white flex flex-col items-center justify-center px-6 py-12 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-yellow-400 opacity-20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-pink-500 opacity-20 rounded-full blur-3xl animate-pulse delay-300" />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-400 opacity-10 rounded-full blur-3xl animate-spin-slow" />

      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-10">
        <LangSwitcher />
      </div>

      {/* Heading */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 drop-shadow-lg animate-fade-in">
        {t?.title || "Smart Face Attendance for Rural Schools"}
      </h1>

      {/* Subheading */}
      <p className="text-gray-200 max-w-3xl text-center mb-16 text-lg sm:text-xl animate-fade-in delay-200">
        {t?.subtitle ||
          "A simple, reliable, and futuristic face-recognition attendance system, designed to empower teachers and students in rural areas."}
      </p>

      {/* Action Cards */}
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
        {/* Register Students */}
        <Link
          href="/studentFace"
          className={`${cardStyles} ${cardBgGradient(
            "green-500",
            "green-600",
            "green-400",
            "green-500",
            "2xl"
          )}`}
        >
          <div className="absolute inset-0 rounded-3xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 group-hover:text-white transition">
            {t?.registerTitle || "Register Students"}
          </h2>
          <p className="text-gray-100 text-sm sm:text-base">
            {t?.registerDesc || "Capture student facial data easily and securely."}
          </p>
        </Link>

        {/* Take Attendance */}
        <Link
          href="/teacher"
          className={`${cardStyles} ${cardBgGradient(
            "yellow-500",
            "yellow-600",
            "yellow-400",
            "yellow-500",
            "2xl"
          )}`}
        >
          <div className="absolute inset-0 rounded-3xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 group-hover:text-white transition">
            {t?.attendanceTitle || "Mark Attendance"}
          </h2>
          <p className="text-gray-100 text-sm sm:text-base">
            {t?.attendanceDesc || "Quickly mark attendance with face recognition."}
          </p>
        </Link>

        {/* About System */}
        <Link
          href="/admin"
          className={`${cardStyles} ${cardBgGradient(
            "orange-400",
            "orange-500",
            "orange-300",
            "orange-400",
            "2xl"
          )}`}
        >
          <div className="absolute inset-0 rounded-3xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 group-hover:text-white transition">
            {t?.aboutTitle || "About System"}
          </h2>
          <p className="text-gray-100 text-sm sm:text-base">
            {t?.aboutDesc ||
              "Learn how this system helps rural schools improve attendance and reduce paperwork."}
          </p>
        </Link>
      </div>

      {/* Footer */}
      <footer className="mt-20 text-sm sm:text-base text-gray-300 text-center animate-fade-in delay-500">
        {t?.footer || "© 2025 Abhishek Kumar Production"}
      </footer>
    </main>
  );
}
