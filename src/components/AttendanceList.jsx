'use client';

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getAllStudentsOffline } from '@/lib/indexedDB';
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import LangSwitcher from "@/components/LangSwitcher"; // Language dropdown
import translations from "../app/locales/translations"; // All languages
import { useRouter } from "next/navigation";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function AttendanceList() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [classes, setClasses] = useState([]);
  const [weeklyTrend, setWeeklyTrend] = useState([]);
const [locale, setLocale] = useState("en");
const t = translations[locale];

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
      } catch {
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
      let data = [];
      if (navigator.onLine) {
        const res = await fetch(`/api/showAll-Attandance?class=${className}`);
        if (!res.ok) throw new Error("Failed to fetch attendance online");
        data = await res.json();
      } else {
        data = await getAllStudentsOffline(className);
      }
      setAttendanceData(data);
      prepareWeeklyTrend(data);
    } catch {
      const data = await getAllStudentsOffline(className);
      setAttendanceData(data);
      prepareWeeklyTrend(data);
    } finally {
      setLoading(false);
    }
  };

  const prepareWeeklyTrend = (data) => {
    const today = new Date();
    const trend = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      const dateStr = day.toISOString().split("T")[0];
      const dayRecords = data.filter(
        (s) => s.timestamp && new Date(s.timestamp).toISOString().split("T")[0] === dateStr
      );
      const presentCount = dayRecords.filter(s => s.name).length;
      const totalCount = dayRecords.length || 0;
      const percentage = totalCount ? Math.round((presentCount / totalCount) * 100) : 0;
      trend.push({ date: dateStr, present: percentage });
    }
    setWeeklyTrend(trend);
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
        [t.name]: student.name,
        [t.class]: student.className || student.class,
        [t.roll]: student.roll,
        [t.status]: student.name ? t.present : t.absent,
        [t.time]: student.timestamp ? new Date(student.timestamp).toLocaleString() : "N/A",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, t.attendanceSheet);
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `Attendance_${selectedClass}.xlsx`);
  };

  const AttendancePieChart = () => {
    if (!attendanceData.length) return null;
    const present = attendanceData.filter(s => s.name).length;
    const absent = attendanceData.length - present;
    const data = {
      labels: [t.present, t.absent],
      datasets: [{ data: [present, absent], backgroundColor: ["#22c55e", "#ef4444"] }],
    };
    return (
      <div className="w-full max-w-md mt-6">
        <h2 className="text-xl font-semibold mb-2 text-center">{t.attendanceSummary}</h2>
        <Pie data={data} />
      </div>
    );
  };

  const AttendanceBarChart = () => {
    if (!weeklyTrend.length) return null;
    const data = {
      labels: weeklyTrend.map(d => d.date),
      datasets: [{ label: t.attendancePercent, data: weeklyTrend.map(d => d.present), backgroundColor: "#3b82f6" }],
    };
    return (
      <div className="w-full max-w-3xl mt-6">
        <h2 className="text-xl font-semibold mb-2 text-center">{t.weeklyTrend}</h2>
        <Bar data={data} options={{ responsive: true, scales: { y: { min: 0, max: 100 } } }} />
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black p-4 sm:p-6 text-gray-100 flex flex-col items-center">
      <LangSwitcher onChangeLang={setLocale} selected={locale} />

      <h1 className="text-3xl sm:text-5xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
        {t.attendanceRecords}
      </h1>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 w-full max-w-lg">
        <select
          className="flex-1 bg-gray-800 text-gray-200 px-4 py-2 sm:py-3 rounded-xl border border-gray-600 focus:outline-none focus:ring focus:ring-purple-500 text-base sm:text-lg"
          value={selectedClass}
          onChange={handleClassChange}
        >
          <option value="">{t.selectClass}</option>
          {classes.map((cls, idx) => <option key={idx} value={cls}>{cls}</option>)}
        </select>

        {selectedClass && attendanceData.length > 0 && (
          <button onClick={exportToExcel} className="w-full sm:w-auto px-5 py-2 sm:px-6 sm:py-3 bg-green-500 rounded-xl hover:bg-green-600 transition text-black font-semibold text-sm sm:text-base">
            {t.exportExcel}
          </button>
        )}
      </div>

      {loading && <p className="text-lg text-gray-400 animate-pulse">{t.loading}</p>}

      {!loading && selectedClass && attendanceData.length > 0 && (
        <>
          <AttendancePieChart />
          <AttendanceBarChart />
          {/* Table omitted for brevity, add similar i18n labels */}
        </>
      )}
    </div>
  );
}

export default AttendanceList;
