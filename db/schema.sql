-- SiGEMAS Database Schema (PostgreSQL)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum Types
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'parent', 'admin');
CREATE TYPE user_status AS ENUM ('aktif', 'nonaktif');
CREATE TYPE session_status AS ENUM ('live', 'scheduled', 'ended');
CREATE TYPE attendance_status AS ENUM ('hadir', 'terlambat', 'sakit', 'izin', 'alfa');
CREATE TYPE book_status AS ENUM ('synced', 'pending');
CREATE TYPE rpp_status AS ENUM ('selesai', 'berlangsung', 'mendatang');

-- Table: Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    status user_status DEFAULT 'aktif',
    title VARCHAR(255),
    nisn VARCHAR(50),
    class_id UUID,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP WITH TIME ZONE
);

-- Table: ClassRooms
CREATE TABLE class_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    grade INTEGER NOT NULL,
    academic_year VARCHAR(50) NOT NULL,
    homeroom_id UUID REFERENCES users(id),
    room VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Class_Students (Many-to-Many)
CREATE TABLE class_students (
    class_id UUID REFERENCES class_rooms(id) ON DELETE CASCADE,
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (class_id, student_id)
);

-- Table: Books
CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    grade INTEGER NOT NULL,
    authors TEXT[],
    year INTEGER,
    isbn VARCHAR(50) UNIQUE,
    synopsis TEXT,
    pages INTEGER,
    level VARCHAR(20),
    audience VARCHAR(20) DEFAULT 'student',
    cover_from VARCHAR(7),
    cover_to VARCHAR(7),
    cover_url TEXT,
    file_url TEXT,
    book_type VARCHAR(100),
    publisher TEXT,
    curriculum VARCHAR(100),
    source_id VARCHAR(100),
    slug VARCHAR(500),
    status book_status DEFAULT 'synced',
    featured BOOLEAN DEFAULT false,
    license TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Chapters
CREATE TABLE chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID REFERENCES books(id) ON DELETE CASCADE,
    chapter_number INTEGER NOT NULL,
    title VARCHAR(500) NOT NULL,
    start_page INTEGER,
    end_page INTEGER,
    summary TEXT,
    objectives TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: LiveSessions
CREATE TABLE live_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    class_id UUID REFERENCES class_rooms(id),
    teacher_id UUID REFERENCES users(id),
    book_id UUID REFERENCES books(id),
    chapter_id UUID REFERENCES chapters(id),
    status session_status DEFAULT 'scheduled',
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_min INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Attendance
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES live_sessions(id) ON DELETE CASCADE,
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status attendance_status NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE,
    duration_min INTEGER,
    date DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (session_id, student_id)
);

-- Table: Quizzes
CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    class_id UUID REFERENCES class_rooms(id),
    teacher_id UUID REFERENCES users(id),
    book_id UUID REFERENCES books(id),
    chapter_id UUID REFERENCES chapters(id),
    duration_min INTEGER,
    difficulty VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Scores
CREATE TABLE scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    class_id UUID REFERENCES class_rooms(id),
    assessment_id VARCHAR(100) NOT NULL,
    score DECIMAL(5,2),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: LessonPlans (RPP)
CREATE TABLE lesson_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID REFERENCES users(id),
    class_id UUID REFERENCES class_rooms(id),
    week INTEGER,
    subject VARCHAR(100),
    topic VARCHAR(500),
    chapter_id UUID REFERENCES chapters(id),
    dates TEXT,
    status rpp_status DEFAULT 'mendatang',
    activities TEXT[],
    assessment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: ActivityLogs
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    action VARCHAR(255) NOT NULL,
    target TEXT,
    at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip VARCHAR(45)
);

-- Table: Flashcards
CREATE TABLE flashcards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID REFERENCES books(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES chapters(id) ON DELETE SET NULL,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'medium',
    review_count INTEGER DEFAULT 0,
    last_reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: User Gamification
CREATE TABLE user_gamification (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    streak INTEGER DEFAULT 0,
    badge_ids TEXT[] DEFAULT '{}',
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_books_subject ON books(subject);
CREATE INDEX idx_books_level ON books(level);
CREATE INDEX idx_flashcards_book ON flashcards(book_id);
CREATE INDEX idx_scores_student ON scores(student_id);
CREATE INDEX idx_attendance_session ON attendance(session_id);
CREATE INDEX idx_logs_at ON activity_logs(at);
