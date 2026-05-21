import Group from "../models/Group.js";

const normalizeName = (value = "") => value.trim();

const validateTimeRange = (start, end) => {
  if (!/^\d{2}:\d{2}$/.test(start) || !/^\d{2}:\d{2}$/.test(end)) {
    return "Boshlanish va tugash vaqti HH:MM formatida bo'lishi kerak";
  }
  if (start >= end) {
    return "Boshlanish vaqti tugash vaqtidan oldin bo'lishi kerak";
  }
  return "";
};

const groupPayload = (req) => ({
  teacher: req.user?.id,
  name: normalizeName(req.body?.name),
  lessonStartTime: (req.body?.lessonStartTime || "").trim(),
  lessonEndTime: (req.body?.lessonEndTime || "").trim()
});

export const listGroups = async (req, res) => {
  try {
    const groups = await Group.find({ teacher: req.user?.id }).sort({ createdAt: -1 });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createGroup = async (req, res) => {
  try {
    const payload = groupPayload(req);
    if (!payload.name) return res.status(400).json({ error: "Guruh nomi kiritilsin" });
    if (!payload.lessonStartTime || !payload.lessonEndTime) {
      return res.status(400).json({ error: "Boshlanish va tugash vaqtini kiriting" });
    }

    const rangeError = validateTimeRange(payload.lessonStartTime, payload.lessonEndTime);
    if (rangeError) return res.status(400).json({ error: rangeError });

    const group = await Group.create(payload);
    res.status(201).json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateGroup = async (req, res) => {
  try {
    const group = await Group.findOne({ _id: req.params.id, teacher: req.user?.id });
    if (!group) return res.status(404).json({ error: "Guruh topilmadi" });

    const name = normalizeName(req.body?.name ?? group.name);
    const lessonStartTime = (req.body?.lessonStartTime ?? group.lessonStartTime).trim();
    const lessonEndTime = (req.body?.lessonEndTime ?? group.lessonEndTime).trim();

    if (!name) return res.status(400).json({ error: "Guruh nomi kiritilsin" });
    const rangeError = validateTimeRange(lessonStartTime, lessonEndTime);
    if (rangeError) return res.status(400).json({ error: rangeError });

    group.name = name;
    group.lessonStartTime = lessonStartTime;
    group.lessonEndTime = lessonEndTime;
    await group.save();

    res.json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findOneAndDelete({ _id: req.params.id, teacher: req.user?.id });
    if (!group) return res.status(404).json({ error: "Guruh topilmadi" });
    res.json({ message: "Guruh o'chirildi" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
