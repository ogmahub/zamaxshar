import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true, index: true },
    name: { type: String, required: true, trim: true },
    lessonStartTime: { type: String, required: true, trim: true },
    lessonEndTime: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

export default mongoose.model("Group", groupSchema);
