import Application from "../models/Application.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import { hashPassword } from "../utils/hashPassword.js";

const normalizeText = (value = "") => String(value || "").trim().toLowerCase().replace(/\s+/g, " ");

const subjectMatches = (teacherSubject, courseTitle) => {
  const subject = normalizeText(teacherSubject);
  const course = normalizeText(courseTitle);
  if (!subject || !course) return false;
  return subject === course || subject.includes(course) || course.includes(subject);
};

const makeUsername = async (firstName, lastName, phone) => {
  const base = `${firstName || "student"}${lastName || ""}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "") || "student";
  const suffix = (phone || "").replace(/\D/g, "").slice(-4) || String(Date.now()).slice(-4);
  let username = `${base}${suffix}`;
  let counter = 1;

  while (await Student.findOne({ username })) {
    username = `${base}${suffix}${counter}`;
    counter += 1;
  }

  return username;
};

export const createApplication = async (req, res) => {
  try {
    const { selectedSubjects } = req.body;
    if (!Array.isArray(selectedSubjects) || selectedSubjects.length < 3) {
      return res.status(400).json({ error: "Kamida 3 ta fan tanlang" });
    }
    if (selectedSubjects.length > 5) {
      return res.status(400).json({ error: "Ko'pi bilan 5 ta fan tanlash mumkin" });
    }
    const app = await Application.create(req.body);
    res.status(201).json(app);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const listApplications = async (req, res) => {
  try {
    const apps = await Application.find().populate("course").sort({ createdAt: -1 });
    res.json(apps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id).populate("course");
    if (!app) return res.status(404).json({ error: "Ariza topilmadi" });
    res.json(app);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateApplication = async (req, res) => {
  try {
    const app = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!app) return res.status(404).json({ error: "Ariza topilmadi" });
    res.json(app);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const app = await Application.findByIdAndDelete(req.params.id);
    if (!app) return res.status(404).json({ error: "Ariza topilmadi" });
    res.json({ message: "Ariza o'chirildi" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const convertToStudent = async (req, res) => {
  try {
    const { password, enrollments: enrollmentData = [] } = req.body;
    const app = await Application.findById(req.params.id).populate("course");
    if (!app) return res.status(404).json({ error: "Ariza topilmadi" });

    if (!enrollmentData.length) {
      return res.status(400).json({ error: "Kamida bitta enrollment kiritilishi kerak" });
    }

    const enrollments = await Promise.all(
      enrollmentData.map(async (en) => {
        let teacherName = "";
        if (en.teacher) {
          const t = await Teacher.findById(en.teacher).select("name");
          teacherName = t?.name || "";
        }
        return {
          subject: en.subject || "",
          teacher: en.teacher || null,
          teacherName,
          group: en.group || "",
          lessonStartTime: en.lessonStartTime || "",
          lessonEndTime: en.lessonEndTime || "",
          weekdays: Array.isArray(en.weekdays) ? en.weekdays : [],
          validFrom: en.validFrom || null,
          validUntil: en.validUntil || null,
          status: "active"
        };
      })
    );

    const finalPassword = password || app.passwordPlain || "12345";
    const passwordHash = await hashPassword(finalPassword);
    const username = app.username || await makeUsername(app.firstName, app.lastName, app.phone);

    const existing = await Student.findOne({ phone: app.phone });
    let student;

    if (existing) {
      existing.firstName = app.firstName;
      existing.lastName = app.lastName;
      existing.username = username;
      existing.passwordHash = passwordHash;
      existing.passwordPlain = finalPassword;
      if (app.selectedSubjects?.length) existing.selectedSubjects = app.selectedSubjects;
      existing.enrollments = enrollments;
      student = await existing.save();
    } else {
      student = await Student.create({
        firstName: app.firstName,
        lastName: app.lastName,
        username,
        phone: app.phone,
        passwordHash,
        passwordPlain: finalPassword,
        selectedSubjects: app.selectedSubjects || [],
        enrollments
      });
    }

    app.status = "converted_to_student";
    await app.save();

    res.status(201).json({ student, application: app });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
