import Course from "../models/Course.js";

const hiddenCourseTitles = new Set([
  "arab tili",
  "chizmachilik",
  "tasviriy san'at",
  "musiqa",
  "jismoniy tarbiya",
  "texnologiya"
]);

const normalizeText = (value = "") => String(value || "").trim().toLowerCase();

export const listCourses = async (req, res) => {
  try {
    const filter = { isActive: true };
    const courses = await Course.find(filter).sort({ createdAt: -1 });
    res.json(courses.filter((course) => !hiddenCourseTitles.has(normalizeText(course.titleUz))));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, isActive: true });
    if (!course) return res.status(404).json({ error: "Kurs topilmadi" });
    if (hiddenCourseTitles.has(normalizeText(course.titleUz))) {
      return res.status(404).json({ error: "Kurs topilmadi" });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) return res.status(404).json({ error: "Kurs topilmadi" });
    res.json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ error: "Kurs topilmadi" });
    res.json({ message: "Kurs o'chirildi" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
