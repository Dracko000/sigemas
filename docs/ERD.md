# ERD SiGEMAS (Entity Relationship Diagram)

## Entities & Relationships

### 1. User (Pengguna)
- `id` (PK): UUID
- `name`: String
- `email`: String (Unique)
- `password`: String (Hashed)
- `role`: Enum ('student', 'teacher', 'parent', 'admin')
- `status`: Enum ('aktif', 'nonaktif')
- `classId` (FK): Reference to ClassRoom (Nullable)
- `childIds`: Array of User IDs (For Parents)
- `joinedAt`: Timestamp

### 2. ClassRoom (Rombel/Kelas)
- `id` (PK): UUID
- `name`: String (e.g., 'X-IPS-1')
- `grade`: Integer (1-12)
- `academicYear`: String (e.g., '2024/2025')
- `homeroomId` (FK): Reference to User (Teacher)
- `room`: String
- `studentIds`: Array of User IDs

### 3. Book (Buku SIBI)
- `id` (PK): UUID
- `title`: String
- `subject`: String
- `grade`: Integer
- `level`: Enum ('SD/MI', 'SMA/MA')
- `audience`: Enum ('student', 'teacher') — `teacher` = Buku Panduan Guru
- `authors`: String[]
- `isbn`: String (Unique)
- `synopsis`: Text
- `pages`: Integer
- `status`: Enum ('synced', 'pending')
- `coverUrl`: Text (Nullable, sampul resmi)
- `fileUrl`: Text (Nullable, PDF resmi)
- `bookType`: String (e.g. 'Buku Siswa')
- `publisher`: String
- `curriculum`: String
- `sourceId`: String (ID katalog SIBI)
- `slug`: String

### 4. Chapter (Bab Buku)
- `id` (PK): UUID
- `bookId` (FK): Reference to Book
- `number`: Integer
- `title`: String
- `startPage`: Integer
- `endPage`: Integer
- `summary`: Text

### 5. LiveSession (Sesi Kelas Live)
- `id` (PK): UUID
- `title`: String
- `classId` (FK): Reference to ClassRoom
- `teacherId` (FK): Reference to User (Teacher)
- `bookId` (FK): Reference to Book
- `chapterId` (FK): Reference to Chapter
- `status`: Enum ('live', 'scheduled', 'ended')
- `startedAt`: Timestamp (Nullable)
- `endedAt`: Timestamp (Nullable)
- `scheduledAt`: Timestamp

### 6. Attendance (Presensi)
- `id` (PK): UUID
- `sessionId` (FK): Reference to LiveSession
- `studentId` (FK): Reference to User (Student)
- `status`: Enum ('hadir', 'terlambat', 'sakit', 'izin', 'alfa')
- `joinedAt`: Timestamp
- `durationMin`: Integer

### 7. Quiz (Kuis)
- `id` (PK): UUID
- `title`: String
- `classId` (FK): Reference to ClassRoom
- `teacherId` (FK): Reference to User (Teacher)
- `durationMin`: Integer
- `difficulty`: Enum ('easy', 'medium', 'hard')

### 8. Score (Nilai)
- `id` (PK): UUID
- `studentId` (FK): Reference to User (Student)
- `classId` (FK): Reference to ClassRoom
- `assessmentId`: String (Ref to Assessment)
- `score`: Decimal
- `updatedAt`: Timestamp

### 9. LessonPlan (RPP)
- `id` (PK): UUID
- `teacherId` (FK): Reference to User (Teacher)
- `classId` (FK): Reference to ClassRoom
- `week`: Integer
- `topic`: String
- `status`: Enum ('selesai', 'berlangsung', 'mendatang')

### 10. Flashcard
- `id` (PK): UUID
- `bookId` (FK): Reference to Book
- `chapterId` (FK): Reference to Chapter (Nullable)
- `front`: Text
- `back`: Text
- `difficulty`: Enum ('easy', 'medium', 'hard')
- `reviewCount`: Integer
- `lastReviewedAt`: Timestamp (Nullable)

### 11. Gamification
- `userId` (PK/FK): Reference to User
- `xp`: Integer
- `level`: Integer
- `streak`: Integer
- `badgeIds`: String[]
- `lastActiveAt`: Timestamp
