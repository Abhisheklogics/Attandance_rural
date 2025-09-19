import connectToDb from "@/lib/DataBaseConnect.js";
import Attendance from "@/model/attendance.model";

export async function GET() {
  try {
    await connectToDb();

    
    const classes = await Attendance.distinct("class");

    return new Response(JSON.stringify(classes), { status: 200 });
  } catch (err) {
    console.error("Error fetching classes:", err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
