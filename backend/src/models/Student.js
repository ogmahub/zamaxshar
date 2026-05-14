import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, default: "", trim: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    phone: { type: String, default: "", trim: true },
    passwordHash: { type: String, required: true },
    passwordPlain: { type: String, default: "" },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid", "expired"],
      default: "unpaid"
    },
    validFrom: { type: Date },
    validUntil: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
