export const STAGES = [
  {
    stage_number: 1,
    name: "Opening",
    short_name: "Opening",
    purpose: "Reach the right person, establish identity, and verify if they are still with the company.",
    they_may_say: [
      "\"Yes, speaking. Who is this?\"",
      "\"Aap kisse baat karna chahte hain? Wrong number, he left two years ago.\"",
      "\"Haan ji, boliye, regarding what?\""
    ],
    what_happened_options: [
      "Connected with right person",
      "Gatekeeper / switchboard assistant",
      "Wrong number / person left company",
      "Bad connection / asked to call back"
    ],
    placeholder: "e.g. 'He left the company two years ago' or 'Yes, speaking'"
  },
  {
    stage_number: 2,
    name: "Purpose",
    short_name: "Purpose",
    purpose: "Say in one or two sentences why you called, in words the prospect can repeat to a colleague.",
    they_may_say: [
      "\"From where? Can you say the company name again?\"",
      "\"Where did you get my number from?\"",
      "\"What does a growth report mean? Is this a sales call?\""
    ],
    what_happened_options: [
      "Understood purpose & willing to listen",
      "Asked what company does / asked to repeat",
      "Asked where we got their contact info",
      "Suspected sales call / defensive"
    ],
    placeholder: "e.g. 'What does Meridian do exactly, are you consulting or media?'"
  },
  {
    stage_number: 3,
    name: "Permission",
    short_name: "Permission",
    purpose: "Find out whether they are willing to talk now or if a specific callback time is needed.",
    they_may_say: [
      "\"Haan boliye, go ahead, I can speak for 2 minutes.\"",
      "\"I am driving / in a meeting right now, call me after 30 minutes.\"",
      "\"Drop a message or send it on WhatsApp first.\""
    ],
    what_happened_options: [
      "Granted permission (go ahead)",
      "Busy now (asked to call back later)",
      "Requested WhatsApp / email before talking",
      "Flat refusal / not interested"
    ],
    placeholder: "e.g. 'I am in a client meeting right now, please call after 30 minutes'"
  },
  {
    stage_number: 4,
    name: "Their business",
    short_name: "Business",
    purpose: "Ask about their company and operations before saying anything about your solutions.",
    they_may_say: [
      "\"We are a small-scale manufacturer doing job work, not corporate.\"",
      "\"We are an MNC back office, all strategic decisions happen in the US.\"",
      "\"I am only looking after plant/technical operations, not company growth.\""
    ],
    what_happened_options: [
      "Clarified they are job work / domestic only",
      "Shared operational model & scale",
      "Identified as MNC subsidiary / back office",
      "Prospect is wrong functional domain"
    ],
    placeholder: "e.g. 'Review discipline? Corporate words. We are a small job work chemical manufacturer'"
  },
  {
    stage_number: 5,
    name: "Their need, in their words",
    short_name: "Need",
    purpose: "Hear what they are trying to achieve or struggling with in their own exact words.",
    they_may_say: [
      "\"Margins are fixed in job work; we need help getting into new high-value products.\"",
      "\"Our biggest bottleneck is skilled manpower and plant capacity.\"",
      "\"Everything is running fine with existing clients; we don't have any constraints.\""
    ],
    what_happened_options: [
      "Named specific bottleneck (margins / products / capacity)",
      "Stated skilled manpower / hiring challenge",
      "Claimed no needs / satisfied with current setup",
      "Asked what caller can specifically do for them"
    ],
    placeholder: "e.g. 'As soon as I increase margins clients leave; looking for people to help with new products with our facility'"
  },
  {
    stage_number: 6,
    name: "Objection",
    short_name: "Objection",
    purpose: "Hear the reason for hesitation and understand it rather than talking over it.",
    they_may_say: [
      "\"I don't want to spend any money on this, no. Be very specific.\"",
      "\"We already have global consultants / agencies under long-term contract.\"",
      "\"I am not the right person, talk to our MD or head office.\""
    ],
    what_happened_options: [
      "Budget / cost objection (not spending money)",
      "Existing consultant / agency in place",
      "Not decision-maker (referred to MD/HO)",
      "Skeptical of value / requested deck first"
    ],
    placeholder: "e.g. 'I do not want to spend any money on this, no. What is your product?'"
  },
  {
    stage_number: 7,
    name: "Next step",
    short_name: "Next step",
    purpose: "Agree on one concrete action: document on WhatsApp/email, or a call at a named time.",
    they_may_say: [
      "\"Send your deck/report on WhatsApp first, let me review it.\"",
      "\"Call me next Wednesday afternoon after 2 PM.\"",
      "\"Note down the number of our Operations Head and speak to him.\""
    ],
    what_happened_options: [
      "Agreed to receive report on WhatsApp / email",
      "Scheduled specific callback day & time",
      "Received referral to decision-maker with contact",
      "Prospect declined any next step"
    ],
    placeholder: "e.g. 'Send it by Monday on WhatsApp, call me on Wednesday afternoon'"
  },
  {
    stage_number: 8,
    name: "Close",
    short_name: "Close",
    purpose: "End the call clearly, confirm the agreed expectation, and log the outcome accurately.",
    they_may_say: [
      "\"Yeah, aaram se, take your time, send it and we will connect Wednesday.\"",
      "\"Done, chalega, let us talk next week.\"",
      "\"Please do not call this number again.\""
    ],
    what_happened_options: [
      "Confirmed follow-up commitment & closed warmly",
      "Next step agreed, awaiting document review",
      "Call ended abruptly / hung up",
      "Explicit Do Not Call / hostile exit"
    ],
    placeholder: "e.g. 'Yeah, aaram se, take your time. Done, thank you.'"
  }
];

export const DEMO_T095_SCRIPT = {
  1: {
    what_happened: "Connected with right person",
    prospect_words: "Yes, this is Dhanchand."
  },
  2: {
    what_happened: "Understood purpose & willing to listen",
    prospect_words: "Regarding what? Yes, please go ahead."
  },
  3: {
    what_happened: "Granted permission (go ahead)",
    prospect_words: "Please. Yeah, please go ahead."
  },
  4: {
    what_happened: "Clarified they are job work / domestic only",
    prospect_words: "Review discipline? These are corporate words. We are a small-scale company, sir."
  },
  5: {
    what_happened: "Named specific bottleneck (margins / products / capacity)",
    prospect_words: "We majorly work on job work. The margin is technically hardly any. Looking for people who can help me with new products with our facility."
  },
  6: {
    what_happened: "Budget / cost objection (not spending money)",
    prospect_words: "I don't want to spend any money on this, no. I'll be very specific. What is your product?"
  },
  7: {
    what_happened: "Agreed to receive report on WhatsApp / email",
    prospect_words: "Aap na mujhe bhej dijiye, let me first go through it. Can I call you on Wednesday? Yeah, aaram se."
  },
  8: {
    what_happened: "Confirmed follow-up commitment & closed warmly",
    prospect_words: "Yeah, aaram se, take your time. Done, thank you."
  }
};

export const CALL_OUTCOMES = [
  { value: 'next_step_agreed', label: 'Next step agreed', color: 'emerald', description: 'Meeting or scheduled call confirmed' },
  { value: 'agreed_to_receive_report', label: 'Agreed to receive report', color: 'teal', description: 'Agreed to receive deck/report on WhatsApp/email' },
  { value: 'interested', label: 'Interested (general)', color: 'blue', description: 'Expressed interest without fixed time' },
  { value: 'follow_up', label: 'Follow up callback', color: 'amber', description: 'Prospect asked caller to call back later' },
  { value: 'call_again', label: 'Call again (line/language)', color: 'orange', description: 'Line dropped or language barrier' },
  { value: 'not_interested', label: 'Not interested', color: 'rose', description: 'Prospect politely or firmly declined' },
  { value: 'do_not_call', label: 'Do not call', color: 'red', description: 'Asked to be removed / hostile response' },
  { value: 'wrong_person', label: 'Wrong person', color: 'violet', description: 'Person reached not the relevant decision maker' },
  { value: 'moved_company', label: 'Moved company', color: 'purple', description: 'Prospect no longer works at company' },
  { value: 'not_logged', label: 'Not logged / Incomplete', color: 'slate', description: 'Call ended without explicit log' }
];
