import Teacher from "../models/Teacher.js";
import { hashPassword } from "../utils/hashPassword.js";

export const listTeachers = async (req, res) => {
  try {
    const isAdmin = req.user?.role === "admin";
    const projection = isAdmin ? "-passwordHash" : "-passwordHash -passwordPlain";
    const teachers = await Teacher.find().select(projection).sort({ createdAt: -1 });
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTeacher = async (req, res) => {
  try {
    const isAdmin = req.user?.role === "admin";
    const projection = isAdmin ? "-passwordHash" : "-passwordHash -passwordPlain";
    const teacher = await Teacher.findById(req.params.id).select(projection);
    if (!teacher) return res.status(404).json({ error: "Ustoz topilmadi" });
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createTeacher = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const data = { ...rest };
    if (data.username) data.username = data.username.trim();
    if (!data.username) delete data.username;
    if (password) {
      data.passwordHash = await hashPassword(password);
      data.passwordPlain = password;
    }
    const teacher = await Teacher.create(data);
    const out = teacher.toObject();
    delete out.passwordHash;
    res.status(201).json(out);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateTeacher = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const update = { ...rest };
    if (typeof update.username === "string") update.username = update.username.trim();
    if (password) {
      update.passwordHash = await hashPassword(password);
      update.passwordPlain = password;
    }
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, update, { new: true }).select("-passwordHash");
    if (!teacher) return res.status(404).json({ error: "Ustoz topilmadi" });
    res.json(teacher);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) return res.status(404).json({ error: "Ustoz topilmadi" });
    res.json({ message: "Ustoz o'chirildi" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const teacherMe = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.id).select("-passwordHash -passwordPlain");
    if (!teacher) return res.status(404).json({ error: "Topilmadi" });
    res.json(teacher);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
