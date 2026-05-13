# ZAMAXSHAR — O'quv Markaz Platformasi

Zamonaviy MERN stack asosida qurilgan o'quv markaz boshqaruv platformasi.

## Texnologiyalar

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT + httpOnly cookies
- bcryptjs

**Frontend:**
- React 18 + Vite
- React Router v6
- Tailwind CSS
- i18next (UZ / RU / EN)
- Framer Motion
- Axios
- React Hot Toast

## Loyiha tuzilishi

```
ZAMAXSHAR/
├── backend/        # Express API
│   └── src/
│       ├── config/
│       ├── models/
│       ├── controllers/
│       ├── routes/
│       ├── middleware/
│       ├── utils/
│       └── server.js
└── frontend/       # React SPA
    └── src/
        ├── api/
        ├── components/
        ├── context/
        ├── pages/
        ├── admin/
        ├── student/
        └── i18n/
```

## Ishga tushirish

### 1. MongoDB tayyorlash

**Variant A — MongoDB Atlas (cloud, tavsiya etamiz):**
1. https://cloud.mongodb.com sahifaga kiring va ro'yxatdan o'ting
2. Bepul cluster yarating
3. Database User yarating (username + password)
4. Network Access → Add IP → "Allow Access from Anywhere" (0.0.0.0/0)
5. Connect → Drivers → connection string nusxalang. Masalan:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/zamaxshar
   ```

**Variant B — Local MongoDB:**
- https://www.mongodb.com/try/download/community dan o'rnating
- Default: `mongodb://127.0.0.1:27017/zamaxshar`

### 2. Backend

```bash
cd backend
npm install
```

`.env` faylida `MONGO_URI` ni o'zgartiring:

```env
MONGO_URI=mongodb+srv://...   # yoki mongodb://127.0.0.1:27017/zamaxshar
```

Seed (demo ma'lumotlar):

```bash
npm run seed
```

Bu admin, kurslar, ustozlar va demo student yaratadi:
- **Admin:** `admin` / `admin123`
- **Student:** `+998901111111` / `12345`

Serverni ishga tushirish:

```bash
npm run dev
```

Backend: http://localhost:5000

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

`/api/*` so'rovlari avtomatik backend'ga proxy qilinadi (vite.config.js).

## Asosiy URL'lar

| Sahifa            | URL                       |
|-------------------|---------------------------|
| Bosh sahifa       | `/`                       |
| Kurslar           | `/courses`                |
| Kurs tafsilotlari | `/courses/:id`            |
| Ustozlar          | `/teachers`               |
| Ro'yxatdan o'tish | `/register`               |
| Aloqa             | `/contact`                |
| Admin login       | `/admin/login`            |
| Admin dashboard   | `/admin/dashboard`        |
| Admin arizalar    | `/admin/applications`     |
| Admin talabalar   | `/admin/students`         |
| Admin kurslar     | `/admin/courses`          |
| Admin ustozlar    | `/admin/teachers`         |
| Student login     | `/student/login`          |
| Student kabinet   | `/student/dashboard`      |

## API endpoints

### Auth
- `POST /api/auth/admin/login`
- `POST /api/auth/student/login`
- `POST /api/auth/logout`
- `GET  /api/auth/session`

### Applications
- `POST   /api/applications`           (public)
- `GET    /api/applications`           (admin)
- `GET    /api/applications/:id`       (admin)
- `PUT    /api/applications/:id`       (admin)
- `DELETE /api/applications/:id`       (admin)
- `POST   /api/applications/:id/convert` (admin)

### Students
- `GET    /api/students/me`            (student)
- `GET    /api/students`               (admin)
- `POST   /api/students`               (admin)
- `GET    /api/students/:id`           (admin)
- `PUT    /api/students/:id`           (admin)
- `DELETE /api/students/:id`           (admin)

### Courses / Teachers
- `GET    /api/courses`                (public)
- `GET    /api/courses/:id`            (public)
- `POST   /api/courses`                (admin)
- `PUT    /api/courses/:id`            (admin)
- `DELETE /api/courses/:id`            (admin)

(`/api/teachers` ham xuddi shunday)

## Xususiyatlari

- 3 tilli interfeys (UZ / RU / EN)
- Dark / Light mode
- Responsive dizayn (mobile / tablet / desktop)
- Premium UI: gradientlar, animatsiyalar, glassmorphism
- Admin dashboard statistikalar
- Ariza → student konvertatsiyasi
- JWT + httpOnly cookie xavfsizlik
- Bcrypt parol himoyasi
- Role-based access (admin / student)
- File upload (rasm, sertifikat — base64)

## Production build

```bash
cd frontend
npm run build
# build chiqishi: frontend/dist/

cd ../backend
NODE_ENV=production npm start
```

Production'da frontend `dist`'ni statik server (nginx, Vercel, Netlify) orqali xizmat qilish tavsiya etiladi.

## Litsenziya

MIT
