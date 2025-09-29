"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import LangSwitcher from "../components/LangSwitcher";
import img from '../../public/face.gif'
import img1 from '../../public/img.png'
import img2 from '../../public/ed.gif'
// Translation files
import en from "./locales/en/home.json";
import hi from "./locales/hi/home.json";
import pa from "./locales/pa/home.json";
import ur from "./locales/ur/home.json";
import ks from "./locales/ks/home.json";
import gu from "./locales/gu/home.json";
import ta from "./locales/ta/home.json";
const translations = { en, hi, pa, ta, gu, ur, ks };

export default function Home() {
  const [lang, setLang] = useState("en");
  const [t, setT] = useState(en);

  useEffect(() => {
    const savedLang = localStorage.getItem("preferredLang") || "en";
    setLang(savedLang);
    setT(translations[savedLang]);
  }, []);

  const cardStyles =
    "relative group rounded-3xl p-8 text-center backdrop-blur-md bg-white/10 shadow-lg hover:shadow-2xl transform transition-all duration-500 hover:scale-105 hover:-translate-y-2";

  const cardBgGradient = (from, to, hoverFrom, hoverTo) =>
    `bg-gradient-to-br from-${from} to-${to} hover:from-${hoverFrom} hover:to-${hoverTo}`;

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-gray-950 via-blue-900 to-indigo-950 text-white flex flex-col items-center justify-center px-6 py-16 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-300" />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl animate-spin-slow" />

      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-10">
        <LangSwitcher />
      </div>

      {/* Heading */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 drop-shadow-lg animate-fade-in">
        {t?.title}
      </h1>

      {/* Subheading */}
      <p className="text-gray-200 max-w-3xl text-center mb-16 text-lg sm:text-xl leading-relaxed animate-fade-in delay-200">
        {t?.subtitle}
      </p>

      {/* Action Cards */}
      <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
        {/* Register Students */}
        <Link
          href="/studentFace"
          className={`${cardStyles} ${cardBgGradient(
            "green-500",
            "green-600",
            "green-400",
            "green-500"
          )}`}
        >
          <div className="absolute inset-0 rounded-3xl bg-white/20 opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 group-hover:text-white transition">
            {t?.registerTitle}
          </h2>
           <Image src={img1} height={200} width={200} className="ml-10 rounded"/>
          <p className="text-gray-100 text-sm sm:text-base">
            {t?.registerDesc}
          </p>
        </Link>

        {/* Take Attendance */}
        <Link
          href="/teacher"
          className={`${cardStyles} ${cardBgGradient(
            "yellow-500",
            "yellow-600",
            "yellow-400",
            "yellow-500"
          )}`}
        >
          <div className="absolute inset-0 rounded-3xl bg-white/20 opacity-0 group-hover:opacity-40 transition-opacity duration-300" />

          <h2 className="text-2xl sm:text-3xl font-bold mb-3 group-hover:text-white transition">
            {t?.attendanceTitle}
          </h2>
          <Image src={img} height={200} width={200} className="ml-12 rounded"/>
          <p className="text-gray-100 mt-1 text-sm sm:text-base">
            {t?.attendanceDesc}
          </p>
        </Link>

        {/* About System */}
        <Link
          href="/admin"
          className={`${cardStyles} ${cardBgGradient(
            "orange-400",
            "orange-500",
            "orange-300",
            "orange-400"
          )}`}
        >
          <div className="absolute inset-0 rounded-3xl bg-white/20 opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 group-hover:text-white transition">
            {t?.aboutTitle}
          </h2>
           <Image src={img2} height={200} width={200} className="ml-12 rounded"/>
          <p className="text-gray-100 mt-1 text-sm sm:text-base">
            {t?.aboutDesc}
          </p>
        </Link>
      </div>

      {/* Footer */}
      <footer className="mt-20 text-sm sm:text-base text-gray-300 text-center animate-fade-in delay-500">
        {t?.footer}
      </footer>
    </main>
  );
}
