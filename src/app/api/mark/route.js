import connectToDb from "@/lib/DataBaseConnect";
import Attendance from "@/model/attendance.model";

export async function POST(req) {
  try {
    await connectToDb();

    const { students, timestamp} = await req.json();

    if (!students || !students.length) {
      return new Response(
        JSON.stringify({ message: "No students provided." }),
        { status: 400 }
      );
    }

    // Saare students ko ek hi baar insert karenge
    const entries = students.map((stu) => ({
      name: stu.name,
      roll: stu.roll,
      class: stu.className,
      timestamp: new Date(timestamp),
      
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
