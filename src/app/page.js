"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white flex flex-col items-center justify-center px-6 py-12 overflow-hidden">
     
      <div className="absolute -top-20 -left-32 w-96 h-96 bg-purple-700 opacity-30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-600 opacity-20 rounded-full blur-3xl animate-pulse delay-300" />

      
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 drop-shadow-lg animate-fade-in">
        Smart Face Attendance for Rural Schools
      </h1>

    
      <p className="text-gray-300 max-w-2xl text-center mb-16 text-lg sm:text-xl animate-fade-in delay-200">
        A simple, reliable, and futuristic face-recognition attendance system,
        built especially for rural education. Try the prototype below.
      </p>

    
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3 w-full max-w-6xl">
      
        <Link
          href="/AttandanceLag"
          className="group relative bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-3xl p-8 text-center shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-yellow-500/40 hover:from-yellow-400 hover:to-yellow-500 hover:-translate-y-2"
        >
          <div className="absolute inset-0 rounded-3xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 group-hover:text-white transition">
             Hazri Lagao
          </h2>
          <p className="text-gray-100 text-sm sm:text-base">
            Quickly mark attendance using face recognition.
          </p>
        </Link>

      
        <Link
          href="/ShowAllStudents"
          className="group relative bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-8 text-center shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-green-500/40 hover:from-green-400 hover:to-green-500 hover:-translate-y-2"
        >
          <div className="absolute inset-0 rounded-3xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 group-hover:text-white transition">
             Dekho Hazri
          </h2>
          <p className="text-gray-100 text-sm sm:text-base">
            View all registered students and their attendance details.
          </p>
        </Link>

       
        <Link
          href="/studentFace"
          className="group relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-center shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-blue-500/40 hover:from-blue-400 hover:to-blue-500 hover:-translate-y-2"
        >
          <div className="absolute inset-0 rounded-3xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 group-hover:text-white transition">
             Face Se Register Karo
          </h2>
          <p className="text-gray-100 text-sm sm:text-base">
            Register new students by capturing their facial data.
          </p>
        </Link>
      </div>

     
      <footer className="mt-20 text-sm sm:text-base text-gray-400 text-center animate-fade-in delay-500">
        © 2025 Smart Face Attendance — Hackathon Prototype
      </footer>
    </main>
  );
}
