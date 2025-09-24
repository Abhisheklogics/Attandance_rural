'use client';

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function NewAttendanceList() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch("/api/classes");
        const data = await res.json();
        setClasses(data);
      } catch (err) {
        console.error("Error fetching class list:", err);
      }
    };
    fetchClasses();
  }, []);

  const fetchAttendance = async (className) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/showAll-Attandance?class=${className}`);
      const data = await res.json();
      setAttendanceData(data);
    } catch (err) {
      console.error("Error fetching attendance:", err);
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = (e) => {
    const className = e.target.value;
    setSelectedClass(className);
    if (className) fetchAttendance(className);
  };

  // Export to Excel
  const exportToExcel = () => {
    if (attendanceData.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(
      attendanceData.map((student) => ({
        Name: student.name,
        Class: student.class,
        "Roll Number": student.roll,
        Status: student.name ? "Present" : "Not Present",
        Time: student.timestamp
          ? new Date(student.timestamp).toLocaleString()
          : "N/A",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `Attendance_Class_${selectedClass}.xlsx`);
  };

  return (
    <div className="md:ml-[-240px] min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black p-6 text-gray-100 flex flex-col items-center">
      
      
    

      
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 w-full max-w-md">
        <select
          className="flex-1 bg-gray-800 text-gray-200 px-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:ring focus:ring-purple-500 text-lg"
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
            className="px-6 py-3 bg-green-500 rounded-xl hover:bg-green-600 transition text-black font-semibold"
          >
            Export to Excel
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && <p className="text-lg text-gray-400 animate-pulse">Loading attendance...</p>}

      {/* Table */}
      {!loading && selectedClass && attendanceData.length > 0 && (
        <div className="overflow-x-auto w-full max-w-6xl rounded-2xl shadow-2xl border border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700">
              <tr>
                <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider text-gray-200">Name</th>
                <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider text-gray-200">Class</th>
                <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider text-gray-200">Roll No</th>
                <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider text-gray-200">Time</th>
                <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider text-gray-200">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {attendanceData.map((student, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-gray-900" : "bg-gray-950"}>
                  <td className="py-4 px-6">{student.name}</td>
                  <td className="py-4 px-6">{student.class}</td>
                  <td className="py-4 px-6">{student.roll}</td>
                 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

export default NewAttendanceList;
