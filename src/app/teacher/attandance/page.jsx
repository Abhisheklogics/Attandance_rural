
import Link from "next/link";

export default function page() {
  const classes = Array.from({ length: 10 }, (_, i) => i + 1);



  return (
    <div className="md:ml-[50px]">
      <h2 className="text-2xl font-bold mb-4">Select a Class for Attendance</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {classes.map((num) => (
          <Link
            key={num}
            href={`/teacher/attandance/${num}`}
            className="px-4 py-2 text-center rounded-lg bg-gray-700/40 hover:bg-gray-700/60"
          >
            Class {num}
          </Link>
        ))}
      </div>
    </div>
  );
}
