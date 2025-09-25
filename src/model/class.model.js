import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    roll: { type: String, required: true, unique: true },
    class: { type: String, required: true },
    parentNumber:{type: String, required: true},
   embeddings: { type: [[Number]], required: true }, 
  },
  { timestamps: true }
);

const ClassOne = mongoose.models.ClassOne || mongoose.model("ClassOne", classSchema);

export default ClassOne;
