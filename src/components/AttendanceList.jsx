'use client'

import { useEffect, useState } from "react";

function AttendanceList() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
 

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await fetch("/api/showAll-Attandance");
        const data = await res.json();
        setAttendanceData(data);
      } catch (err) {
        console.error(" Error fetching attendance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl font-semibold text-gray-700">Loading attendance...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black p-6 text-gray-100">
  <h1 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
    📋 Attendance Records
  </h1>

  <div className="overflow-x-auto rounded-2xl shadow-2xl border border-gray-800">
    <table className="min-w-full divide-y divide-gray-700">
      {/* Table Head */}
      <thead className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700">
        <tr>
          <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider text-gray-200">
            Name
          </th>
          <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider text-gray-200">
            Class
          </th>
          <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider text-gray-200">
            Roll Number
          </th>
          <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider text-gray-200">
            Status
          </th>
        </tr>
      </thead>

      {/* Table Body */}
      <tbody className="divide-y divide-gray-800">
        {attendanceData.length === 0 && (
          <tr>
            <td
              colSpan="4"
              className="py-6 text-center text-gray-500 italic"
            >
              No attendance records found.
            </td>
          </tr>
        )}

        {attendanceData.map((student, index) => (
          <tr
            key={index}
            className={`transition-colors duration-200 ${
              index % 2 === 0
                ? "bg-gray-900 hover:bg-gray-800"
                : "bg-gray-950 hover:bg-gray-800"
            }`}
          >
            <td className="py-4 px-6 font-medium">{student.name}</td>
            <td className="py-4 px-6">{student.class}</td>
            <td className="py-4 px-6">{student.roll}</td>
            <td className="py-4 px-6">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  student.name
                    ? "bg-green-600 text-green-100"
                    : "bg-gray-600 text-gray-300"
                }`}
              >
                {student.name ? "Present" : "Not Present"}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  );
}

export default AttendanceList;
