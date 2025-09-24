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
    <div className="md:ml-[-250px] min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black p-6 text-gray-100 flex flex-col items-center">
      
      {/* Heading */}
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-lg animate-fade-in">
        Attendance Records
      </h1>

      {/* Class Selector */}
      <div className="w-full max-w-md mb-10">
        <select
          className="w-full bg-gray-800 text-gray-200 px-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:ring focus:ring-purple-500 text-lg"
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
      </div>

      {/* Loading State */}
      {loading && (
        <p className="text-lg text-gray-400 animate-pulse mb-10">
          Loading attendance...
        </p>
      )}

      {/* Attendance Cards */}
      {!loading && selectedClass && attendanceData.length > 0 && (
        <div className="grid gap-6 w-full max-w-5xl sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {attendanceData.map((student, idx) => (
            <div
              key={idx}
              className="bg-gray-800 rounded-2xl shadow-2xl p-6 flex flex-col gap-2 transition-transform transform hover:-translate-y-2 hover:scale-105"
            >
              <h2 className="text-xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500">
                {student.name}
              </h2>
              <p className="text-gray-300">
                <span className="font-semibold">Class:</span> {student.class}
              </p>
              <p className="text-gray-300">
                <span className="font-semibold">Roll No:</span> {student.roll}
              </p>
               <p className="text-gray-300">
  <span className="font-semibold">Time:</span>{" "}
  {student.timestamp
    ? new Date(student.timestamp).toLocaleString() // formats to local date & time
    : "N/A"}
</p>

              <p
                className={`mt-2 font-semibold ${
                  student.name ? "text-green-400" : "text-red-400"
                }`}
              >
                {student.name ? "Present" : "Not Present"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* No Records */}
      {!loading && selectedClass && attendanceData.length === 0 && (
        <p className="text-gray-500 italic mt-10 text-center">
          No attendance records found for this class.
        </p>
      )}

      {/* Prompt to Select Class */}
      {!selectedClass && !loading && (
        <p className="text-gray-500 mt-10 text-center">
          Please select a class to view attendance.
        </p>
      )}
    </div>
  );
}

export default AttendanceList;
