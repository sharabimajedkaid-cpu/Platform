-- Britishce44 PostgreSQL Schema
-- Enterprise Educational Platform

-- Users & Authentication
CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'supervisor', 'teacher', 'student', 'parent')),
    phone VARCHAR(50),
    address TEXT,
    grade INTEGER,
    classroom_id INTEGER,
    avatar_url TEXT,
    mfa_secret VARCHAR(255),
    mfa_enabled BOOLEAN DEFAULT FALSE,
    refresh_token TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_classroom ON users(classroom_id);

-- Classrooms
CREATE TABLE classrooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    link TEXT,
    teacher_id VARCHAR(64) REFERENCES users(id),
    grade VARCHAR(50),
    max_participants INTEGER DEFAULT 100,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('active', 'available', 'upcoming', 'archived')),
    is_recording BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_classrooms_status ON classrooms(status);
CREATE INDEX idx_classrooms_teacher ON classrooms(teacher_id);

-- Courses
CREATE TABLE courses (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    teacher_id VARCHAR(64) REFERENCES users(id),
    grade VARCHAR(50),
    max_students INTEGER DEFAULT 50,
    enrolled_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lessons
CREATE TABLE lessons (
    id VARCHAR(64) PRIMARY KEY,
    course_id VARCHAR(64) REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    objectives JSONB,
    duration INTEGER,
    lesson_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exams
CREATE TABLE exams (
    id VARCHAR(64) PRIMARY KEY,
    model VARCHAR(2) NOT NULL,
    exam_number INTEGER NOT NULL,
    exam_type VARCHAR(50) NOT NULL,
    max_score INTEGER NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    questions INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exam Results
CREATE TABLE exam_results (
    id VARCHAR(64) PRIMARY KEY,
    exam_id VARCHAR(64) REFERENCES exams(id),
    student_id VARCHAR(64) REFERENCES users(id),
    score INTEGER NOT NULL,
    max_score INTEGER NOT NULL,
    passed BOOLEAN DEFAULT FALSE,
    answers JSONB,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Homework Submissions
CREATE TABLE homework (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) REFERENCES users(id),
    file_name VARCHAR(255) NOT NULL,
    file_size VARCHAR(20),
    file_url TEXT,
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded', 'returned')),
    grade INTEGER,
    feedback TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages / CE4 Messenger
CREATE TABLE conversations (
    id VARCHAR(64) PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE conversation_participants (
    conversation_id VARCHAR(64) REFERENCES conversations(id) ON DELETE CASCADE,
    user_id VARCHAR(64) REFERENCES users(id),
    unread_count INTEGER DEFAULT 0,
    PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE messages (
    id VARCHAR(64) PRIMARY KEY,
    conversation_id VARCHAR(64) REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id VARCHAR(64) REFERENCES users(id),
    text TEXT,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'voice', 'image', 'file', 'video')),
    media_url TEXT,
    read_by JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at DESC);

-- Notifications
CREATE TABLE notifications (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    body TEXT,
    notification_type VARCHAR(50) DEFAULT 'system',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);

-- Video Archive
CREATE TABLE video_archive (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id),
    file_name VARCHAR(255) NOT NULL,
    file_size VARCHAR(20),
    file_url TEXT,
    duration INTEGER,
    recording_id VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recording Sessions
CREATE TABLE recording_sessions (
    id VARCHAR(64) PRIMARY KEY,
    classroom_id INTEGER REFERENCES classrooms(id),
    started_by VARCHAR(64) REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'recording' CHECK (status IN ('recording', 'paused', 'completed', 'processing', 'failed')),
    file_url TEXT,
    transcript_url TEXT,
    participants JSONB DEFAULT '[]',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE
);

-- Subscriptions
CREATE TABLE subscriptions (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id),
    tier VARCHAR(20) NOT NULL CHECK (tier IN ('lite', 'pro', 'enterprise')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    auto_renew BOOLEAN DEFAULT TRUE,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices (ERP)
CREATE TABLE invoices (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id),
    student_name VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
    payment_method VARCHAR(50),
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employees (HR)
CREATE TABLE employees (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    position VARCHAR(100),
    department VARCHAR(100),
    salary DECIMAL(10,2),
    hire_date DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'on_leave', 'terminated'))
);

-- Payroll
CREATE TABLE payroll (
    id VARCHAR(64) PRIMARY KEY,
    employee_id VARCHAR(64) REFERENCES employees(id),
    base_salary DECIMAL(10,2),
    deductions DECIMAL(10,2),
    net_pay DECIMAL(10,2),
    period VARCHAR(20),
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admissions
CREATE TABLE applications (
    id VARCHAR(64) PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    parent_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    grade VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    notes TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Whiteboard State
CREATE TABLE whiteboard_state (
    id VARCHAR(64) PRIMARY KEY,
    classroom_id INTEGER REFERENCES classrooms(id) ON DELETE CASCADE,
    elements JSONB DEFAULT '[]',
    background_color VARCHAR(20) DEFAULT '#ffffff',
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    modified_by VARCHAR(64) REFERENCES users(id)
);

-- Teacher Evaluations
CREATE TABLE teacher_evaluations (
    id VARCHAR(64) PRIMARY KEY,
    teacher_id VARCHAR(64) REFERENCES users(id),
    evaluator_id VARCHAR(64) REFERENCES users(id),
    criteria_scores JSONB,
    total_score INTEGER,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily Performance
CREATE TABLE daily_performance (
    id VARCHAR(64) PRIMARY KEY,
    teacher_id VARCHAR(64) REFERENCES users(id),
    criteria_scores JSONB,
    total_score INTEGER,
    date DATE DEFAULT CURRENT_DATE
);

-- WebRTC Room State
CREATE TABLE webrtc_rooms (
    room_id INTEGER PRIMARY KEY,
    participant_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Log
CREATE TABLE audit_log (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id VARCHAR(64),
    metadata JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_log_user ON audit_log(user_id, created_at DESC);
CREATE INDEX idx_audit_log_action ON audit_log(action, created_at DESC);

-- Analytics Events
CREATE TABLE analytics_events (
    id BIGSERIAL PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    user_id VARCHAR(64),
    metadata JSONB,
    session_id VARCHAR(64),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_analytics_type ON analytics_events(event_type, timestamp DESC);

-- Placement Test Results
CREATE TABLE placement_results (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) REFERENCES users(id),
    score INTEGER NOT NULL,
    max_score INTEGER DEFAULT 76,
    cefr_level VARCHAR(2),
    fluency INTEGER,
    accuracy INTEGER,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
