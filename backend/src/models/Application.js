import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, default: "", trim: true },
    phone: { type: String, required: true, trim: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    studyMode: { type: String, enum: ["online", "offline"], default: "offline" },
    startDate: { type: Date },
    validUntil: { type: Date },
    message: { type: String, default: "" },
    status: {
      type: String,
      enum: ["new", "accepted", "rejected", "converted_to_student"],
      default: "new"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);
