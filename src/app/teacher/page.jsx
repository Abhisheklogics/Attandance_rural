// app/teacher/page.js
export default function Page() {
  return (
    <div className=" relative min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-gradient-to-b from-gray-950 via-blue-900 to-indigo-950 text-white overflow-hidden">
      {/* background blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-yellow-400/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-300" />

      <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 drop-shadow-lg">
        Welcome, Teacher
      </h2>
      <p className="text-gray-200 text-lg sm:text-xl text-center max-w-2xl leading-relaxed">
        Manage attendance, register students’ faces, and monitor progress with ease.
      </p>
    </div>
  );
}
