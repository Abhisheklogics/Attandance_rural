import connectToDb from "@/lib/DataBaseConnect.js";
import ClassOne from "@/model/class.model.js";


export async function GET(req) {
  try {
    await connectToDb();
    const url = new URL(req.url);
    const className = url.searchParams.get("class"); // get class query

    if (!className) {
      return new Response(
        JSON.stringify({ message: "Class not specified." }),
        { status: 400 }
      );
    }

    let students = await ClassOne.find(
        { class: className },
        { name: 1, roll: 1, class: 1, embeddings: 1, _id: 0 }
      );
      return new Response(JSON.stringify(students), { status: 200 });

    

} catch (err) {
    console.error("Error fetching students:", err);
    return new Response(
      JSON.stringify({ message: "Server error" }),
      { status: 500 }
    );
  }
}
