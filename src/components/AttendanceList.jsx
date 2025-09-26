'use client';

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getAllStudentsOffline } from "@/lib/indexedDB"; 

function AttendanceList() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [classes, setClasses] = useState([]);

  
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        if (navigator.onLine) {
          const res = await fetch("/api/classes");
          if (!res.ok) throw new Error("Failed to fetch classes online");
          const data = await res.json();
          setClasses(data);
        } else {
         
          const offlineStudents = await getAllStudentsOffline();
          const distinctClasses = [...new Set(offlineStudents.map(s => s.className))];
          setClasses(distinctClasses);
        }
      } catch (err) {
        console.warn("Offline fallback for classes:", err);
        const offlineStudents = await getAllStudentsOffline();
        const distinctClasses = [...new Set(offlineStudents.map(s => s.className))];
        setClasses(distinctClasses);
      }
    };
    fetchClasses();
  }, []);

  
  const fetchAttendance = async (className) => {
    setLoading(true);
    try {
      if (navigator.onLine) {
        const res = await fetch(`/api/showAll-Attandance?class=${className}`);
        if (!res.ok) throw new Error("Failed to fetch attendance online");
        const data = await res.json();
        setAttendanceData(data);
      } else {
        const offlineData = await getAllStudentsOffline(className);
        setAttendanceData(offlineData);
      }
    } catch (err) {
      console.warn("Offline fallback for attendance:", err);
      const offlineData = await getAllStudentsOffline(className);
      setAttendanceData(offlineData);
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = (e) => {
    const className = e.target.value;
    setSelectedClass(className);
    if (className) fetchAttendance(className);
  };


  const exportToExcel = () => {
    if (!attendanceData.length) return;
    const worksheet = XLSX.utils.json_to_sheet(
      attendanceData.map((student) => ({
        Name: student.name,
        Class: student.className || student.class,
        "Roll Number": student.roll,
        Status: student.name ? "Present" : "Not Present",
        Time: student.timestamp ? new Date(student.timestamp).toLocaleString() : "N/A",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `Attendance_Class_${selectedClass}.xlsx`);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black p-4 sm:p-6 text-gray-100 flex flex-col items-center">

      <h1 className="text-3xl sm:text-5xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-lg animate-fade-in">
        Attendance Records
      </h1>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 w-full max-w-lg">
        <select
          className="flex-1 bg-gray-800 text-gray-200 px-4 py-2 sm:py-3 rounded-xl border border-gray-600 focus:outline-none focus:ring focus:ring-purple-500 text-base sm:text-lg"
          value={selectedClass}
          onChange={handleClassChange}
        >
          <option value="">Select Class</option>
          {classes.map((cls, idx) => (
    <option key={idx} value={cls}>
      Class {cls}
    </option>
  ))}
        </select>

        {selectedClass && attendanceData.length > 0 && (
          <button
            onClick={exportToExcel}
            className="w-full sm:w-auto px-5 py-2 sm:px-6 sm:py-3 bg-green-500 rounded-xl hover:bg-green-600 transition text-black font-semibold text-sm sm:text-base"
          >
            Export to Excel
          </button>
        )}
      </div>

      {loading && <p className="text-lg text-gray-400 animate-pulse">Loading attendance...</p>}

      {!loading && selectedClass && attendanceData.length > 0 && (
        <div className="w-full overflow-x-auto rounded-2xl shadow-2xl border border-gray-700">
          <table className="w-full text-xs sm:text-sm md:text-base divide-y divide-gray-700">
            <thead className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700">
              <tr>
                <th className="py-3 px-4 sm:py-4 sm:px-6 text-left font-semibold uppercase tracking-wider text-gray-200">Name</th>
                <th className="py-3 px-4 sm:py-4 sm:px-6 text-left font-semibold uppercase tracking-wider text-gray-200">Class</th>
                <th className="py-3 px-4 sm:py-4 sm:px-6 text-left font-semibold uppercase tracking-wider text-gray-200">Roll No</th>
                <th className="py-3 px-4 sm:py-4 sm:px-6 text-left font-semibold uppercase tracking-wider text-gray-200">Time</th>
                <th className="py-3 px-4 sm:py-4 sm:px-6 text-left font-semibold uppercase tracking-wider text-gray-200">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {attendanceData.map((student, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-gray-900" : "bg-gray-950"}>
                  <td className="py-3 px-4 sm:py-4 sm:px-6">{student.name}</td>
                  <td className="py-3 px-4 sm:py-4 sm:px-6">{student.className || student.class}</td>
                  <td className="py-3 px-4 sm:py-4 sm:px-6">{student.roll}</td>
                  <td className="py-3 px-4 sm:py-4 sm:px-6">{student.timestamp ? new Date(student.timestamp).toLocaleString() : "N/A"}</td>
                  <td className={`py-3 px-4 sm:py-4 sm:px-6 font-semibold ${student.name ? "text-green-400" : "text-red-400"}`}>
                    {student.name ? "Present" : "Not Present"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && selectedClass && attendanceData.length === 0 && (
        <p className="text-gray-500 italic mt-10 text-center">
          No attendance records found for this class.
        </p>
      )}

      {!selectedClass && !loading && (
        <p className="text-gray-500 mt-10 text-center">
          Please select a class to view attendance.
        </p>
      )}

    </div>
  );
}

export default AttendanceList;
