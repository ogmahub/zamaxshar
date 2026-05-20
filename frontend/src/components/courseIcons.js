// Har bir fan uchun emoji + gradient rang
const ICONS = {
  "Ona tili":            { emoji: "📝", gradient: "linear-gradient(135deg, #fce7f3, #f9a8d4)" },
  "Adabiyot":            { emoji: "📖", gradient: "linear-gradient(135deg, #fef3c7, #fcd34d)" },
  "Matematika":          { emoji: "🔢", gradient: "linear-gradient(135deg, #dbeafe, #93c5fd)" },
  "Algebra":             { emoji: "➗", gradient: "linear-gradient(135deg, #e0e7ff, #a5b4fc)" },
  "Geometriya":          { emoji: "📐", gradient: "linear-gradient(135deg, #ccfbf1, #5eead4)" },
  "Fizika":              { emoji: "⚛️", gradient: "linear-gradient(135deg, #cffafe, #67e8f9)" },
  "Kimyo":               { emoji: "🧪", gradient: "linear-gradient(135deg, #d1fae5, #6ee7b7)" },
  "Biologiya":           { emoji: "🧬", gradient: "linear-gradient(135deg, #dcfce7, #86efac)" },
  "Tarix":               { emoji: "🏛️", gradient: "linear-gradient(135deg, #fef3c7, #f59e0b)" },
  "Geografiya":          { emoji: "🌍", gradient: "linear-gradient(135deg, #ccfbf1, #2dd4bf)" },
  "Ingliz tili":         { emoji: "🇬🇧", gradient: "linear-gradient(135deg, #dbeafe, #60a5fa)" },
  "Rus tili":            { emoji: "🇷🇺", gradient: "linear-gradient(135deg, #fee2e2, #fca5a5)" },
  "Informatika":         { emoji: "💻", gradient: "linear-gradient(135deg, #e0e7ff, #818cf8)" },
  "Astronomiya":         { emoji: "🔭", gradient: "linear-gradient(135deg, #ede9fe, #a78bfa)" },
  "Iqtisodiyot asoslari":{ emoji: "💰", gradient: "linear-gradient(135deg, #fef9c3, #facc15)" },
  "Huquq asoslari":      { emoji: "⚖️", gradient: "linear-gradient(135deg, #f1f5f9, #94a3b8)" },
};

const DEFAULT = { emoji: "📚", gradient: "linear-gradient(135deg, #e0f2fe, #7dd3fc)" };

export const getCourseIcon = (titleUz) => ICONS[titleUz] || DEFAULT;
