import connectToDb from "@/lib/DataBaseConnect.js";
import ClassOne from "@/model/class.model";
import ClassTwo from "@/model/class.model2";

export async function POST(req) {
  try {
    await connectToDb();

   
    const { name, roll, class: className, embeddings } = await req.json();
    if(className == '1')
    {
if (!name || !roll || !className || !embeddings || embeddings.length !== 2) {
  return new Response(
    JSON.stringify({ message: "Missing required fields or incorrect embeddings count." }),
    { status: 400 }
  );
}

let student = await ClassOne.findOne({ roll });

if (student) {
  student.name = name;
  student.class = className;

  student.embeddings = embeddings;
  await student.save();

  return new Response(JSON.stringify({ message: "Student updated successfully!" }), { status: 200 });
}

// create new student
student = await ClassOne.create({ name, roll, class: className,embeddings });

return new Response(JSON.stringify({ message: "Student registered successfully!" }), { status: 201 });



    }

    if(className == '2')
    {
if (!name || !roll || !className || !embeddings || embeddings.length !== 2) {
  return new Response(
    JSON.stringify({ message: "Missing required fields or incorrect embeddings count." }),
    { status: 400 }
  );
}

let student = await ClassTwo.findOne({ roll });

if (student) {
  student.name = name;
  student.class = className;

  student.embeddings = embeddings;
  await student.save();

  return new Response(JSON.stringify({ message: "Student updated successfully!" }), { status: 200 });
}

// create new student
student = await ClassTwo.create({ name, roll, class: className,embeddings });

return new Response(JSON.stringify({ message: "Student registered successfully!" }), { status: 201 });



    }

  } 
  catch (err) {
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
