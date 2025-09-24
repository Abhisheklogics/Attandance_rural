"use client";

import Link from "next/link";

export default function Home() {
  return (
  <main className="relative min-h-screen bg-gradient-to-b from-black-900 via-blue-800 to-green-950 text-white flex flex-col items-center justify-center px-6 py-12 overflow-hidden">
  {/* Background blobs for friendly vibe */}
  <div className="absolute -top-20 -left-32 w-96 h-96 bg-yellow-400 opacity-30 rounded-full blur-3xl animate-pulse" />
  <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500 opacity-20 rounded-full blur-3xl animate-pulse delay-300" />

  {/* Heading */}
  <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 drop-shadow-lg animate-fade-in">
    Smart Face Attendance for Rural Schools
  </h1>

  {/* Subheading */}
  <p className="text-gray-200 max-w-2xl text-center mb-16 text-lg sm:text-xl animate-fade-in delay-200">
    A simple, reliable, and futuristic face-recognition attendance system, designed to empower teachers and students in rural areas.
  </p>

  {/* Action Cards */}
  <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">

    {/* Register Students */}
    <Link
      href="/studentFace"
      className="group relative bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-8 text-center shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-green-500/40 hover:from-green-400 hover:to-green-500 hover:-translate-y-2"
    >
      <div className="absolute inset-0 rounded-3xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <h2 className="text-2xl sm:text-3xl font-bold mb-3 group-hover:text-white transition">
        Register Students
      </h2>
      <p className="text-gray-100 text-sm sm:text-base">
        Capture student facial data easily and securely.
      </p>
    </Link>

    {/* Take Attendance */}
    <Link
      href="/teacher"
      className="group relative bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-3xl p-8 text-center shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-yellow-500/40 hover:from-yellow-400 hover:to-yellow-500 hover:-translate-y-2"
    >
      <div className="absolute inset-0 rounded-3xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <h2 className="text-2xl sm:text-3xl font-bold mb-3 group-hover:text-white transition">
        Mark Attendance
      </h2>
      <p className="text-gray-100 text-sm sm:text-base">
        Quickly mark attendance with face recognition.
      </p>
    </Link>

    {/* Optional: Info Card */}
    <div className="group relative bg-gradient-to-br from-orange-400 to-orange-500 rounded-3xl p-8 text-center shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-orange-500/40 hover:-translate-y-2">
      <div className="absolute inset-0 rounded-3xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <h2 className="text-2xl sm:text-3xl font-bold mb-3 group-hover:text-white transition">
        About System
      </h2>
      <p className="text-gray-100 text-sm sm:text-base">
        Learn how this system helps rural schools improve attendance and reduce paperwork.
      </p>
    </div>
  </div>

  {/* Footer */}
  <footer className="mt-20 text-sm sm:text-base text-gray-300 text-center animate-fade-in delay-500">
    © 2025 Abhishek Kumar Production
  </footer>
</main>
  );
}
