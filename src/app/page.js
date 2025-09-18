



"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center justify-center px-6">
     
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-center">
        Smart Face Attendance for Rural
      </h1>
      <p className="text-gray-400 max-w-xl text-center mb-10">
        Simple and reliable face-recognition based attendance system designed
        for rural areas. Navigate below to test the prototype.
      </p>

      
      <div className="grid gap-6 md:grid-cols-3 w-full max-w-4xl">
        <Link
          href="/AttandanceLag"
          className="group bg-gray-800 hover:bg-gray-700 rounded-2xl p-8 text-center shadow-lg transition transform hover:scale-105"
        >
          <h2 className="text-2xl font-semibold mb-3 group-hover:text-yellow-400">
           Hazzri Lagva
          </h2>
          <p className="text-gray-400 text-sm">
            Mark attendance quickly with face recognition.
          </p>
        </Link>

        <Link
          href="/ShowAllStudents"
          className="group bg-gray-800 hover:bg-gray-700 rounded-2xl p-8 text-center shadow-lg transition transform hover:scale-105"
        >
          <h2 className="text-2xl font-semibold mb-3 group-hover:text-green-400">
            Hazzri Dekh
          </h2>
          <p className="text-gray-400 text-sm">
            View all registered students and their details.
          </p>
        </Link>

        <Link
          href="/studentFace"
          className="group bg-gray-800 hover:bg-gray-700 rounded-2xl p-8 text-center shadow-lg transition transform hover:scale-105"
        >
          <h2 className="text-2xl font-semibold mb-3 group-hover:text-blue-400">
            Student Face Registration
          </h2>
          <p className="text-gray-400 text-sm">
            Register new students with their facial data.
          </p>
        </Link>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-sm text-gray-500">
        © 2025 Face Attendance for Rural — Hackathon Prototype
      </footer>
    </main>
  );
}

