const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000').replace(/\/$/, '');

export const api = {
  baseUrl: API_BASE_URL,

  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(4000) });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      return await res.json();
    } catch (err) {
      return { status: 'down', error: err.message };
    }
  },

  async fetchStages() {
    try {
      const res = await fetch(`${API_BASE_URL}/stages`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Could not fetch stages from backend, using local fallback:', err.message);
    }
    return null;
  },

  async startCall({ prospect_name, company }) {
    const res = await fetch(`${API_BASE_URL}/calls/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prospect_name, company })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to start call');
    }
    return await res.json();
  },

  async saveStageResult(callId, { stage_number, what_happened, prospect_words }) {
    const res = await fetch(`${API_BASE_URL}/calls/${callId}/stage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage_number, what_happened, prospect_words })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to save stage result');
    }
    return await res.json();
  },

  async closeCall(callId, payload) {
    const res = await fetch(`${API_BASE_URL}/calls/${callId}/close`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to close call');
    }
    return await res.json();
  },

  async fetchCalls() {
    const res = await fetch(`${API_BASE_URL}/calls`);
    if (!res.ok) throw new Error('Failed to fetch calls');
    return await res.json();
  },

  async fetchCallDetails(callId) {
    const res = await fetch(`${API_BASE_URL}/calls/${callId}`);
    if (!res.ok) throw new Error('Failed to fetch call details');
    return await res.json();
  }
};
