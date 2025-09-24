import mongoose from "mongoose";

const classSchema2 = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    roll: { type: String, required: true, unique: true },
    class: { type: String, required: true },
   embeddings: { type: [[Number]], required: true }, 
  },
  { timestamps: true }
);

const ClassTwo = mongoose.models.ClassTwo || mongoose.model("ClassTwo", classSchema2);

export default ClassTwo;
