import Student from "../models/Student.js";
import { hashPassword } from "../utils/hashPassword.js";

export const listStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .select("-passwordHash")
      .populate("course teacher")
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .select("-passwordHash")
      .populate("course teacher");
    if (!student) return res.status(404).json({ error: "Student topilmadi" });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createStudent = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const passwordHash = await hashPassword(password || "12345");
    const student = await Student.create({ ...rest, passwordHash });
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const update = { ...rest };
    if (password) update.passwordHash = await hashPassword(password);

    const student = await Student.findByIdAndUpdate(req.params.id, update, { new: true })
      .select("-passwordHash")
      .populate("course teacher");
    if (!student) return res.status(404).json({ error: "Student topilmadi" });
    res.json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ error: "Student topilmadi" });
    res.json({ message: "Student o'chirildi" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const myProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id)
      .select("-passwordHash")
      .populate("course teacher");
    if (!student) return res.status(404).json({ error: "Student topilmadi" });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
