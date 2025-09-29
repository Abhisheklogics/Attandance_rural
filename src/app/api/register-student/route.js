import connectToDb from "@/lib/DataBaseConnect.js";
import ClassOne from "@/model/class.model";

export async function POST(req) {
  try {
    await connectToDb();
    const { name, roll, className, embeddings, parentNumber, gender, schoolName,category } = await req.json();

    // Required fields validation
    if (!name || !roll || !className || !embeddings || !parentNumber || !gender || !schoolName) {
      return new Response(JSON.stringify({ message: "Missing required fields." }), { status: 400 });
    }

    // Embeddings should be an array of arrays
    if (!Array.isArray(embeddings) || !embeddings.every(e => Array.isArray(e))) {
      return new Response(JSON.stringify({ message: "Invalid embeddings format." }), { status: 400 });
    }

    // Check if student already exists
    let student = await ClassOne.findOne({ roll });

    if (student) {
      // Update existing student
      student.name = name;
      student.class = className;
      student.parentNumber = parentNumber;
      student.embeddings = embeddings;
      student.gender = gender;
      student.schoolName = schoolName;
      student.category=category


      await student.save();

      return new Response(JSON.stringify({ message: "Student updated successfully!" }), { status: 200 });
    }

    // Create new student
    student = await ClassOne.create({ name, roll, class: className, parentNumber, embeddings, gender, schoolName ,category
});
    return new Response(JSON.stringify({ message: "Student registered successfully!" }), { status: 201 });

  } catch (err) {
    console.error("Registration error:", err);

    if (err.code === 11000) { // Duplicate key error
      return new Response(JSON.stringify({ message: "Roll number already exists." }), { status: 400 });
    }

    return new Response(JSON.stringify({ message: "Server error." }), { status: 500 });
  }
}
