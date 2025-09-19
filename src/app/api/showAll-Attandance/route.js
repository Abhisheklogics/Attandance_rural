import connectToDb from "@/lib/DataBaseConnect.js";
import Attendance from "@/model/attendance.model";

export async function GET(req) {
  try {
    await connectToDb();

    
    const { searchParams } = new URL(req.url);
    console.log(searchParams)
    const className = searchParams.get("class");

    const query = className ? { class: className } : {};

    const students = await Attendance.find(query, {
      name: 1,
      roll: 1,
      class: 1,
      status: 1, 
      _id: 0,
    });

    return new Response(JSON.stringify(students), { status: 200 });
  } catch (err) {
    console.error("Error fetching attendance:", err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
