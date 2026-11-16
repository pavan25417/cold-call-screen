import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;

if (apiKey && !apiKey.includes('your-gemini-key')) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log('[LLM] Google Gemini initialized successfully.');
  } catch (err) {
    console.warn('[LLM] Failed to initialize GoogleGenerativeAI:', err.message);
  }
} else {
  console.log('[LLM] GEMINI_API_KEY not configured; will use smart synthesis fallback.');
}

/**
 * Generate a single punchy sentence summarizing the cold call.
 * Takes prospect info, recorded stage answers, what happened, and final outcome.
 */
export async function generateCallSummary({ prospect_name, company, outcome, last_stage, stages }) {
  // Build a concise text representation of the call's stages
  const stagesSummary = (stages || [])
    .map((s) => `Stage ${s.stage_number}: ${s.what_happened}${s.prospect_words ? ` | Words: "${s.prospect_words}"` : ''}`)
    .join('\n');

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 80
        }
      });

      const prompt = `You are an AI assistant for B2B cold callers selling operational & growth analysis to Indian business leaders.
Synthesize this cold call into exactly ONE single, factual, high-density summary sentence (maximum 22 words).
Do NOT include markdown, bullet points, introductory phrases (like "In this call..."), or quotation marks around the entire sentence.

Prospect: ${prospect_name}
Company: ${company}
Outcome logged: ${outcome}
Last stage reached: ${last_stage} of 8
Call notes:
${stagesSummary || 'No specific stage notes recorded.'}

Required structure of the one sentence:
[Prospect business context / specific bottleneck] + [Constraint or objection] + [Agreed next step or terminal state].
`;

      const result = await model.generateContent(prompt);
      const text = result?.response?.text()?.trim();
      if (text) {
        // Strip any wrapping quotes or newlines
        return text.replace(/^["']|["']$/g, '').replace(/\n+/g, ' ');
      }
    } catch (err) {
      console.error('[LLM] Gemini generation error, using fallback:', err.message);
    }
  }

  // Smart fallback when Gemini is unavailable or key not set
  return generateFallbackSummary({ prospect_name, company, outcome, last_stage, stages });
}

function generateFallbackSummary({ prospect_name, company, outcome, last_stage, stages }) {
  const stage5 = stages?.find((s) => s.stage_number === 5);
  const stage6 = stages?.find((s) => s.stage_number === 6);
  const stage7 = stages?.find((s) => s.stage_number === 7);
  const stage1 = stages?.find((s) => s.stage_number === 1);

  if (outcome === 'wrong_person' || last_stage === 1) {
    const words = stage1?.prospect_words ? ` ("${stage1.prospect_words}")` : '';
    return `${prospect_name} at ${company} was not the relevant decision maker${words}; call terminated at opening.`;
  }

  if (outcome === 'next_step_agreed' || outcome === 'agreed_to_receive_report') {
    const needText = stage5?.prospect_words
      ? `focused on ${stage5.prospect_words.slice(0, 50)}...`
      : 'interested in operational growth insights';
    const nextStepText = stage7?.prospect_words
      ? `agreed: ${stage7.prospect_words}`
      : 'agreed to receive report and schedule follow-up.';
    return `${prospect_name} (${company}) ${needText}; ${nextStepText}`;
  }

  if (outcome === 'follow_up' || outcome === 'call_again') {
    const reason = stage1?.prospect_words || stage6?.prospect_words || 'prospect was busy';
    return `${prospect_name} (${company}) requested callback later: "${reason}".`;
  }

  if (outcome === 'not_interested' || outcome === 'do_not_call') {
    const objection = stage6?.prospect_words || stage6?.what_happened || 'not interested at this time';
    return `${prospect_name} (${company}) declined further discussion: "${objection}".`;
  }

  return `Call with ${prospect_name} at ${company} reached Stage ${last_stage} with outcome ${outcome}.`;
}
