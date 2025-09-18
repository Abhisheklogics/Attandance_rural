import connectToDb from "@/lib/DataBaseConnect.js";
import Student from "@/model/user.model.js";

export async function POST(req) {
  try {
    await connectToDb();

   
    const { name, roll, class: className, embeddings } = await req.json();


    if (!name || !roll || !className || !embeddings || embeddings.length !== 3) {
      return new Response(
        JSON.stringify({ message: "Missing required fields or less than 3 embeddings." }),
        { status: 400 }
      );
    }

  
    let student = await Student.findOne({ roll });

    if (student) {
      student.name = name;
      student.class = className;
      student.embeddings = embeddings;
      await student.save();

      return new Response(
        JSON.stringify({ message: "Student updated successfully!" }),
        { status: 200 }
      );
    }

    
    student = await Student.create({ name, roll, class: className, embeddings });

    return new Response(
      JSON.stringify({ message: "Student registered successfully!" }),
      { status: 201 }
    );
  } catch (err) {
    console.error(" Registration error:", err);

    if (err.code === 11000) {
      return new Response(
        JSON.stringify({ message: "Roll number already exists." }),
        { status: 400 }
      );
    }

    return new Response(JSON.stringify({ message: "Server error." }), { status: 500 });
  }
}
