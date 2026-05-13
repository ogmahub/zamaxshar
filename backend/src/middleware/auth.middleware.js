import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const protect = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      const token = req.cookies?.token;
      if (!token) return res.status(401).json({ error: "Avtorizatsiyadan o'tmagan" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ error: "Ruxsat berilmagan" });
      }
      next();
    } catch (error) {
      return res.status(401).json({ error: "Token noto'g'ri yoki muddati o'tgan" });
    }
  };
};

export const loadAdmin = async (req, res, next) => {
  if (!req.user || req.user.role !== "admin") return next();
  try {
    const admin = await Admin.findById(req.user.id).select("-passwordHash");
    if (admin) {
      req.user.isSuperAdmin = admin.isSuperAdmin;
      req.user.permissions = admin.permissions || [];
    }
    next();
  } catch (e) { next(); }
};

export const requireSuperAdmin = async (req, res, next) => {
  if (!req.user || req.user.role !== "admin") return res.status(403).json({ error: "Ruxsat yo'q" });
  try {
    const admin = await Admin.findById(req.user.id);
    if (!admin || !admin.isSuperAdmin) return res.status(403).json({ error: "Faqat Super Admin" });
    next();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const requirePermission = (perm) => async (req, res, next) => {
  if (!req.user || req.user.role !== "admin") return res.status(403).json({ error: "Ruxsat yo'q" });
  try {
    const admin = await Admin.findById(req.user.id);
    if (!admin) return res.status(403).json({ error: "Ruxsat yo'q" });
    if (admin.isSuperAdmin || (admin.permissions || []).includes(perm)) return next();
    res.status(403).json({ error: "Bu bo'limga ruxsat yo'q" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
