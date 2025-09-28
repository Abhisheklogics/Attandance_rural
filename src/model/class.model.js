import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    roll: { type: String, required: true, unique: true },
    class: { type: String, required: true },
    parentNumber: { type: String, required: true },

    // New detailed fields
    category: { type: String, enum: ["General", "OBC", "SC", "ST", "Other"], default: "General" },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    schoolName: { type: String, required: true },
    dob: { type: Date }, // optional: Date of Birth
    address: { type: String }, // optional: address

    // Face embeddings
    embeddings: { type: [[Number]], required: true },
  },
  { timestamps: true }
);

const ClassOne = mongoose.models.ClassOne || mongoose.model("ClassOne", studentSchema);

export default ClassOne;
