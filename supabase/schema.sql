-- Cold Call Screen - Supabase Schema
-- DeepThought Forward Deployed Engineer Selection Task
-- Tables: calls and stage_results

-- 1. Enable pgcrypto / uuid extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create calls table
CREATE TABLE IF NOT EXISTS calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prospect_name TEXT NOT NULL,
    company TEXT NOT NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    outcome TEXT,
    last_stage INTEGER NOT NULL DEFAULT 1 CHECK (last_stage BETWEEN 1 AND 8),
    summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create stage_results table
CREATE TABLE IF NOT EXISTS stage_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    call_id UUID NOT NULL REFERENCES calls(id) ON DELETE CASCADE,
    stage_number INTEGER NOT NULL CHECK (stage_number BETWEEN 1 AND 8),
    what_happened TEXT NOT NULL,
    prospect_words TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(call_id, stage_number)
);

-- 4. Create Indexes for performance
CREATE INDEX IF NOT EXISTS idx_calls_started_at ON calls(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_calls_outcome ON calls(outcome);
CREATE INDEX IF NOT EXISTS idx_stage_results_call_id ON stage_results(call_id);
CREATE INDEX IF NOT EXISTS idx_stage_results_stage_number ON stage_results(stage_number);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE stage_results ENABLE ROW LEVEL SECURITY;

-- 6. Create permissive RLS policies for anonymous / authenticated access (Internal caller app)
CREATE POLICY "Allow public read on calls" ON calls
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on calls" ON calls
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on calls" ON calls
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete on calls" ON calls
    FOR DELETE USING (true);

CREATE POLICY "Allow public read on stage_results" ON stage_results
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on stage_results" ON stage_results
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on stage_results" ON stage_results
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete on stage_results" ON stage_results
    FOR DELETE USING (true);

-- 7. Seed Initial Realistic Call Records (derived from transcripts)
INSERT INTO calls (id, prospect_name, company, started_at, ended_at, outcome, last_stage, summary)
VALUES
    (
        '11111111-1111-1111-1111-111111111111',
        'Mr. Dhanchand',
        'Dhanchand Chemicals',
        NOW() - INTERVAL '2 hours',
        NOW() - INTERVAL '1 hour 55 minutes',
        'next_step_agreed',
        8,
        'Chemical job work manufacturer seeking new product expansion with existing facility; agreed to review tailored report on WhatsApp by Monday with follow-up call Wednesday.'
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'Dr. Anjali Menon',
        'Menon Family Clinic',
        NOW() - INTERVAL '4 hours',
        NOW() - INTERVAL '3 hours 58 minutes',
        'agreed_to_receive_report',
        7,
        'Clinic owner satisfied with CA but agreed to receive one-page WhatsApp summary on compliance automation.'
    ),
    (
        '33333333-3333-3333-3333-333333333333',
        'Manpreet Singh',
        'Novara Foods India',
        NOW() - INTERVAL '6 hours',
        NOW() - INTERVAL '5 hours 59 minutes',
        'wrong_person',
        1,
        'Reached back-office subsidiary; prospect clarified all strategic growth and procurement decisions handled exclusively by US headquarters.'
    ),
    (
        '44444444-4444-4444-4444-444444444444',
        'Leonard Sir',
        'Orbit Automation',
        NOW() - INTERVAL '1 day',
        NOW() - INTERVAL '23 hours 59 minutes',
        'follow_up',
        3,
        'Early-stage automation startup CEO was in a client meeting; requested callback in 30 minutes.'
    )
ON CONFLICT (id) DO NOTHING;

-- Seed stage results for the primary demo call (Mr. Dhanchand / T095)
INSERT INTO stage_results (call_id, stage_number, what_happened, prospect_words)
VALUES
    ('11111111-1111-1111-1111-111111111111', 1, 'Connected with right person', 'Yes, this is Dhanchand.'),
    ('11111111-1111-1111-1111-111111111111', 2, 'Understood purpose & willing to listen', 'Regarding what? Yes, please go ahead.'),
    ('11111111-1111-1111-1111-111111111111', 3, 'Granted permission (go ahead)', 'Please. Yeah, please go ahead.'),
    ('11111111-1111-1111-1111-111111111111', 4, 'Clarified they are job work / domestic only', 'Review discipline? These are corporate words. We are a small-scale company.'),
    ('11111111-1111-1111-1111-111111111111', 5, 'Named specific bottleneck (margins / products / capacity)', 'We majorly work on job work. The margin is technically hardly any. Looking for people who can help me with new products with our facility.'),
    ('11111111-1111-1111-1111-111111111111', 6, 'Budget / cost objection (not spending money)', 'I don''t want to spend any money on this, no. I''ll be very specific. What is your product?'),
    ('11111111-1111-1111-1111-111111111111', 7, 'Agreed to receive report on WhatsApp / email', 'Aap na mujhe bhej dijiye, let me first go through it. Can I call you on Wednesday? Yeah, aaram se.'),
    ('11111111-1111-1111-1111-111111111111', 8, 'Confirmed follow-up commitment & closed warmly', 'Yeah, aaram se, take your time. Done, thank you.')
ON CONFLICT (call_id, stage_number) DO NOTHING;
