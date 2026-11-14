# SiGEMAS API Documentation

## Base URL
`http://localhost:4000/api`

## Authentication
Semua endpoint (kecuali `/auth/login`) memerlukan header:
`Authorization: Bearer <jwt_token>`

---

## 🔑 Auth
- `POST /auth/login`
  - Body: `{ email, password }`
  - Response: `{ token, user }`
- `GET /auth/me`
  - Response: `{ user }`

## 📊 Dashboards
- `GET /dashboard`
  - Response: `DashboardData` (dinamis sesuai peran)

## 📚 Books & Catalog
- Akses buku: buku dengan `audience: "teacher"` (Buku Panduan Guru) hanya dikembalikan untuk role `teacher` dan `admin`. Siswa/orang tua mendapat `403` pada detail, progres, dan flashcards buku tersebut.
- `GET /books`
  - Query: `q` (search), `subject` (filter)
  - Response: `Book[]`; SD/MI entries include `level`, `audience`, `coverUrl`, `fileUrl`, `bookType`, `publisher`, `curriculum`, `sourceId`, `slug`.
- `GET /books/:id`
  - Response: `Book` (termasuk detail bab)
- `POST /progress`
  - Body: `{ bookId, lastPage, percent }`
  - Response: `{ ok, progress }`
- `POST /catalog/sync`
  - Response: `{ sync, books }`; `sync.booksCount` mencerminkan jumlah katalog aktif.

## 🧠 Flashcards
- `GET /flashcards?bookId=`
  - Response: `Flashcard[]`
- `POST /flashcards/review`
  - Body: `{ cardId, rating: 'again'|'hard'|'good'|'easy' }`
  - Response: `{ ok, card }`

## 🎮 Gamification
- `GET /gamification`
  - Response: `{ xp, level, streak, badges, quests }`
- `POST /gamification/add-xp`
  - Body: `{ amount, reason? }`
  - Response: `{ ok, gamification }`
- `POST /gamification/claim-badge`
  - Body: `{ badgeId }`
  - Response: `{ ok, gamification }`

## 🏫 Class Management
- `GET /classes`
  - Response: `ClassRoom[]`
- `GET /classes/:id`
  - Response: `ClassDetail` (termasuk daftar siswa & jadwal)

## 🔴 Live Classrooms
- `GET /live-sessions`
  - Response: `LiveSession[]`
- `GET /live-sessions/:id`
  - Response: `LiveSession`
- `POST /live-sessions` (Teacher)
  - Body: `{ title, classId, bookId, chapterId, scheduledAt }`
- `PATCH /live-sessions/:id/end` (Teacher)
  - Action: Mengakhiri sesi dan memicu presensi otomatis.

### Socket.io events
- `live:join`, `chat:send`, `hand:raise`, `poll:start`, `poll:vote`, `poll:end`, `session:end`.
- `webrtc:offer`, `webrtc:answer`, `webrtc:ice`, `webrtc:stop`: relay sinyal WebRTC di dalam room live; guru menyiarkan kamera/layar ke siswa.
- Papan tulis bersifat lokal per pengguna; tidak ada event whiteboard yang disiarkan ke peserta lain.

## 📝 Quizzes
- `GET /quizzes`
  - Response: `QuizSummary[]`
- `GET /quizzes/:id`
  - Response: `QuizDetail`
- `POST /quizzes/submit`
  - Body: `{ quizId, answers: { questionId: answerIndex }[] }`
  - Response: `{ score, rank, correctCount, totalQuestions }`

## 📈 Grades & Attendance
- `GET /grades` (Student)
  - Response: `{ subjectGrades, performance, attendance }`
- `GET /gradebook` (Teacher)
  - Response: `GradebookData`
- `POST /grades/bulk` (Teacher)
  - Body: `{ updates: { scoreId: score }[] }`
- `GET /attendance` (Teacher)
  - Response: `AttendanceData`

## 🛠️ Teacher Tools
- `POST /modules` (Extractor)
  - Body: `{ bookId, chapters: Chapter[] }`
- `GET /lesson-plans`
  - Response: `LessonPlan[]`
- `POST /lesson-plans`
  - Body: `LessonPlan`
- `PATCH /lesson-plans/:id`
  - Body: `Partial<LessonPlan>`

## ⚙️ Administration
- `GET /users`
  - Response: `User[]`
- `POST /users`
  - Body: `Partial<User>`
- `PATCH /users/:id`
  - Body: `{ status: 'aktif'|'nonaktif' }`
- `GET /analytics`
  - Response: `AnalyticsData`
- `GET /logs`
  - Response: `ActivityLog[]`
