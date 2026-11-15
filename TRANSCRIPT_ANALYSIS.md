# 100 Cold Call Transcripts Analysis
**Dataset**: 100 cold-call transcripts conducted by Meridian Growth Partners (Hyderabad), reaching owners, managing directors, and senior leaders of Indian companies across manufacturing, technology, and services.

---

## 1. Quantitative Breakdown & Where Calls End

Cold calls do not follow a linear path from stage 1 to 8; the vast majority terminate early due to gatekeepers, wrong numbers, busy schedules, or lack of immediate relevance.

| Stage Reached | Percentage of Calls | Primary Drivers from Transcripts | Common Logged Outcomes |
|---|---|---|---|
| **Stage 1: Opening** | **13%** | Wrong number, person retired or moved company 2–14 years ago, stuck with switchboard receptionist. | `wrong_person` (8%), `moved_company` (5%) |
| **Stage 2: Purpose** | **10%** | Prospect interrupts immediately asking "Where did you get this number?" or suspects an aggressive sales call. | `not_interested` (6%), `do_not_call` (4%) |
| **Stage 3: Permission** | **8%** | Prospect is driving, in a board meeting, or on a plant floor; requests callback in 30 mins or 1 hour. | `call_again` (4%), `follow_up` (4%) |
| **Stage 4: Their Business** | **14%** | Prospect clarifies they are an MNC back-office with zero local purchasing authority, or purely small-scale domestic job work. | `not_interested` (8%), `wrong_person` (6%) |
| **Stage 5: Their Need** | **15%** | Prospect discusses their operations but claims "Everything is fine, we don't have constraints" or asks for news media only. | `not_interested` (9%), `interested` (6%) |
| **Stage 6: Objection** | **13%** | Firm objections: "We already have global consultants", "I don't want to spend a single rupee", "Send on WhatsApp first". | `do_not_call` (6%), `not_interested` (7%) |
| **Stage 7: Next Step** | **14%** | Agreed to receive a customized one-pager on WhatsApp or schedule a follow-up discussion. | `agreed_to_receive_report` (14%) |
| **Stage 8: Close** | **13%** | Fixed calendar commitment, confirmed time (e.g., "Tuesday after 2 PM" or "Wednesday afternoon"). | `next_step_agreed` (11%), `follow_up` (2%) |

### Key Duration Statistics
- **Average duration**: 135.6 seconds (2 mins 15 seconds)
- **Median duration**: 94 seconds (1 min 34 seconds)
- **Short calls (under 60 seconds)**: 25%
- **Mid calls (60s to 180s)**: 53%
- **Long calls (over 180s)**: 22%

> **Core Architectural Implication**: Because **68% of calls terminate before Stage 7**, an **"End call" button must be prominently placed on every single stage**, allowing the caller to log the exit reason instantly without wading through irrelevant steps.

---

## 2. Stage-by-Stage Field Findings (What Prospects Say & Tap Outcomes)

### Stage 1: Opening
- **Stage Purpose**: Reach the right person, establish identity, and verify if they are still with the company.
- **3 Things Prospects Tend to Say**:
  1. *"Yes, speaking. Who is this?"*
  2. *"Aap Prakash Rao / Rajan Iyer se baat kar rahe hain? Wrong number, he left two years ago."*
  3. *"Haan ji, boliye, regarding what?"*
- **Tap Buttons (What Happened)**:
  - `Connected with right person`
  - `Gatekeeper / switchboard assistant`
  - `Wrong number / person left company`
  - `Bad connection / asked to call back`

### Stage 2: Purpose
- **Stage Purpose**: State in one or two sentences why you called, in words the prospect can repeat to a colleague.
- **3 Things Prospects Tend to Say**:
  1. *"From where? Can you say the company name again?"*
  2. *"Where did you get my number from?"*
  3. *"What does a growth report mean? Is this a sales call?"*
- **Tap Buttons (What Happened)**:
  - `Understood purpose & willing to listen`
  - `Asked what company does / asked to repeat`
  - `Asked where we got their contact info`
  - `Suspected sales call / defensive`

### Stage 3: Permission
- **Stage Purpose**: Find out whether they are willing to talk now or if a specific callback time is needed.
- **3 Things Prospects Tend to Say**:
  1. *"Haan boliye, go ahead, I can speak for 2 minutes."*
  2. *"I am driving / in a meeting right now, call me after 30 minutes."*
  3. *"Drop a message or send it on WhatsApp first."*
- **Tap Buttons (What Happened)**:
  - `Granted permission (go ahead)`
  - `Busy now (asked to call back later)`
  - `Requested WhatsApp / email before talking`
  - `Flat refusal / not interested`

### Stage 4: Their Business
- **Stage Purpose**: Ask about their company and operations before saying anything about your solutions.
- **3 Things Prospects Tend to Say**:
  1. *"We are a small-scale manufacturer doing job work, not corporate."*
  2. *"We are an MNC back office, all strategic decisions happen in the US."*
  3. *"I am only looking after plant/technical operations, not company growth."*
- **Tap Buttons (What Happened)**:
  - `Shared operational model & scale`
  - `Clarified they are job work / domestic only`
  - `Identified as MNC subsidiary / back office`
  - `Prospect is wrong functional domain`

### Stage 5: Their Need (In Their Own Words)
- **Stage Purpose**: Hear what they are trying to achieve or struggling with in their own exact words.
- **3 Things Prospects Tend to Say**:
  1. *"Margins are fixed in job work; we need help getting into new high-value products."*
  2. *"Our biggest bottleneck is skilled manpower and plant capacity."*
  3. *"Everything is running fine with existing clients; we don't have any constraints."*
- **Tap Buttons (What Happened)**:
  - `Named specific bottleneck (margins / products / capacity)`
  - `Stated skilled manpower / hiring challenge`
  - `Claimed no needs / satisfied with current setup`
  - `Asked what caller can specifically do for them`

### Stage 6: Objection
- **Stage Purpose**: Hear the reason for hesitation and understand it rather than talking over it.
- **3 Things Prospects Tend to Say**:
  1. *"I don't want to spend any money on this, no. Be very specific."*
  2. *"We already have global consultants / agencies under long-term contract."*
  3. *"I am not the right person, talk to our MD or head office."*
- **Tap Buttons (What Happened)**:
  - `Budget / cost objection (not spending money)`
  - `Existing consultant / agency in place`
  - `Not decision-maker (referred to MD/HO)`
  - `Skeptical of value / requested deck first`

### Stage 7: Next Step
- **Stage Purpose**: Agree on one concrete action: document on WhatsApp/email, or a call at a named time.
- **3 Things Prospects Tend to Say**:
  1. *"Send your deck/report on WhatsApp first, let me review it."*
  2. *"Call me next Wednesday afternoon after 2 PM."*
  3. *"Note down the number of our Operations Head and speak to him."*
- **Tap Buttons (What Happened)**:
  - `Agreed to receive report on WhatsApp / email`
  - `Scheduled specific callback day & time`
  - `Received referral to decision-maker with contact`
  - `Prospect declined any next step`

### Stage 8: Close
- **Stage Purpose**: End the call clearly, confirm the agreed expectation, and log the outcome accurately.
- **3 Things Prospects Tend to Say**:
  1. *"Yeah, aaram se, take your time, send it and we will connect Wednesday."*
  2. *"Done, chalega, let us talk next week."*
  3. *"Please do not call this number again."*
- **Tap Buttons (What Happened)**:
  - `Confirmed follow-up commitment & closed warmly`
  - `Next step agreed, awaiting document review`
  - `Call ended abruptly / hung up`
  - `Explicit Do Not Call / hostile exit`

---

## 3. Chosen Transcript for Video Demo: Transcript T095

- **Prospect**: Mr. Dhanchand, Director
- **Company**: Dhanchand Chemicals (Mid-size private chemical manufacturer)
- **Caller**: Arjun, Meridian Growth Partners
- **Duration**: 282 seconds (4 minutes 42 seconds)
- **Final Outcome**: `next_step_agreed`

### Why T095 is the Strongest Choice for the 6-Minute Video:
1. **Flawless 8-Stage Progression**: The conversation moves through all 8 stages without skipping or rushing.
2. **Authentic Indian Manufacturing Context**: Captures real-world Indian SME dynamics ("Review discipline? Corporate words. We are a job-work chemical company").
3. **High-Value Need (Stage 5)**: The prospect explicitly articulates his dilemma: *"The margin is technically hardly any. As soon as I increase my margins, my customers will go to someone else. Probably I'm looking for people who can help me with new products, with our facility."*
4. **Sharp Objection (Stage 6)**: Mr. Dhanchand challenges Arjun: *"I don't want to spend any money on this, no. I'll be very, very specific."*
5. **Concrete Actionable Agreement (Stage 7 & 8)**: Arjun commits to sending tailored ideas over WhatsApp by Monday, and Mr. Dhanchand confirms a follow-up discussion on Wednesday afternoon.
