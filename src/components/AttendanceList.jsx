'use client';

import { useEffect, useState } from "react";

function AttendanceList() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black p-6 text-gray-100">
      <h1 className="text-4xl font-extrabold mb-6 text-center bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
         Attendance Records
      </h1>

      {/* Class Selector */}
      <div className="flex justify-center mb-8">
        <select
          className="bg-gray-800 text-gray-200 px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring focus:ring-purple-500"
          value={selectedClass}
          onChange={handleClassChange}
        >
          <option value="">Select Class</option>
          {classes.map((cls, idx) => (
            <option key={idx} value={cls}>
              class ({cls})
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-32">
          <p className="text-lg text-gray-400 animate-pulse">Loading attendance...</p>
        </div>
      )}

      {!loading && selectedClass && (
        <div className="overflow-x-auto rounded-2xl shadow-2xl border border-gray-800">
          <table className="min-w-full divide-y divide-gray-700">
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

            <tbody className="divide-y divide-gray-800">
              {attendanceData.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-500 italic">
                    No attendance records found for this class.
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
                      {student.name ? 'Present':'Not Present'}
                  </td>
                   
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!selectedClass && !loading && (
        <p className="text-center text-gray-500 mt-6">Please select a class to view attendance.</p>
      )}
    </div>
  );
}

export default AttendanceList;
