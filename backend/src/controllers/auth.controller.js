import Admin from "../models/Admin.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import { comparePassword } from "../utils/hashPassword.js";
import { generateToken, setAuthCookie, clearAuthCookie } from "../utils/generateToken.js";

export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Username va parol kerak" });

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ error: "Login yoki parol noto'g'ri" });

    const isMatch = await comparePassword(password, admin.passwordHash);
    if (!isMatch) return res.status(401).json({ error: "Login yoki parol noto'g'ri" });

    const token = generateToken({ id: admin._id, role: "admin", username: admin.username });
    setAuthCookie(res, token);

    res.json({
      user: {
        id: admin._id,
        username: admin.username,
        role: "admin",
        isSuperAdmin: !!admin.isSuperAdmin,
        permissions: admin.permissions || []
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const studentLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Login va parol kerak" });

    const student = await Student.findOne({ username: username.toLowerCase() }).populate("course teacher");
    if (!student) return res.status(401).json({ error: "Login yoki parol noto'g'ri" });

    const isMatch = await comparePassword(password, student.passwordHash);
    if (!isMatch) return res.status(401).json({ error: "Login yoki parol noto'g'ri" });

    const token = generateToken({ id: student._id, role: "student", username: student.username });
    setAuthCookie(res, token);

    res.json({
      user: {
        id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        username: student.username,
        phone: student.phone,
        role: "student"
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const teacherLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Login va parol kerak" });

    const trimmed = String(username).trim();
    const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const teacher = await Teacher.findOne({ username: { $regex: `^${escaped}$`, $options: "i" } });
    if (!teacher || !teacher.passwordHash) return res.status(401).json({ error: "Login yoki parol noto'g'ri" });

    const isMatch = await comparePassword(password, teacher.passwordHash);
    if (!isMatch) return res.status(401).json({ error: "Login yoki parol noto'g'ri" });

    const token = generateToken({ id: teacher._id, role: "teacher", username: teacher.username });
    setAuthCookie(res, token);

    res.json({
      user: {
        id: teacher._id,
        name: teacher.name,
        username: teacher.username,
        subject: teacher.subject,
        photo: teacher.photo,
        role: "teacher"
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const logout = (req, res) => {
  clearAuthCookie(res);
  res.json({ message: "Chiqildi" });
};

export const getSession = async (req, res) => {
  try {
    if (!req.user) return res.json({ user: null });

    if (req.user.role === "admin") {
      const admin = await Admin.findById(req.user.id).select("-passwordHash");
      return res.json({ user: { ...admin.toObject(), role: "admin" } });
    }
    if (req.user.role === "student") {
      const student = await Student.findById(req.user.id)
        .select("-passwordHash")
        .populate("course teacher");
      return res.json({ user: { ...student.toObject(), role: "student" } });
    }
    if (req.user.role === "teacher") {
      const teacher = await Teacher.findById(req.user.id).select("-passwordHash");
      return res.json({ user: { ...teacher.toObject(), role: "teacher" } });
    }
    res.json({ user: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
