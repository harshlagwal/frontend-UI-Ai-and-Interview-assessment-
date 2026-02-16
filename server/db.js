require('dotenv').config();
const { Pool } = require('pg');

const dbPassword = process.env.DB_PASSWORD || "";
const targetDb = process.env.DB_NAME || 'interview_db';
console.log('Database connecting to:', targetDb, 'as user:', process.env.DB_USER, '(Password set:', !!dbPassword, ')');

// Function to ensure database exists
const ensureDatabaseExists = async () => {
    const tempPool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'postgres',
        password: String(dbPassword),
        database: 'postgres', // Connect to default postgres db
        port: parseInt(process.env.DB_PORT || '5432'),
    });

    try {
        const res = await tempPool.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [targetDb]);
        if (res.rowCount === 0) {
            console.log(`Database "${targetDb}" not found. Creating...`);
            await tempPool.query(`CREATE DATABASE "${targetDb}"`);
            console.log(`Database "${targetDb}" created successfully.`);
        }
    } catch (err) {
        console.error('Error checking/creating database:', err.message);
    } finally {
        await tempPool.end();
    }
};

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: String(dbPassword),
    database: targetDb,
    port: parseInt(process.env.DB_PORT || '5432'),
});

const initDb = async () => {
    await ensureDatabaseExists();
    const tables = [
        `CREATE TABLE IF NOT EXISTS public.users (
        id SERIAL PRIMARY KEY,
        username VARCHAR NOT NULL,
        email VARCHAR UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name VARCHAR NOT NULL,
        created_at TIMESTAMPTZ DEFAULT now()
    );`,
        `CREATE TABLE IF NOT EXISTS public.interview_sessions (
        id SERIAL PRIMARY KEY,
        user_id integer NOT NULL REFERENCES public.users(id),
        start_time timestamp with time zone DEFAULT now() NOT NULL,
        end_time timestamp with time zone,
        total_risk_score numeric(5,2) DEFAULT 0.00,
        status character varying DEFAULT 'IN_PROGRESS'::character varying
    );`,
        `CREATE TABLE IF NOT EXISTS public.face_pose_events (
        id SERIAL PRIMARY KEY,
        session_id integer NOT NULL REFERENCES public.interview_sessions(id),
        "timestamp" timestamp with time zone DEFAULT now(),
        event_type character varying NOT NULL,
        duration_ms integer DEFAULT 0,
        severity_score integer DEFAULT 1
    );`,
        `CREATE TABLE IF NOT EXISTS public.object_detection_events (
        id SERIAL PRIMARY KEY,
        session_id integer NOT NULL REFERENCES public.interview_sessions(id),
        "timestamp" timestamp with time zone DEFAULT now(),
        object_detected character varying NOT NULL,
        confidence_score numeric(5,2) NOT NULL,
        snapshot_url text
    );`,
        `CREATE TABLE IF NOT EXISTS public.audio_transcripts (
        id SERIAL PRIMARY KEY,
        session_id integer NOT NULL REFERENCES public.interview_sessions(id),
        start_timestamp timestamp with time zone,
        end_timestamp timestamp with time zone,
        text_content text NOT NULL,
        is_multiple_speakers boolean DEFAULT false
    );`,
        `CREATE TABLE IF NOT EXISTS public.answer_evaluations (
        id SERIAL PRIMARY KEY,
        session_id integer NOT NULL REFERENCES public.interview_sessions(id),
        question_id character varying,
        candidate_answer text,
        ai_relevance_score numeric(5,2),
        ai_feedback text
    );`
    ];

    try {
        for (const query of tables) {
            await pool.query(query);
        }
        console.log('Database initialized successfully with all tables.');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
};

module.exports = {
    query: (text, params) => pool.query(text, params),
    initDb,
};
