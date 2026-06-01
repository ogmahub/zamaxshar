import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true, trim: true },
    grades: { type: String, required: true, trim: true },
    lessonTime: { type: String, required: true, trim: true },
    seats: { type: Number, required: true, min: 1 },
    phone: { type: String, required: true, trim: true },
    telegram: { type: String, trim: true },
    image: { type: String, default: "" },
    description: { type: String, default: "" },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    teacherName: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

export default mongoose.model("Announcement", announcementSchema);
