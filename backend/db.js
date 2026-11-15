import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_DB_PATH = path.join(__dirname, 'local_db.json');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey && !supabaseUrl.includes('your-supabase'));

let supabase = null;
if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('[DB] Connected to Supabase at:', supabaseUrl);
  } catch (err) {
    console.warn('[DB] Supabase initialization failed, falling back to local database:', err.message);
  }
} else {
  console.log('[DB] Supabase credentials not detected; using high-fidelity local store with seed calls.');
}

// Local DB Helper for fallback / local testing
function readLocalDB() {
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    const seedData = {
      calls: [
        {
          id: '11111111-1111-1111-1111-111111111111',
          prospect_name: 'Mr. Dhanchand',
          company: 'Dhanchand Chemicals',
          started_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
          ended_at: new Date(Date.now() - 2 * 3600 * 1000 + 282 * 1000).toISOString(),
          outcome: 'next_step_agreed',
          last_stage: 8,
          summary: 'Chemical job work manufacturer seeking new product expansion with existing facility; agreed to review tailored report on WhatsApp by Monday with follow-up call Wednesday.',
          created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
        },
        {
          id: '22222222-2222-2222-2222-222222222222',
          prospect_name: 'Dr. Anjali Menon',
          company: 'Menon Family Clinic',
          started_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
          ended_at: new Date(Date.now() - 4 * 3600 * 1000 + 134 * 1000).toISOString(),
          outcome: 'agreed_to_receive_report',
          last_stage: 7,
          summary: 'Clinic owner satisfied with current CA but agreed to receive one-page WhatsApp summary on compliance automation.',
          created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
        },
        {
          id: '33333333-3333-3333-3333-333333333333',
          prospect_name: 'Manpreet Singh',
          company: 'Novara Foods India',
          started_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
          ended_at: new Date(Date.now() - 6 * 3600 * 1000 + 34 * 1000).toISOString(),
          outcome: 'wrong_person',
          last_stage: 1,
          summary: 'Reached back-office subsidiary; prospect clarified all strategic growth and procurement decisions handled exclusively by US headquarters.',
          created_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString()
        },
        {
          id: '44444444-4444-4444-4444-444444444444',
          prospect_name: 'Leonard Sir',
          company: 'Orbit Automation',
          started_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
          ended_at: new Date(Date.now() - 24 * 3600 * 1000 + 54 * 1000).toISOString(),
          outcome: 'follow_up',
          last_stage: 3,
          summary: 'Early-stage automation startup CEO was in a client meeting; requested callback in 30 minutes.',
          created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
        }
      ],
      stage_results: [
        {
          id: crypto.randomUUID(),
          call_id: '11111111-1111-1111-1111-111111111111',
          stage_number: 1,
          what_happened: 'Connected with right person',
          prospect_words: 'Yes, this is Dhanchand.',
          created_at: new Date().toISOString()
        },
        {
          id: crypto.randomUUID(),
          call_id: '11111111-1111-1111-1111-111111111111',
          stage_number: 2,
          what_happened: 'Understood purpose & willing to listen',
          prospect_words: 'Regarding what? Yes, please go ahead.',
          created_at: new Date().toISOString()
        },
        {
          id: crypto.randomUUID(),
          call_id: '11111111-1111-1111-1111-111111111111',
          stage_number: 3,
          what_happened: 'Granted permission (go ahead)',
          prospect_words: 'Please. Yeah, please go ahead.',
          created_at: new Date().toISOString()
        },
        {
          id: crypto.randomUUID(),
          call_id: '11111111-1111-1111-1111-111111111111',
          stage_number: 4,
          what_happened: 'Clarified they are job work / domestic only',
          prospect_words: 'Review discipline? These are corporate words. We are a small-scale company.',
          created_at: new Date().toISOString()
        },
        {
          id: crypto.randomUUID(),
          call_id: '11111111-1111-1111-1111-111111111111',
          stage_number: 5,
          what_happened: 'Named specific bottleneck (margins / products / capacity)',
          prospect_words: 'We majorly work on job work. The margin is technically hardly any. Looking for people who can help me with new products with our facility.',
          created_at: new Date().toISOString()
        },
        {
          id: crypto.randomUUID(),
          call_id: '11111111-1111-1111-1111-111111111111',
          stage_number: 6,
          what_happened: 'Budget / cost objection (not spending money)',
          prospect_words: 'I do not want to spend any money on this, no. I will be very specific. What is your product?',
          created_at: new Date().toISOString()
        },
        {
          id: crypto.randomUUID(),
          call_id: '11111111-1111-1111-1111-111111111111',
          stage_number: 7,
          what_happened: 'Agreed to receive report on WhatsApp / email',
          prospect_words: 'Aap na mujhe bhej dijiye, let me first go through it. Can I call you on Wednesday? Yeah, aaram se.',
          created_at: new Date().toISOString()
        },
        {
          id: crypto.randomUUID(),
          call_id: '11111111-1111-1111-1111-111111111111',
          stage_number: 8,
          what_happened: 'Confirmed follow-up commitment & closed warmly',
          prospect_words: 'Yeah, aaram se, take your time. Done, thank you.',
          created_at: new Date().toISOString()
        }
      ]
    };
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(seedData, null, 2));
    return seedData;
  }
  return JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf-8'));
}

function writeLocalDB(data) {
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2));
}

export const db = {
  isSupabase: isSupabaseConfigured,

  async startCall({ prospect_name, company }) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('calls')
        .insert({
          prospect_name,
          company,
          started_at: new Date().toISOString(),
          last_stage: 1
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const local = readLocalDB();
    const newCall = {
      id: crypto.randomUUID(),
      prospect_name,
      company,
      started_at: new Date().toISOString(),
      ended_at: null,
      outcome: null,
      last_stage: 1,
      summary: null,
      created_at: new Date().toISOString()
    };
    local.calls.unshift(newCall);
    writeLocalDB(local);
    return newCall;
  },

  async saveStageResult({ call_id, stage_number, what_happened, prospect_words }) {
    const stageNum = parseInt(stage_number, 10);
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('stage_results')
        .upsert(
          {
            call_id,
            stage_number: stageNum,
            what_happened,
            prospect_words: prospect_words || '',
            created_at: new Date().toISOString()
          },
          { onConflict: 'call_id,stage_number' }
        )
        .select()
        .single();
      if (error) throw error;

      // Update call's last_stage if this stage is higher
      const { data: callData } = await supabase.from('calls').select('last_stage').eq('id', call_id).single();
      if (callData && stageNum > callData.last_stage) {
        await supabase.from('calls').update({ last_stage: stageNum }).eq('id', call_id);
      }

      return data;
    }

    const local = readLocalDB();
    const existingIndex = local.stage_results.findIndex(
      (s) => s.call_id === call_id && s.stage_number === stageNum
    );
    const stageItem = {
      id: existingIndex >= 0 ? local.stage_results[existingIndex].id : crypto.randomUUID(),
      call_id,
      stage_number: stageNum,
      what_happened,
      prospect_words: prospect_words || '',
      created_at: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      local.stage_results[existingIndex] = stageItem;
    } else {
      local.stage_results.push(stageItem);
    }

    const call = local.calls.find((c) => c.id === call_id);
    if (call && stageNum > (call.last_stage || 1)) {
      call.last_stage = stageNum;
    }

    writeLocalDB(local);
    return stageItem;
  },

  async closeCall({ call_id, outcome, ended_at, summary, last_stage }) {
    if (isSupabaseConfigured && supabase) {
      const updatePayload = {
        outcome,
        ended_at: ended_at || new Date().toISOString()
      };
      if (summary) updatePayload.summary = summary;
      if (last_stage) updatePayload.last_stage = last_stage;

      const { data, error } = await supabase
        .from('calls')
        .update(updatePayload)
        .eq('id', call_id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const local = readLocalDB();
    const call = local.calls.find((c) => c.id === call_id);
    if (!call) throw new Error('Call not found');

    call.outcome = outcome;
    call.ended_at = ended_at || new Date().toISOString();
    if (summary) call.summary = summary;
    if (last_stage) call.last_stage = last_stage;

    writeLocalDB(local);
    return call;
  },

  async getCalls() {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('calls')
        .select('*')
        .order('started_at', { ascending: false });
      if (error) throw error;
      return data;
    }

    const local = readLocalDB();
    return [...local.calls].sort((a, b) => new Date(b.started_at) - new Date(a.started_at));
  },

  async getCallById(id) {
    if (isSupabaseConfigured && supabase) {
      const { data: call, error: callError } = await supabase
        .from('calls')
        .select('*')
        .eq('id', id)
        .single();
      if (callError) throw callError;

      const { data: stages, error: stageError } = await supabase
        .from('stage_results')
        .select('*')
        .eq('call_id', id)
        .order('stage_number', { ascending: true });
      if (stageError) throw stageError;

      return { ...call, stages: stages || [] };
    }

    const local = readLocalDB();
    const call = local.calls.find((c) => c.id === id);
    if (!call) return null;
    const stages = local.stage_results
      .filter((s) => s.call_id === id)
      .sort((a, b) => a.stage_number - b.stage_number);
    return { ...call, stages };
  },

  async getStageResults(call_id) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('stage_results')
        .select('*')
        .eq('call_id', call_id)
        .order('stage_number', { ascending: true });
      if (error) throw error;
      return data || [];
    }

    const local = readLocalDB();
    return local.stage_results
      .filter((s) => s.call_id === call_id)
      .sort((a, b) => a.stage_number - b.stage_number);
  }
};
