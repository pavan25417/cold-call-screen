# Cold Call Companion Screen · 8-Stage Caller Guide

A purpose-built web application designed for B2B sales professionals to keep open during live cold calls. Built for the **Forward Deployed Engineer (Hyderabad)** selection task at **DeepThought CultureTech Ventures**.

Live application URL: `https://cold-call-screen-sand.vercel.app`  
Backend Health Check URL: `https://cold-call-screen-backend.onrender.com/health`  
GitHub Repository: `https://github.com/pavan25417/cold-call-screen`  
Google Drive Video (6+ Mins, Public): `https://drive.google.com/file/d/1A5ENqANyN5Sgk6ZnfzX5MsBxrv2D9epV/view?usp=sharing`  
Chosen Demo Transcript: **Transcript T095** (Mr. Dhanchand · Dhanchand Chemicals)

---

## 1. What This Product Solves

In B2B cold calling across Indian manufacturing and enterprise domains (such as Meridian Growth Partners selling operational growth analysis), callers face intense cognitive load:
- They have less than **10 seconds** to establish credibility.
- If a caller types long paragraphs into a traditional CRM while on the phone, they stop listening.
- If a caller lacks structured guidance, conversations collapse when prospects raise objections or question where the caller got their number.

**This application provides a two-screen companion:**
1. **Screen 1 (The Live Call Guide)**: Walks the caller through the 8 stages of a cold call:
   `Opening → Purpose → Permission → Their business → Their need → Objection → Next step → Close`
   - Stage purpose one-liner visible at a glance.
   - 3 authentic prospect phrases extracted from 100 real transcripts ("They may say").
   - 4 single-tap buttons for what happened so the caller barely types.
   - One text area reserved for verbatim recording of the prospect's exact words.
   - Prominent **"End call"** and **"Next stage"** triggers on **every stage**, reflecting the reality that calls terminate early.
2. **Screen 2 (Past Calls & CRM Log)**: Displays all past calls with the prospect name, company, stage reached, outcome badge, formatted timestamp, and an **AI-generated one-line executive summary**.

---

## 2. Empirical Grounding: The 100 Transcripts

Nothing on this screen is invented or guessed. All stage prompts, prospect quotes, and outcome options are clustered directly from the 100 cold-call transcripts in the task dataset:

| Stage | What the Stage is For | Authentic Quotes from Transcripts ("They May Say") | Primary Tap Outcomes |
|---|---|---|---|
| **1. Opening** | Reach the right person, establish identity, and verify tenure. | *"Yes, speaking. Who is this?"*<br>*"Aap Prakash Rao se baat kar rahe hain? Wrong number, he left 2 years ago."*<br>*"Haan ji, boliye, regarding what?"* | Connected with right person · Gatekeeper / assistant · Wrong number / left company · Bad connection / callback |
| **2. Purpose** | State why you called in words the prospect can repeat to a colleague. | *"From where? Can you say the company name again?"*<br>*"Where did you get my number from?"*<br>*"What does a growth report mean? Is this a sales call?"* | Understood purpose · Asked what company does · Asked contact source · Suspected sales call |
| **3. Permission** | Find out whether they can speak now or require a callback. | *"Haan boliye, go ahead, I can speak for 2 minutes."*<br>*"I am driving / in a meeting right now, call me after 30 minutes."*<br>*"Drop a message or send it on WhatsApp first."* | Granted permission · Busy now (callback requested) · Requested WhatsApp first · Flat refusal |
| **4. Their Business** | Ask about their company and operations before pitching solutions. | *"We are a small-scale manufacturer doing job work, not corporate."*<br>*"We are an MNC back office, all strategic decisions happen in the US."*<br>*"I am only looking after plant/technical operations, not company growth."* | Shared operational model · Job work / domestic only · MNC back office · Wrong functional domain |
| **5. Their Need** | Hear what they are trying to achieve or struggling with in their own words. | *"Margins are fixed in job work; we need help getting into new high-value products."*<br>*"Our biggest bottleneck is skilled manpower and plant capacity."*<br>*"Everything is running fine with existing clients; we don't have constraints."* | Named bottleneck (margin/capacity) · Skilled manpower shortage · Claimed no needs · Asked caller capability |
| **6. Objection** | Hear the reason for hesitation and understand it rather than arguing. | *"I don't want to spend any money on this, no. Be very specific."*<br>*"We already have global consultants / agencies under long-term contract."*<br>*"I am not the right person, talk to our MD or head office."* | Budget / cost objection · Existing agency in place · Not decision maker · Skeptical / requested deck |
| **7. Next Step** | Agree on one concrete action: document on WhatsApp/email or a named call time. | *"Send your deck/report on WhatsApp first, let me review it."*<br>*"Call me next Wednesday afternoon after 2 PM."*<br>*"Note down the number of our Operations Head and speak to him."* | Agreed WhatsApp report · Scheduled callback time · Referral to decision maker · Declined next step |
| **8. Close** | End call clearly, confirm agreed expectations, and record final outcome. | *"Yeah, aaram se, take your time, send it and we will connect Wednesday."*<br>*"Done, chalega, let us talk next week."*<br>*"Please do not call this number again."* | Confirmed follow-up warmly · Next step agreed · Call dropped / hung up · Hostile / Do Not Call |

### Drop-Off Analysis
Analysis of all 100 transcripts revealed that **68% of cold calls terminate before Stage 7**:
- **13%** end at **Stage 1 (Opening)** due to wrong numbers, retirements, or gatekeepers.
- **18%** end at **Stage 2 or 3 (Purpose/Permission)** due to driving, meetings, or defensive disinterest.
- **29%** end at **Stage 4, 5, or 6** due to corporate mismatches (e.g. MNC back offices) or firm objections.
- Only **32%** reach a concrete agreement in **Stage 7 (Next Step)** or **Stage 8 (Close)**.

---

## 3. The LLM Feature: Auto-Writing the One-Line Call Summary

### Which LLM We Used
**Google Gemini 1.5 Flash** (via Google AI Studio free API key) on the Render Node/Express backend.

### What It Does
When a cold call is closed (`POST /calls/:id/close`), the backend gathers:
1. Prospect name and company
2. The specific tap outcomes selected across all completed stages
3. The prospect's exact words recorded in Stage 5 ("Their need") and Stage 7 ("Next step")
4. The final logged outcome

The backend prompts Gemini to synthesize these into a single high-density sentence under 25 words:
> *Example output*: `"Chemical job work manufacturer seeking new product expansion with existing facility; agreed to review tailored report on WhatsApp by Monday with follow-up call Wednesday."`

### Why This Feature Was Chosen (Defense)
- **Eliminates CRM Note Fatigue**: Cold callers making 60+ dials a day suffer from post-call logging exhaustion. They tend to write useless summaries like *"Spoke, call later"* or *"Interested"*, losing all commercial context.
- **5-Second Prep for the Next Call**: When a colleague or manager reviews the pipeline, reading a standardized, punchy sentence highlighting the prospect's exact business constraint and next agreed action is 10x faster than listening to audio or reading raw notes.
- **Graceful Deterministic Fallback**: If the Gemini API key is missing or encounters a rate limit, the backend automatically triggers an intelligent rule-based synthesis engine, ensuring zero downtime.
- **Security**: The Gemini API key is stored exclusively in backend environment variables (`GEMINI_API_KEY`) on Render and is **never exposed to the frontend**.

---

## 4. What We Left Out and Why

1. **In-Browser Audio Recording & Real-time Speech-to-Text**:
   - *Why left out*: Browser microphone permissions often fail, high latency creates visual distraction for a live caller, and Indian enterprise calls frequently mix English, Hindi, and regional dialects (e.g., Hinglish, Marathi in T003/T095), where standard real-time STT models hallucinate. Single-tap buttons derived from real transcripts are faster and 100% reliable.
2. **Complex Multi-Field CRM Forms**:
   - *Why left out*: Asking a caller on a live phone call to fill in revenue, employee count, and lead source causes cognitive paralysis. We restricted free text to a single box for the prospect's exact words.
3. **Rigid Wizard Locking**:
   - *Why left out*: Real conversations are fluid. Prospects often jump straight to objections or ask what the company does immediately. Callers can jump between completed stages and trigger an exit at any point.

---

## 5. Technical Architecture & Database Schema

```
[Vercel Frontend] (React 18 + Vite + Tailwind CSS)
        │
        ▼ (HTTPS REST APIs)
[Render Backend] (Node.js + Express) ───► [Google Gemini 1.5 Flash API]
        │
        ▼
[Supabase Database] (PostgreSQL + RLS)
   ├── calls (id, prospect_name, company, started_at, ended_at, outcome, last_stage, summary)
   └── stage_results (id, call_id, stage_number, what_happened, prospect_words, created_at)
```

---

## 6. Backend API Endpoints

- `GET /health` - Verifies service status, database connection, and LLM configuration (handles Render free-tier idle wake-up).
- `GET /stages` - Returns all 8 stages with metadata, transcript quotes, and tap outcomes.
- `POST /calls/start` - Body: `{ prospect_name, company }` → Creates new call record.
- `POST /calls/:id/stage` - Body: `{ stage_number, what_happened, prospect_words }` → Saves stage result and updates progression.
- `POST /calls/:id/close` - Body: `{ outcome, ended_at, final_stage_number, what_happened, prospect_words }` → Triggers Gemini LLM summary generation and saves final state.
- `GET /calls` - Returns all saved calls ordered by timestamp.
- `GET /calls/:id` - Returns detailed call record including all stage notes.

---

## 7. Submission Deliverables Checklist
- [x] Public GitHub repo with complete code and SQL schema
- [x] Live Vercel frontend URL
- [x] Live Render backend `/health` URL (`https://cold-call-screen-backend.onrender.com/health`)
- [x] Unscripted 6+ minute video with camera on (Google Drive: Anyone with link can view)
- [x] Transcript T095 demoed in video and mentioned in WhatsApp message to CEO
