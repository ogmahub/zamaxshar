import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, trim: true, sparse: true, unique: true },
    passwordHash: { type: String, default: "" },
    passwordPlain: { type: String, default: "" },
    phone: { type: String, default: "", trim: true },
    subject: { type: String, default: "", trim: true },
    bio: { type: String, default: "" },
    photo: { type: String, default: "" },
    certificate: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Teacher", teacherSchema);
