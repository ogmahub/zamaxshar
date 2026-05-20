import Admin, { PERMISSIONS } from "../models/Admin.js";
import { hashPassword } from "../utils/hashPassword.js";

const ADMIN_LIMIT = 20;

const sanitize = (a) => ({
  _id: a._id,
  username: a.username,
  isSuperAdmin: a.isSuperAdmin,
  permissions: a.permissions,
  createdAt: a.createdAt
});

export const listAdmins = async (req, res) => {
  try {
    const items = await Admin.find({}).select("-passwordHash").sort({ createdAt: -1 });
    res.json(items.map(sanitize));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const createAdmin = async (req, res) => {
  try {
    const { username, password, permissions = [] } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Login va parol kerak" });

    const count = await Admin.countDocuments({ isSuperAdmin: false });
    if (count >= ADMIN_LIMIT) return res.status(400).json({ error: `Cheklov: ${ADMIN_LIMIT} ta admin` });

    const exists = await Admin.findOne({ username });
    if (exists) return res.status(400).json({ error: "Bu login band" });

    const validPerms = permissions.filter((p) => PERMISSIONS.includes(p));
    const admin = await Admin.create({
      username,
      passwordHash: await hashPassword(password),
      isSuperAdmin: false,
      permissions: validPerms,
      createdBy: req.user.id
    });
    res.status(201).json(sanitize(admin));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const { username, password, permissions } = req.body;
    const admin = await Admin.findById(req.params.id);
    if (!admin || admin.isSuperAdmin) return res.status(404).json({ error: "Topilmadi" });

    if (username && username !== admin.username) {
      const exists = await Admin.findOne({ username });
      if (exists) return res.status(400).json({ error: "Bu login band" });
      admin.username = username;
    }
    if (password) admin.passwordHash = await hashPassword(password);
    if (Array.isArray(permissions)) admin.permissions = permissions.filter((p) => PERMISSIONS.includes(p));

    await admin.save();
    res.json(sanitize(admin));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin || admin.isSuperAdmin) return res.status(404).json({ error: "Topilmadi" });
    await admin.deleteOne();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
