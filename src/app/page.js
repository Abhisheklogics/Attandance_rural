"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white flex flex-col items-center justify-center px-6 py-12">
      
      {/* Heading */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 animate-text">
        Smart Face Attendance for Rural Schools
      </h1>

      {/* Subheading */}
      <p className="text-gray-400 max-w-2xl text-center mb-12 text-lg sm:text-xl">
        Simple and reliable face-recognition based attendance system designed for rural areas. Navigate below to test the prototype.
      </p>

      {/* Cards */}
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3 w-full max-w-6xl">
        
        {/* Card 1 */}
        <Link
          href="/AttandanceLag"
          className="group relative bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-3xl p-8 text-center shadow-2xl transform transition duration-500 hover:scale-105 hover:shadow-3xl hover:from-yellow-400 hover:to-yellow-500"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 group-hover:text-white transition">
            Hazri Lagao
          </h2>
          <p className="text-gray-100 text-sm sm:text-base">
            Mark attendance quickly with face recognition.
          </p>
        </Link>

        {/* Card 2 */}
        <Link
          href="/ShowAllStudents"
          className="group relative bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-8 text-center shadow-2xl transform transition duration-500 hover:scale-105 hover:shadow-3xl hover:from-green-400 hover:to-green-500"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 group-hover:text-white transition">
            Dekho Hazri
          </h2>
          <p className="text-gray-100 text-sm sm:text-base">
            View all registered students and their details.
          </p>
        </Link>

        {/* Card 3 */}
        <Link
          href="/studentFace"
          className="group relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-center shadow-2xl transform transition duration-500 hover:scale-105 hover:shadow-3xl hover:from-blue-400 hover:to-blue-500"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 group-hover:text-white transition">
            Face Se Register Karo
          </h2>
          <p className="text-gray-100 text-sm sm:text-base">
            Register new students with their facial data.
          </p>
        </Link>

      </div>

      {/* Footer */}
      <footer className="mt-20 text-sm sm:text-base text-gray-400 text-center">
        © 2025 Face Attendance for Rural Schools — Hackathon Prototype
      </footer>
    </main>
  );
}
