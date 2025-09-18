import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    roll: { type: String, required: true, unique: true },
    class: { type: String, required: true },
    embeddings: { type: [[Number]], required: true }, // 2D array
  },
  { timestamps: true }
);


const Student =
  mongoose.models.Student || mongoose.model("Student", studentSchema);

export default Student;
