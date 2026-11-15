# 6-Minute Video Recording Guide & Transcript Walkthrough
**Role**: Forward Deployed Engineer (DeepThought Hyderabad)  
**Task**: Cold Call Companion Screen · Selection Task  
**Chosen Transcript**: **T095** (Mr. Dhanchand · Dhanchand Chemicals)  
**Target Video Length**: **6 to 8 minutes** (MUST be at least 6:00 minutes; do not stop under 6:00!)

---

## ⚠️ Critical Rules (Mistakes that get rejected)
1. **Camera MUST be ON**: Your face must be visible throughout the recording (e.g. using Loom, OBS, or QuickTime with camera overlay in corner).
2. **At least 6 minutes long**: The system rejects files under 6 minutes automatically.
3. **Google Drive MUST be Public**: Share settings must be set to **"Anyone with the link can view"**. Do NOT leave it on "Restricted".
4. **DO NOT read word-for-word from a script**: DeepThought evaluates your natural conviction, communication clarity, and business thinking. Use this guide as bullet points.

---

## Recommended Video Structure (Minute-by-Minute)

```
0:00 – 1:00 | Introduction & The Cold Caller's Problem
1:00 – 3:30 | Live Walkthrough of Transcript T095 (All 8 Stages)
3:30 – 4:45 | Past Calls & Defending the LLM Auto-Summary Feature
4:45 – 6:00 | Defending One Core Design Decision (Stage Drop-offs & Tap UX)
6:00 – 6:30 | Tech Stack Overview & Closing
```

---

### Segment 1 (0:00 – 1:00): Introduction & Business Context
- **Introduce yourself**: Name, registering for the Forward Deployed Engineer role in Hyderabad.
- **The Core Problem**: Explain what an Indian B2B cold caller faces when calling promoters, plant heads, and directors (e.g. Meridian Growth Partners).
- **The Friction**: 
  - Callers have 10 seconds to make an impression.
  - If a caller types long paragraphs during a call, they stop listening.
  - If a caller has no visual guide, they get flustered when prospects object or question the purpose.
  - That's why this companion screen exists: one phone in the caller's hand, one tap screen on their laptop.

---

### Segment 2 (1:00 – 3:30): Live Walkthrough of Transcript T095
Open your live Vercel app (with camera on). Click **"Start Cold Call"** (or use the **1-Click Demo: T095** button).

#### Stage 1: Opening
- **Explain**: "Caller reaches Mr. Dhanchand, Director of Dhanchand Chemicals."
- **Tap**: `Connected with right person`.
- **Their words**: `"Yes, this is Dhanchand."`
- **Click**: `Next: Purpose →`.

#### Stage 2: Purpose
- **Explain**: "Arjun explains Meridian helps fast-growing companies resolve operational bottlenecks."
- **They may say**: Note the authentic phrases like *"From where? Can you say the company name again?"*
- **Tap**: `Understood purpose & willing to listen`.
- **Their words**: `"Regarding what? Yes, please go ahead."`
- **Click**: `Next: Permission →`.

#### Stage 3: Permission
- **Explain**: "Arjun asks if this is the right time to speak and asks 3 quick yes/no questions."
- **Tap**: `Granted permission (go ahead)`.
- **Their words**: `"Please. Yeah, please go ahead."`
- **Click**: `Next: Business →`.

#### Stage 4: Their Business
- **Explain**: "Arjun asks about review discipline and team growth. Mr. Dhanchand points out they are a small-scale chemical company."
- **Tap**: `Clarified they are job work / domestic only`.
- **Their words**: `"Review discipline? These are all corporate words. We are a small-scale company, sir."`
- **Click**: `Next: Need →`.

#### Stage 5: Their Need (The Heart of the Call)
- **Explain to camera**: "This is the most critical stage of the cold call. The caller must capture the prospect's exact constraint verbatim."
- **Quote Mr. Dhanchand**: *"The thing is, our company majorly works on a job work basis in chemicals. The margin is technically hardly any. As soon as I increase margins, customers will go to someone else. Probably looking for people who can help me with new products, with our facility."*
- **Tap**: `Named specific bottleneck (margins / products / capacity)`.
- **Their words**: Enter or click the quote from the transcript.
- **Click**: `Next: Objection →`.

#### Stage 6: Objection
- **Explain**: "Mr. Dhanchand raises a sharp budget objection: *"I don't want to spend any money on this, no. I'll be very, very specific. What is your product?"*
- **Tap**: `Budget / cost objection (not spending money)`.
- **Their words**: `"I don't want to spend any money on this, no."`
- **Click**: `Next: Next step →`.

#### Stage 7: Next Step
- **Explain**: "Arjun clarifies the initial research report is zero-cost, tailored to chemical new products. Mr. Dhanchand agrees to receive it on WhatsApp by Monday and schedule a callback for Wednesday afternoon."
- **Tap**: `Agreed to receive report on WhatsApp / email`.
- **Their words**: `"Aap na mujhe bhej dijiye. Can I call you on Wednesday? Yeah, aaram se."`
- **Click**: `Next: Close →` (or `End call`).

#### Stage 8: Close
- **Explain**: "Arjun confirms the commitment and closes warmly: *"Around this time, thank you."*
- **Tap**: `Confirmed follow-up commitment & closed warmly`.
- **Click**: `Complete Call →`.

---

### Segment 3 (3:30 – 4:45): The LLM Feature & Past Calls Screen
- **The End Call Modal**:
  - Show the outcome dropdown (`next_step_agreed`).
  - Click **"Save & Generate AI Summary"**.
  - Show the live call to Gemini API on the backend!
  - Point out the generated summary:
    *"Chemical job work manufacturer seeking new product expansion with existing facility; agreed to review tailored report on WhatsApp by Monday with follow-up call Wednesday."*
- **Why defend this LLM decision?**:
  - "In a real sales floor, callers take 50 to 100 calls a day. After a call, they are exhausted. They type incomplete notes like 'spoke to him' or 'follow up', losing the actual context."
  - "By having Gemini synthesize the exact words from Stage 5 (the bottleneck) and Stage 7 (the next step) into one high-density sentence, the next caller can read it in 3 seconds before their follow-up."
- **Show the Past Calls Screen**:
  - Show the newly saved call at the top of the list.
  - Expand the "View stage notes" accordion to show the full audit trail of each stage.
  - Demonstrate search and outcome filtering.

---

### Segment 4 (4:45 – 6:00): Defend One Major Design Decision
**Decision to defend: "Why the screen enforces tap buttons and an End Call button at EVERY single stage."**

Speak with conviction on these points:
1. **The 68% Drop-off Reality**:
   - "When I analyzed the 100 transcripts, I found that **68% of calls never reach Stage 7**. 13% die at Stage 1 due to wrong numbers or people who left the company years ago. Another 18% die at Purpose or Permission because the prospect is driving or busy."
   - "A junior engineer might design a wizard that forces you to click through stages 1 to 8 in order. In the real world, that caller would abandon the software on day one. Having a prominent red 'End call' button on every stage lets the caller exit immediately and log whether it was a wrong person, a gatekeeper, or a busy prospect."
2. **Tap Buttons over Free Text**:
   - "When a prospect is speaking on the phone, cognitive load is high. If the caller has to type full sentences, they stop listening. By clustering the 100 transcripts into 4 dominant outcomes per stage, 90% of the interaction is a single tap."
   - "We reserved free-form text exclusively for Stage 5 ('Their need') and Stage 7 ('Next step'), because those are the only two places where the prospect's exact words matter for revenue."

---

### Segment 5 (6:00 – 6:30): Tech Stack Recap & Wrap-up
- **Supabase**: PostgreSQL database storing `calls` and `stage_results` with foreign keys and RLS policies.
- **Render**: Node.js/Express backend exposing `/health`, `/calls/start`, `/calls/:id/stage`, and `/calls/:id/close`. Gemini API key is kept strictly secure on the backend, never in client code.
- **Vercel**: React + Vite frontend with Tailwind CSS, responsive and fast.
- Conclude with energy: "This tool was built from real data, tested against real conversations, and designed for how callers actually work. Thank you."

---

## 📹 Post-Recording Checklist:
1. Check video file length: is it **6 minutes or longer**? (e.g. 6:15 or 6:30 is perfect).
2. Upload video file to Google Drive.
3. Right click file in Drive -> **Share** -> Change "General access" from *Restricted* to **"Anyone with the link can view"**.
4. Test opening the link in an Incognito / Private browser window without logging into Google. If it plays, you are ready to submit!
