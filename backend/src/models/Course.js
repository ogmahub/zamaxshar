import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    titleUz: { type: String, required: true, trim: true },
    titleRu: { type: String, default: "", trim: true },
    titleEn: { type: String, default: "", trim: true },
    descriptionUz: { type: String, default: "" },
    descriptionRu: { type: String, default: "" },
    descriptionEn: { type: String, default: "" },
    price: { type: Number, default: 0 },
    duration: { type: String, default: "" },
    format: { type: String, default: "offline" },
    image: { type: String, default: "" },
    modules: { type: [String], default: [] },
    results: { type: [String], default: [] },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
