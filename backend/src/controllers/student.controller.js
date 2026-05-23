import Student from "../models/Student.js";
import Group from "../models/Group.js";
import { hashPassword } from "../utils/hashPassword.js";

const sanitizeSchedule = (input = {}) => ({
  ...(Object.prototype.hasOwnProperty.call(input, "group") ? { group: input.group ?? "" } : {}),
  ...(Object.prototype.hasOwnProperty.call(input, "lessonStartTime") ? { lessonStartTime: input.lessonStartTime ?? "" } : {}),
  ...(Object.prototype.hasOwnProperty.call(input, "lessonEndTime") ? { lessonEndTime: input.lessonEndTime ?? "" } : {})
});

export const listStudents = async (req, res) => {
  try {
    const isAdmin = req.user?.role === "admin";
    const isTeacher = req.user?.role === "teacher";
    const projection = isAdmin ? "-passwordHash" : "-passwordHash -passwordPlain";
    const filter = isAdmin
      ? {}
      : isTeacher
        ? { $or: [{ teacher: req.user?.id }, { "enrollments.teacher": req.user?.id }] }
        : {};
    const students = await Student.find(filter)
      .select(projection)
      .populate("course teacher")
      .populate("enrollments.course enrollments.teacher")
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStudent = async (req, res) => {
  try {
    const isAdmin = req.user?.role === "admin";
    const isTeacher = req.user?.role === "teacher";
    const projection = isAdmin ? "-passwordHash" : "-passwordHash -passwordPlain";
    const filter = isAdmin
      ? { _id: req.params.id }
      : isTeacher
        ? { _id: req.params.id, $or: [{ teacher: req.user?.id }, { "enrollments.teacher": req.user?.id }] }
        : { _id: req.params.id };
    const student = await Student.findOne(filter)
      .select(projection)
      .populate("course teacher")
      .populate("enrollments.course enrollments.teacher");
    if (!student) return res.status(404).json({ error: "Student topilmadi" });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createStudent = async (req, res) => {
  try {
    const { password, enrollments, ...rest } = req.body;
    const pwd = password || "12345";
    const passwordHash = await hashPassword(pwd);
    const student = await Student.create({
      ...rest,
      ...sanitizeSchedule(rest),
      passwordHash,
      passwordPlain: pwd,
      enrollments: Array.isArray(enrollments) ? enrollments : []
    });
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { password, enrollments, ...rest } = req.body;
    const update = { ...rest, ...sanitizeSchedule(rest) };
    if (password) {
      update.passwordHash = await hashPassword(password);
      update.passwordPlain = password;
    }
    if (Array.isArray(enrollments)) update.enrollments = enrollments;

    const student = await Student.findByIdAndUpdate(req.params.id, update, { new: true })
      .select("-passwordHash")
      .populate("course teacher")
      .populate("enrollments.course enrollments.teacher");
    if (!student) return res.status(404).json({ error: "Student topilmadi" });
    res.json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateTeacherStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: "Student topilmadi" });

    if (String(student.teacher || "") !== String(req.user?.id || "")) {
      return res.status(403).json({ error: "Faqat o'zingizga biriktirilgan studentni tahrirlashingiz mumkin" });
    }

    const { group = "", lessonStartTime = "", lessonEndTime = "" } = req.body;
    student.group = group;
    student.lessonStartTime = lessonStartTime;
    student.lessonEndTime = lessonEndTime;

    await student.save();

    const updated = await Student.findById(student._id)
      .select("-passwordHash -passwordPlain")
      .populate("course teacher");

    res.json(updated);
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
      .populate("course teacher")
      .populate("enrollments.course enrollments.teacher");
    if (!student) return res.status(404).json({ error: "Student topilmadi" });

    const result = student.toObject();

    if (student.group && student.teacher) {
      const grp = await Group.findOne({ name: student.group, teacher: student.teacher._id || student.teacher });
      if (grp) {
        result.groupWeekdays = grp.weekdays || [];
        result.groupStartTime = grp.lessonStartTime || "";
        result.groupEndTime = grp.lessonEndTime || "";
      }
    }

    if (Array.isArray(result.enrollments) && result.enrollments.length > 0) {
      result.enrollments = await Promise.all(
        result.enrollments.map(async (en) => {
          if (en.group && en.teacher) {
            const teacherId = en.teacher._id || en.teacher;
            const grp = await Group.findOne({ name: en.group, teacher: teacherId });
            if (grp) {
              return {
                ...en,
                weekdays: grp.weekdays?.length ? grp.weekdays : (en.weekdays || []),
                lessonStartTime: grp.lessonStartTime || en.lessonStartTime,
                lessonEndTime: grp.lessonEndTime || en.lessonEndTime
              };
            }
          }
          return en;
        })
      );
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
