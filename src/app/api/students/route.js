import connectToDb from "@/lib/DataBaseConnect.js";
import Student from "@/model/user.model.js";

export async function GET() {
  try {
    await connectToDb();

    const students = await Student.find(
      {},
      { name: 1, roll: 1, class: 1, embeddings: 1, _id: 0 } 
    );

    return new Response(JSON.stringify(students), { status: 200 });
  } catch (err) {
    console.error(" Error fetching students:", err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
