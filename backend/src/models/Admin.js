import mongoose from "mongoose";

export const PERMISSIONS = ["applications", "students", "teachers", "admins"];

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "admin" },
    isSuperAdmin: { type: Boolean, default: false },
    permissions: { type: [String], default: [], enum: PERMISSIONS },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);
