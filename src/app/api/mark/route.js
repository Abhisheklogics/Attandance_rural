import connectToDb from "@/lib/DataBaseConnect";
import Attendance from "@/model/attendance.model";

export async function POST(req) {
  try {
    await connectToDb();

   
    const { name, roll, className } = await req.json();

    
    if (!name || !roll || !className) {
      return new Response(
        JSON.stringify({ message: "Missing required fields." }),
        { status: 400 }
      );
    }

   
    const newEntry = await Attendance.create({
      name,
      roll,
      class: className,
    });

    return new Response(
      JSON.stringify({ message: "Attendance marked successfully!" }),
      { status: 201 }
    );
  } catch (err) {
    console.error(" Error marking attendance:", err);
    return new Response(JSON.stringify({ message: "Server error." }), { status: 500 });
  }
}
