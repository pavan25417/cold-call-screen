import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './db.js';
import { generateCallSummary } from './llm.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Load 8 stages metadata
const stagesFilePath = path.join(__dirname, '..', 'data', 'stages_data.json');
let stagesData = [];
try {
  if (fs.existsSync(stagesFilePath)) {
    stagesData = JSON.parse(fs.readFileSync(stagesFilePath, 'utf-8'));
  }
} catch (err) {
  console.warn('[Server] Could not load stages_data.json from file:', err.message);
}

// 1. Health check endpoint (Required by Render & Task Spec)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'cold-call-companion-backend',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: db.isSupabase ? 'supabase' : 'local-store',
    gemini_configured: Boolean(process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('your-gemini'))
  });
});

// 2. Stages definition endpoint
app.get('/stages', (req, res) => {
  res.json(stagesData);
});

// 3. Start a new cold call
// POST /calls/start
// Body: { prospect_name, company }
app.post('/calls/start', async (req, res) => {
  try {
    const { prospect_name, company } = req.body;
    if (!prospect_name || !company) {
      return res.status(400).json({ error: 'prospect_name and company are required' });
    }

    const newCall = await db.startCall({
      prospect_name: prospect_name.trim(),
      company: company.trim()
    });

    console.log(`[Call Started] ID: ${newCall.id} | Prospect: ${newCall.prospect_name} (${newCall.company})`);
    return res.status(201).json(newCall);
  } catch (err) {
    console.error('[Error in /calls/start]:', err);
    res.status(500).json({ error: err.message || 'Failed to start call' });
  }
});

// 4. Save a stage result
// POST /calls/:id/stage
// Body: { stage_number, what_happened, prospect_words }
app.post('/calls/:id/stage', async (req, res) => {
  try {
    const { id } = req.params;
    const { stage_number, what_happened, prospect_words } = req.body;

    if (!stage_number || !what_happened) {
      return res.status(400).json({ error: 'stage_number and what_happened are required' });
    }

    const savedStage = await db.saveStageResult({
      call_id: id,
      stage_number: parseInt(stage_number, 10),
      what_happened: what_happened.trim(),
      prospect_words: (prospect_words || '').trim()
    });

    console.log(`[Stage Logged] Call: ${id} | Stage: ${stage_number} | Outcome: ${what_happened}`);
    return res.status(200).json(savedStage);
  } catch (err) {
    console.error(`[Error in /calls/${req.params.id}/stage]:`, err);
    res.status(500).json({ error: err.message || 'Failed to save stage result' });
  }
});

// 5. Close a cold call
// POST /calls/:id/close
// Body: { outcome, ended_at, final_stage_number, what_happened, prospect_words }
app.post('/calls/:id/close', async (req, res) => {
  try {
    const { id } = req.params;
    const { outcome, ended_at, final_stage_number, what_happened, prospect_words } = req.body;

    if (!outcome) {
      return res.status(400).json({ error: 'outcome is required to close a call' });
    }

    // Save final stage if provided
    if (final_stage_number && what_happened) {
      await db.saveStageResult({
        call_id: id,
        stage_number: parseInt(final_stage_number, 10),
        what_happened: what_happened.trim(),
        prospect_words: (prospect_words || '').trim()
      });
    }

    // Fetch existing call and all stage results
    const call = await db.getCallById(id);
    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    const stages = await db.getStageResults(id);
    const lastStage = Math.max(
      call.last_stage || 1,
      final_stage_number ? parseInt(final_stage_number, 10) : 1,
      ...(stages.map((s) => s.stage_number) || [1])
    );

    // Auto-generate high value 1-line summary using LLM (Gemini)
    console.log(`[LLM Generating Summary] Call: ${id} | Outcome: ${outcome} | Last Stage: ${lastStage}`);
    const summary = await generateCallSummary({
      prospect_name: call.prospect_name,
      company: call.company,
      outcome,
      last_stage: lastStage,
      stages
    });

    // Close call in database
    const updatedCall = await db.closeCall({
      call_id: id,
      outcome,
      ended_at: ended_at || new Date().toISOString(),
      summary,
      last_stage: lastStage
    });

    console.log(`[Call Closed] ID: ${id} | Summary: "${summary}"`);
    return res.status(200).json({
      message: 'Call closed successfully',
      call: updatedCall,
      summary
    });
  } catch (err) {
    console.error(`[Error in /calls/${req.params.id}/close]:`, err);
    res.status(500).json({ error: err.message || 'Failed to close call' });
  }
});

// 6. Get all calls (past calls list)
// GET /calls
app.get('/calls', async (req, res) => {
  try {
    const calls = await db.getCalls();
    return res.status(200).json(calls);
  } catch (err) {
    console.error('[Error in /calls]:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch calls' });
  }
});

// 7. Get single call details with stages
// GET /calls/:id
app.get('/calls/:id', async (req, res) => {
  try {
    const call = await db.getCallById(req.params.id);
    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }
    return res.status(200).json(call);
  } catch (err) {
    console.error(`[Error in /calls/${req.params.id}]:`, err);
    res.status(500).json({ error: err.message || 'Failed to fetch call details' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Cold Call Backend running on http://localhost:${PORT}`);
  console.log(`🩺 Health check URL: http://localhost:${PORT}/health`);
  console.log(`=======================================================`);
});
