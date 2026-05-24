import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
  course:          { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  teacher:         { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  group:           { type: String, default: "", trim: true },
  lessonStartTime: { type: String, default: "", trim: true },
  lessonEndTime:   { type: String, default: "", trim: true },
  weekdays:        [{ type: String }],
  paymentStatus:   { type: String, enum: ["paid", "unpaid", "expired"], default: "unpaid" },
  validFrom:       { type: Date },
  validUntil:      { type: Date },
  format:          { type: String, default: "offline", trim: true },
  status:          { type: String, enum: ["active", "inactive"], default: "active" }
}, { _id: true });

const studentSchema = new mongoose.Schema(
  {
    firstName:    { type: String, required: true, trim: true },
    lastName:     { type: String, default: "", trim: true },
    username:     { type: String, required: true, unique: true, trim: true, lowercase: true },
    phone:        { type: String, default: "", trim: true },
    passwordHash: { type: String, required: true },
    passwordPlain:{ type: String, default: "" },
    course:       { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    teacher:      { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
    group:           { type: String, default: "", trim: true },
    lessonStartTime: { type: String, default: "", trim: true },
    lessonEndTime:   { type: String, default: "", trim: true },
    paymentStatus: { type: String, enum: ["paid", "unpaid", "expired"], default: "unpaid" },
    validFrom:    { type: Date },
    validUntil:   { type: Date },
    enrollments:  { type: [enrollmentSchema], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
