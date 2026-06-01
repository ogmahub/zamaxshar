import Announcement from "../models/Announcement.js";

export const createAnnouncement = async (req, res) => {
  try {
    const { subject, grades, lessonTime, seats, phone, telegram, image, description } = req.body;
    if (!subject || !grades || !lessonTime || !seats || !phone) {
      return res.status(400).json({ error: "Majburiy maydonlarni to'ldiring" });
    }

    const announcement = await Announcement.create({
      subject,
      grades,
      lessonTime,
      seats: Number(seats),
      phone,
      telegram: telegram || "",
      image: image || "",
      description: description || "",
      teacherId: req.user.id,
      teacherName: req.user.name || ""
    });

    res.status(201).json(announcement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("teacherId", "name subject photo")
      .sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ teacherId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ error: "E'lon topilmadi" });

    if (announcement.teacherId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Faqat o'z e'lonlarini o'chira olasiz" });
    }

    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: "E'lon o'chirildi" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
