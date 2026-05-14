import Student from "../models/Student.js";
import { hashPassword } from "../utils/hashPassword.js";

export const listStudents = async (req, res) => {
  try {
    const isAdmin = req.user?.role === "admin";
    const projection = isAdmin ? "-passwordHash" : "-passwordHash -passwordPlain";
    const students = await Student.find()
      .select(projection)
      .populate("course teacher")
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStudent = async (req, res) => {
  try {
    const isAdmin = req.user?.role === "admin";
    const projection = isAdmin ? "-passwordHash" : "-passwordHash -passwordPlain";
    const student = await Student.findById(req.params.id)
      .select(projection)
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
    const pwd = password || "12345";
    const passwordHash = await hashPassword(pwd);
    const student = await Student.create({ ...rest, passwordHash, passwordPlain: pwd });
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const update = { ...rest };
    if (password) {
      update.passwordHash = await hashPassword(password);
      update.passwordPlain = password;
    }

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
      .select("-passwordHash -passwordPlain")
      .populate("course teacher");
    if (!student) return res.status(404).json({ error: "Student topilmadi" });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
