import connectToDb from "@/lib/DataBaseConnect.js";
import Attendance from "@/model/attendance.model";

// Function to format date/time as DD/MM/YY hh:mm AM/PM
function getFormattedDateTime() {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0"); 
  const year = String(now.getFullYear()).slice(2); // last 2 digits

  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 => 12

  return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
}

export async function GET(req) {
  try {
    await connectToDb();

    const { searchParams } = new URL(req.url);
    const className = searchParams.get("class");

    const query = className ? { class: className } : {};

    const students = await Attendance.find(query, {
      name: 1,
      roll: 1,
      class: 1,
      status: 1, 
      _id: 0,
    });

    const currentDateTime = getFormattedDateTime();

    // Add current date/time to each student record
    const studentsWithTime = students.map(student => ({
      ...student.toObject(), // convert Mongoose doc to plain JS object
      timestamp: currentDateTime
    }));

    return new Response(JSON.stringify(studentsWithTime), { status: 200 });
  } catch (err) {
    console.error("Error fetching attendance:", err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
