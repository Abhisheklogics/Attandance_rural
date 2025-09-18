import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    roll: { type: String, required: true },
    class: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);


const Attendance = mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);

export default Attendance;
