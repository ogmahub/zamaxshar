import Admin from "../models/Admin.js";
import Student from "../models/Student.js";
import { comparePassword } from "../utils/hashPassword.js";
import { generateToken, setAuthCookie, clearAuthCookie } from "../utils/generateToken.js";

export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username va parol kerak" });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ error: "Login yoki parol noto'g'ri" });
    }

    const isMatch = await comparePassword(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Login yoki parol noto'g'ri" });
    }

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
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ error: "Telefon va parol kerak" });
    }

    const student = await Student.findOne({ phone }).populate("course teacher");
    if (!student) {
      return res.status(401).json({ error: "Telefon yoki parol noto'g'ri" });
    }

    const isMatch = await comparePassword(password, student.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Telefon yoki parol noto'g'ri" });
    }

    const token = generateToken({ id: student._id, role: "student", phone: student.phone });
    setAuthCookie(res, token);

    res.json({
      user: {
        id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        phone: student.phone,
        role: "student"
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
    if (!req.user) {
      return res.json({ user: null });
    }

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

    res.json({ user: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
