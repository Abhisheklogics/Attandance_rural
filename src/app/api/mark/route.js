import connectToDb from "@/lib/DataBaseConnect";
import Attendance from "@/model/attendance.model";

export async function POST(req) {
  try {
    await connectToDb();

    const { students, timestamp } = await req.json();

    if (!students || !students.length) {
      return new Response(
        JSON.stringify({ message: "No students provided." }),
        { status: 400 }
      );
    }

    // Ensure timestamp is valid
    const ts = timestamp ? new Date(timestamp) : new Date();
    if (isNaN(ts.getTime())) {
      // Invalid date fallback
      console.warn("Invalid timestamp received, using current date");
    }

    // Prepare entries
    const entries = students.map((stu) => ({
      name: stu.name,
      roll: stu.roll,
      class: stu.className || stu.class,
      timestamp: isNaN(ts.getTime()) ? new Date() : ts, // ensure valid Date
    }));

    await Attendance.insertMany(entries);

    return new Response(
      JSON.stringify({ message: "Attendance marked successfully!" }),
      { status: 201 }
    );
  } catch (err) {
    console.error("Error marking attendance:", err);
    return new Response(
      JSON.stringify({ message: "Server error." }),
      { status: 500 }
    );
  }
}
