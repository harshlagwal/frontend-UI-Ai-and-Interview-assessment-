--
-- PostgreSQL database dump
--

\restrict Web8QvgIgh5JDm0Y6wlLylUa3mWc4P8jsSbqMR7TiLwBxtk69fHCW6IFdr0Nybk

-- Dumped from database version 14.20 (Ubuntu 14.20-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.20 (Ubuntu 14.20-0ubuntu0.22.04.1)

-- Started on 2026-01-29 22:04:26 IST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16462)
-- Name: answer_evaluations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.answer_evaluations (
    id integer NOT NULL,
    session_id integer NOT NULL,
    question_id character varying,
    candidate_answer text,
    ai_relevance_score numeric(5,2),
    ai_feedback text
);


--
-- TOC entry 219 (class 1259 OID 16461)
-- Name: answer_evaluations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.answer_evaluations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3554 (class 0 OID 0)
-- Dependencies: 219
-- Name: answer_evaluations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.answer_evaluations_id_seq OWNED BY public.answer_evaluations.id;


--
-- TOC entry 218 (class 1259 OID 16447)
-- Name: audio_transcripts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audio_transcripts (
    id integer NOT NULL,
    session_id integer NOT NULL,
    start_timestamp timestamp with time zone,
    end_timestamp timestamp with time zone,
    text_content text NOT NULL,
    is_multiple_speakers boolean DEFAULT false
);


--
-- TOC entry 217 (class 1259 OID 16446)
-- Name: audio_transcripts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.audio_transcripts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3555 (class 0 OID 0)
-- Dependencies: 217
-- Name: audio_transcripts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.audio_transcripts_id_seq OWNED BY public.audio_transcripts.id;


--
-- TOC entry 216 (class 1259 OID 16430)
-- Name: face_pose_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.face_pose_events (
    id integer NOT NULL,
    session_id integer NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now(),
    event_type character varying NOT NULL,
    duration_ms integer DEFAULT 0,
    severity_score integer DEFAULT 1
);


--
-- TOC entry 215 (class 1259 OID 16429)
-- Name: face_pose_events_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.face_pose_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3556 (class 0 OID 0)
-- Dependencies: 215
-- Name: face_pose_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.face_pose_events_id_seq OWNED BY public.face_pose_events.id;


--
-- TOC entry 212 (class 1259 OID 16398)
-- Name: interview_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.interview_sessions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    start_time timestamp with time zone DEFAULT now() NOT NULL,
    end_time timestamp with time zone,
    total_risk_score numeric(5,2) DEFAULT 0.00,
    status character varying DEFAULT 'IN_PROGRESS'::character varying
);


--
-- TOC entry 211 (class 1259 OID 16397)
-- Name: interview_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.interview_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3557 (class 0 OID 0)
-- Dependencies: 211
-- Name: interview_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.interview_sessions_id_seq OWNED BY public.interview_sessions.id;


--
-- TOC entry 214 (class 1259 OID 16415)
-- Name: object_detection_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.object_detection_events (
    id integer NOT NULL,
    session_id integer NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now(),
    object_detected character varying NOT NULL,
    confidence_score numeric(5,2) NOT NULL,
    snapshot_url text
);


--
-- TOC entry 213 (class 1259 OID 16414)
-- Name: object_detection_events_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.object_detection_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3558 (class 0 OID 0)
-- Dependencies: 213
-- Name: object_detection_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.object_detection_events_id_seq OWNED BY public.object_detection_events.id;


--
-- TOC entry 210 (class 1259 OID 16386)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying NOT NULL,
    email character varying NOT NULL,
    password_hash text NOT NULL,
    full_name character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 209 (class 1259 OID 16385)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3559 (class 0 OID 0)
-- Dependencies: 209
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 221 (class 1259 OID 16480)
-- Name: view_candidate_risk_summary; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.view_candidate_risk_summary AS
 SELECT s.id AS session_id,
    u.full_name,
    u.email,
    s.start_time,
    s.total_risk_score,
    count(o.id) AS phone_detection_count,
    count(f.id) AS suspicious_face_movements
   FROM (((public.interview_sessions s
     JOIN public.users u ON ((s.user_id = u.id)))
     LEFT JOIN public.object_detection_events o ON (((s.id = o.session_id) AND ((o.object_detected)::text = 'cell phone'::text))))
     LEFT JOIN public.face_pose_events f ON (((s.id = f.session_id) AND (f.severity_score > 3))))
  GROUP BY s.id, u.full_name, u.email, s.start_time, s.total_risk_score;


--
-- TOC entry 3374 (class 2604 OID 16465)
-- Name: answer_evaluations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.answer_evaluations ALTER COLUMN id SET DEFAULT nextval('public.answer_evaluations_id_seq'::regclass);


--
-- TOC entry 3372 (class 2604 OID 16450)
-- Name: audio_transcripts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audio_transcripts ALTER COLUMN id SET DEFAULT nextval('public.audio_transcripts_id_seq'::regclass);


--
-- TOC entry 3368 (class 2604 OID 16433)
-- Name: face_pose_events id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.face_pose_events ALTER COLUMN id SET DEFAULT nextval('public.face_pose_events_id_seq'::regclass);


--
-- TOC entry 3362 (class 2604 OID 16401)
-- Name: interview_sessions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interview_sessions ALTER COLUMN id SET DEFAULT nextval('public.interview_sessions_id_seq'::regclass);


--
-- TOC entry 3366 (class 2604 OID 16418)
-- Name: object_detection_events id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.object_detection_events ALTER COLUMN id SET DEFAULT nextval('public.object_detection_events_id_seq'::regclass);


--
-- TOC entry 3360 (class 2604 OID 16389)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3548 (class 0 OID 16462)
-- Dependencies: 220
-- Data for Name: answer_evaluations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.answer_evaluations (id, session_id, question_id, candidate_answer, ai_relevance_score, ai_feedback) FROM stdin;
\.


--
-- TOC entry 3546 (class 0 OID 16447)
-- Dependencies: 218
-- Data for Name: audio_transcripts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.audio_transcripts (id, session_id, start_timestamp, end_timestamp, text_content, is_multiple_speakers) FROM stdin;
\.


--
-- TOC entry 3544 (class 0 OID 16430)
-- Dependencies: 216
-- Data for Name: face_pose_events; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.face_pose_events (id, session_id, "timestamp", event_type, duration_ms, severity_score) FROM stdin;
\.


--
-- TOC entry 3540 (class 0 OID 16398)
-- Dependencies: 212
-- Data for Name: interview_sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.interview_sessions (id, user_id, start_time, end_time, total_risk_score, status) FROM stdin;
\.


--
-- TOC entry 3542 (class 0 OID 16415)
-- Dependencies: 214
-- Data for Name: object_detection_events; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.object_detection_events (id, session_id, "timestamp", object_detected, confidence_score, snapshot_url) FROM stdin;
\.


--
-- TOC entry 3538 (class 0 OID 16386)
-- Dependencies: 210
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, username, email, password_hash, full_name, created_at) FROM stdin;
\.


--
-- TOC entry 3560 (class 0 OID 0)
-- Dependencies: 219
-- Name: answer_evaluations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.answer_evaluations_id_seq', 1, false);


--
-- TOC entry 3561 (class 0 OID 0)
-- Dependencies: 217
-- Name: audio_transcripts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.audio_transcripts_id_seq', 1, false);


--
-- TOC entry 3562 (class 0 OID 0)
-- Dependencies: 215
-- Name: face_pose_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.face_pose_events_id_seq', 1, false);


--
-- TOC entry 3563 (class 0 OID 0)
-- Dependencies: 211
-- Name: interview_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.interview_sessions_id_seq', 1, false);


--
-- TOC entry 3564 (class 0 OID 0)
-- Dependencies: 213
-- Name: object_detection_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.object_detection_events_id_seq', 1, false);


--
-- TOC entry 3565 (class 0 OID 0)
-- Dependencies: 209
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- TOC entry 3391 (class 2606 OID 16469)
-- Name: answer_evaluations answer_evaluations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.answer_evaluations
    ADD CONSTRAINT answer_evaluations_pkey PRIMARY KEY (id);


--
-- TOC entry 3388 (class 2606 OID 16455)
-- Name: audio_transcripts audio_transcripts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audio_transcripts
    ADD CONSTRAINT audio_transcripts_pkey PRIMARY KEY (id);


--
-- TOC entry 3385 (class 2606 OID 16440)
-- Name: face_pose_events face_pose_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.face_pose_events
    ADD CONSTRAINT face_pose_events_pkey PRIMARY KEY (id);


--
-- TOC entry 3380 (class 2606 OID 16408)
-- Name: interview_sessions interview_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interview_sessions
    ADD CONSTRAINT interview_sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 3383 (class 2606 OID 16423)
-- Name: object_detection_events object_detection_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.object_detection_events
    ADD CONSTRAINT object_detection_events_pkey PRIMARY KEY (id);


--
-- TOC entry 3376 (class 2606 OID 16396)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3378 (class 2606 OID 16394)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3389 (class 1259 OID 16479)
-- Name: idx_audio_session; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audio_session ON public.audio_transcripts USING btree (session_id) WITH (deduplicate_items='true');


--
-- TOC entry 3386 (class 1259 OID 16478)
-- Name: idx_face_session; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_face_session ON public.face_pose_events USING btree (session_id) WITH (deduplicate_items='true');


--
-- TOC entry 3381 (class 1259 OID 16477)
-- Name: idx_obj_session; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_obj_session ON public.object_detection_events USING btree (session_id) WITH (deduplicate_items='true');


--
-- TOC entry 3395 (class 2606 OID 16456)
-- Name: audio_transcripts fk_audio_session; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audio_transcripts
    ADD CONSTRAINT fk_audio_session FOREIGN KEY (session_id) REFERENCES public.interview_sessions(id);


--
-- TOC entry 3396 (class 2606 OID 16470)
-- Name: answer_evaluations fk_eval_session; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.answer_evaluations
    ADD CONSTRAINT fk_eval_session FOREIGN KEY (session_id) REFERENCES public.interview_sessions(id);


--
-- TOC entry 3394 (class 2606 OID 16441)
-- Name: face_pose_events fk_face_session; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.face_pose_events
    ADD CONSTRAINT fk_face_session FOREIGN KEY (session_id) REFERENCES public.interview_sessions(id);


--
-- TOC entry 3393 (class 2606 OID 16424)
-- Name: object_detection_events fk_session_object; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.object_detection_events
    ADD CONSTRAINT fk_session_object FOREIGN KEY (session_id) REFERENCES public.interview_sessions(id);


--
-- TOC entry 3392 (class 2606 OID 16409)
-- Name: interview_sessions fk_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interview_sessions
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id);


-- Completed on 2026-01-29 22:04:26 IST

--
-- PostgreSQL database dump complete
--

\unrestrict Web8QvgIgh5JDm0Y6wlLylUa3mWc4P8jsSbqMR7TiLwBxtk69fHCW6IFdr0Nybk

