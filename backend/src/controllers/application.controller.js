import Application from "../models/Application.js";
import Student from "../models/Student.js";
import { hashPassword } from "../utils/hashPassword.js";

export const createApplication = async (req, res) => {
  try {
    const app = await Application.create(req.body);
    res.status(201).json(app);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const listApplications = async (req, res) => {
  try {
    const apps = await Application.find().populate("course").sort({ createdAt: -1 });
    res.json(apps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id).populate("course");
    if (!app) return res.status(404).json({ error: "Ariza topilmadi" });
    res.json(app);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateApplication = async (req, res) => {
  try {
    const app = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!app) return res.status(404).json({ error: "Ariza topilmadi" });
    res.json(app);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const app = await Application.findByIdAndDelete(req.params.id);
    if (!app) return res.status(404).json({ error: "Ariza topilmadi" });
    res.json({ message: "Ariza o'chirildi" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const convertToStudent = async (req, res) => {
  try {
    const { password, teacher, validFrom, validUntil } = req.body;
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ error: "Ariza topilmadi" });

    const existing = await Student.findOne({ phone: app.phone });
    if (existing) return res.status(400).json({ error: "Bu telefon bilan student mavjud" });

    const passwordHash = await hashPassword(password || "12345");

    const student = await Student.create({
      firstName: app.firstName,
      lastName: app.lastName,
      phone: app.phone,
      passwordHash,
      course: app.course,
      teacher,
      validFrom,
      validUntil
    });

    app.status = "converted_to_student";
    await app.save();

    res.status(201).json({ student, application: app });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
