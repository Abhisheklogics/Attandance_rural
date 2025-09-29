'use client';

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getAllStudentsOffline } from "@/lib/indexedDB";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line
} from "recharts";

export default function PrincipalDashboard() {
  const [data, setData] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch classes on mount
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

  // Fetch attendance data when class changes
useEffect(() => {
  if (!selectedClass) return;

  if (navigator.onLine) { 
    setLoading(true);
    fetch(`/api/students?class=${selectedClass}`)
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  } else {
    getAllStudentsOffline(selectedClass)
      .then(data => setData(data))  // use setData, not setClasses
      .catch(() => console.log("Offline data not available"));
  }
}, [selectedClass]);


  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `Class_${selectedClass}_Attendance.xlsx`);
  };

  // Simulate today's attendance randomly
  const simulateAttendance = () => {
    const simulated = data.map(d => ({
      ...d,
      present: Math.random() > 0.3 // 70% chance present
    }));
    setData(simulated);
  };

  // Class totals & KPIs
  const classTotals = Array.from(new Set(data.map(d => d.className)))
    .map(cls => ({
      className: cls,
      totalStudents: data.filter(d => d.className === cls).length,
      presentToday: data.filter(d => d.className === cls && d.present).length
    }));

  // Category-wise count
  const categoryCounts = ["SC", "ST", "OBC", "GEN"].map(cat => ({
    name: cat,
    value: data.filter(d => d.category === cat).length
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Attendance trend
  const attendanceTrend = Object.entries(
    data.reduce((acc, d) => {
      if (!d.date) return acc;
      const date = new Date(d.date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + (d.present ? 1 : 0);
      return acc;
    }, {})
  ).map(([date, count]) => ({ date, present: count }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Students with 3 consecutive absences
  const absencesMap = data.reduce((acc, d) => {
    if (!d.roll) return acc;
    if (!acc[d.roll]) acc[d.roll] = { name: d.name, count: 0, lastAbsent: null };
    if (!d.present) {
      acc[d.roll].count += 1;
      acc[d.roll].lastAbsent = d.date;
    } else {
      acc[d.roll].count = 0;
    }
    return acc;
  }, {});
  const alertStudents = Object.values(absencesMap).filter(s => s.count >= 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black p-6 text-white">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-fade-in">
        Principal Dashboard - Attendance Overview
      </h1>

      {/* Class selection & buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <select
          className="bg-gray-800 px-4 py-2 rounded-xl"
          value={selectedClass}
          onChange={e => setSelectedClass(e.target.value)}
        >
          <option value="">Select Class</option>
          {classes.map((cls, idx) => (
            <option key={idx} value={cls}>Class {cls}</option>
          ))}
        </select>

        {selectedClass && (
          <>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold"
              onClick={simulateAttendance}
            >
              Simulate Today's Attendance
            </button>
            <button
              className="bg-green-500 hover:bg-green-600 text-black px-5 py-2 rounded-xl font-semibold"
              onClick={exportToExcel}
            >
              Export Excel
            </button>
          </>
        )}
      </div>

      {loading && <p className="text-center text-gray-400">Loading data...</p>}

      {!loading && selectedClass && data.length > 0 && (
        <>
          {/* KPI Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {classTotals.map((cls, idx) => {
              const attendancePercent = ((cls.presentToday / cls.totalStudents) * 100).toFixed(1);
              return (
                <div key={idx} className="bg-gray-800 p-6 rounded-2xl shadow-lg text-center">
                  <h2 className="text-xl font-bold mb-2">Class Strength : {cls.className}</h2>
                  <p>Total Students: <span className="font-semibold">{cls.totalStudents}</span></p>
                  <p>Present Today: <span className="text-green-400 font-semibold">{cls.presentToday}</span></p>
                  <div className="w-full bg-gray-700 rounded-full h-4 mt-2">
                    <div
                      className="bg-green-500 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${attendancePercent}%` }}
                    />
                  </div>
                  <p className="mt-1 text-sm">{attendancePercent}% Attendance</p>
                </div>
              );
            })}
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Class-wise attendance */}
            <div className="bg-gray-800 p-4 rounded-2xl shadow-lg">
              <h2 className="text-lg font-semibold mb-2">Class-wise Attendance</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={classTotals}>
                  <XAxis dataKey="className" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip />
                  <Bar dataKey="presentToday" fill="#82ca9d" name="Present Students" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Category-wise */}
            <div className="bg-gray-800 p-4 rounded-2xl shadow-lg">
              <h2 className="text-lg font-semibold mb-2">Category-wise Students</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={categoryCounts} dataKey="value" nameKey="name" outerRadius={80}>
                    {categoryCounts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Attendance Trend */}
            <div className="bg-gray-800 p-4 rounded-2xl shadow-lg">
              <h2 className="text-lg font-semibold mb-2">Attendance Trend</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={attendanceTrend}>
                  <XAxis dataKey="date" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip />
                  <Line type="monotone" dataKey="present" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Alerts */}
          {alertStudents.length > 0 && (
            <div className="bg-red-900 p-4 rounded-2xl mb-6">
              <h2 className="text-xl font-bold mb-2">⚠ Students with 3 Consecutive Absences</h2>
              <ul className="list-disc ml-6">
                {alertStudents.map((s, idx) => (
                  <li key={idx}>{s.name} - Last absent on {new Date(s.lastAbsent).toLocaleDateString()}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Attendance Table */}
          <div className="overflow-x-auto rounded-2xl shadow-2xl border border-gray-700">
            <table className="w-full text-sm divide-y divide-gray-700">
              <thead className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700">
                <tr>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Gender</th>
                  <th className="py-3 px-4 text-left">Class</th>
                  <th className="py-3 px-4 text-left">Roll No</th>
                  <th className="py-3 px-4 text-left">Category</th>
                  <th className="py-3 px-4 text-left">Present</th>
                  <th className="py-3 px-4 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {data.map((student, idx) => {
                  const isAlert = alertStudents.some(s => s.name === student.name);
                  return (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-gray-900" : "bg-gray-950"}>
                      <td className="py-3 px-4">{student.name || "-"}</td>
                      <td className="py-3 px-4">{student.gender || "-"}</td>
                      <td className="py-3 px-4">{student.class || "-"}</td>
                      <td className="py-3 px-4">{student.roll || "-"}</td>
                      <td className="py-3 px-4">{student.category || "-"}</td>
                      <td className="py-3 px-4 font-semibold flex items-center gap-2">
                        {student.present ? (
                          <span className="text-green-400">✔ Yes</span>
                        ) : (
                          <span className="text-red-400">✖ No</span>
                        )}
                        {isAlert && <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs">⚠</span>}
                      </td>
                      <td className="py-3 px-4">{student.timestamp ? new Date(student.timestamp).toLocaleDateString() : "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!loading && selectedClass && data.length === 0 && (
        <p className="text-gray-500 italic mt-10 text-center">No records found for this class.</p>
      )}

      {!selectedClass && !loading && (
        <p className="text-gray-500 mt-10 text-center">Please select a class to view data.</p>
      )}
    </div>
  );
}
