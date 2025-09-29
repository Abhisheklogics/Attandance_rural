import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    roll: { type: String, required: true, unique: true },
    class: { type: String, required: true },
    parentNumber: { type: String, required: true },

    // Additional detailed fields
    category: {
    type: String,
    enum: ["GEN", "OBC", "SC", "ST"], // example allowed values
    
  },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    schoolName: { type: String, required: true },
    dob: { type: Date }, // optional
    address: { type: String }, // optional

    // Face embeddings
    embeddings: { type: [[Number]], required: true }, // each embedding is an array of numbers
  },
  { timestamps: true }
);

// Prevent model overwrite issues in Next.js hot reload
const ClassOne = mongoose.models.ClassOne || mongoose.model("ClassOne", studentSchema);

export default ClassOne;
