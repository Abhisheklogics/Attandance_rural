import connectToDb from "@/lib/DataBaseConnect.js";
import ClassOne from "@/model/class.model";
import ClassTwo from "@/model/class.model2";

export async function POST(req) {
  try {
    await connectToDb();
    const { name, roll, className, embeddings, parentNumber } = await req.json();

    if (!name || !roll || !className || !embeddings || embeddings.length !== 2 || !parentNumber) {
      return new Response(JSON.stringify({ message: "Missing required fields." }), { status: 400 });
    }

    let Model;
    if (className === '1') Model = ClassOne;
    else if (className === '2') Model = ClassTwo;
    else return new Response(JSON.stringify({ message: "Invalid class." }), { status: 400 });

    let student = await Model.findOne({ roll });

    if (student) {
      student.name = name;
      student.class = className;
      student.parentNumber = parentNumber;
      student.embeddings = embeddings;
      await student.save();
      return new Response(JSON.stringify({ message: "Student updated successfully!" }), { status: 200 });
    }

    student = await Model.create({ name, roll, class: className, parentNumber, embeddings });
    return new Response(JSON.stringify({ message: "Student registered successfully!" }), { status: 201 });

  } catch (err) {
    console.error("Registration error:", err);
    if (err.code === 11000) {
      return new Response(JSON.stringify({ message: "Roll number already exists." }), { status: 400 });
    }
    return new Response(JSON.stringify({ message: "Server error." }), { status: 500 });
  }
}
