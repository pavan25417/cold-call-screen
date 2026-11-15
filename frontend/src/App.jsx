import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header.jsx';
import StageNav from './components/StageNav.jsx';
import LiveCallScreen from './components/LiveCallScreen.jsx';
import PastCallsScreen from './components/PastCallsScreen.jsx';
import StartCallModal from './components/StartCallModal.jsx';
import EndCallModal from './components/EndCallModal.jsx';
import { STAGES } from './stagesData.js';
import { api } from './api.js';
import { PhoneCall, Play, Sparkles, AlertCircle } from 'lucide-react';

export default function App() {
  const [stages, setStages] = useState(STAGES);
  const [activeTab, setActiveTab] = useState('live');
  const [activeCall, setActiveCall] = useState(null);
  const [currentStageNumber, setCurrentStageNumber] = useState(1);
  const [completedStages, setCompletedStages] = useState({});
  const [callDuration, setCallDuration] = useState(0);

  const [callsList, setCallsList] = useState([]);
  const [isLoadingCalls, setIsLoadingCalls] = useState(false);
  const [backendHealth, setBackendHealth] = useState({ status: 'checking' });

  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const [endCallPreData, setEndCallPreData] = useState(null);

  const timerRef = useRef(null);

  // Poll backend health and fetch calls on mount
  useEffect(() => {
    checkHealth();
    loadCalls();

    const healthInterval = setInterval(checkHealth, 30000);
    return () => clearInterval(healthInterval);
  }, []);

  // Timer logic for active call
  useEffect(() => {
    if (activeCall) {
      setCallDuration(0);
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeCall?.id]);

  const checkHealth = async () => {
    const health = await api.checkHealth();
    setBackendHealth(health);
  };

  const loadCalls = async () => {
    setIsLoadingCalls(true);
    try {
      const data = await api.fetchCalls();
      setCallsList(data);
    } catch (err) {
      console.warn('Failed to load calls list from backend:', err);
    } finally {
      setIsLoadingCalls(false);
    }
  };

  const handleStartCall = async ({ prospect_name, company }) => {
    try {
      const newCall = await api.startCall({ prospect_name, company });
      setActiveCall(newCall);
      setCurrentStageNumber(1);
      setCompletedStages({});
      setActiveTab('live');
    } catch (err) {
      console.error('Failed to start call via API, running local session:', err);
      // Fallback local session if backend offline
      const localCall = {
        id: 'local-' + Date.now(),
        prospect_name,
        company,
        started_at: new Date().toISOString(),
        last_stage: 1
      };
      setActiveCall(localCall);
      setCurrentStageNumber(1);
      setCompletedStages({});
      setActiveTab('live');
    }
  };

  const handleSaveAndNext = async ({ stage_number, what_happened, prospect_words }) => {
    // 1. Update state locally
    const updated = {
      ...completedStages,
      [stage_number]: { what_happened, prospect_words }
    };
    setCompletedStages(updated);

    // 2. Persist to backend if active call has ID
    if (activeCall?.id && !activeCall.id.startsWith('local-')) {
      try {
        await api.saveStageResult(activeCall.id, {
          stage_number,
          what_happened,
          prospect_words
        });
      } catch (err) {
        console.warn('Could not persist stage to backend:', err);
      }
    }

    // 3. Move to next stage or trigger end call modal if at stage 8
    if (stage_number < stages.length) {
      setCurrentStageNumber(stage_number + 1);
    } else {
      setEndCallPreData({
        currentStageNumber: stage_number,
        currentOutcome: what_happened,
        currentWords: prospectWords
      });
      setIsEndModalOpen(true);
    }
  };

  const handlePrevStage = () => {
    if (currentStageNumber > 1) {
      setCurrentStageNumber(currentStageNumber - 1);
    }
  };

  const handleOpenEndCall = (data) => {
    setEndCallPreData(data);
    setIsEndModalOpen(true);
  };

  const handleConfirmClose = async (payload) => {
    let result = null;
    if (activeCall?.id && !activeCall.id.startsWith('local-')) {
      result = await api.closeCall(activeCall.id, payload);
    } else {
      // Local fallback closure
      result = {
        message: 'Call closed locally',
        call: {
          ...activeCall,
          outcome: payload.outcome,
          last_stage: payload.final_stage_number,
          ended_at: new Date().toISOString()
        },
        summary: `${activeCall?.prospect_name} at ${activeCall?.company} reached stage ${payload.final_stage_number}; outcome: ${payload.outcome}.`
      };
    }
    await loadCalls();
    return result;
  };

  const handleCloseModalDismiss = (action) => {
    setIsEndModalOpen(false);
    setEndCallPreData(null);
    setActiveCall(null);
    setCompletedStages({});
    if (action === 'view_past') {
      setActiveTab('past');
    } else if (action === 'new_call') {
      setIsStartModalOpen(true);
    }
  };

  const handleViewCallDetails = async (callId) => {
    return await api.fetchCallDetails(callId);
  };

  const currentStage = stages.find((s) => s.stage_number === currentStageNumber);
  const currentSavedStageData = completedStages[currentStageNumber];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Header */}
      <Header
        activeCall={activeCall}
        callDuration={callDuration}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendHealth={backendHealth}
        onWakeBackend={checkHealth}
        onStartNewCall={() => setIsStartModalOpen(true)}
        callsCount={callsList.length}
      />

      {/* Render Alert when sleeping (Free Tier UX) */}
      {backendHealth?.status !== 'ok' && (
        <div className="bg-amber-950/40 border-b border-amber-800/40 px-4 py-2 text-xs text-amber-300 flex items-center justify-between">
          <div className="max-w-4xl mx-auto w-full flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Render backend is spinning up from idle state. Ready for demo calls in seconds.
            </span>
          </div>
        </div>
      )}

      {/* Stage Stepper (When on Live Tab and on active call) */}
      {activeTab === 'live' && activeCall && (
        <StageNav
          stages={stages}
          currentStageNumber={currentStageNumber}
          completedStages={completedStages}
          onSelectStage={(num) => setCurrentStageNumber(num)}
        />
      )}

      {/* Body Content */}
      <main className="flex-1 pb-16">
        {activeTab === 'live' ? (
          activeCall ? (
            <LiveCallScreen
              activeCall={activeCall}
              currentStage={currentStage}
              stages={stages}
              savedStageData={currentSavedStageData}
              onSaveAndNext={handleSaveAndNext}
              onPrevStage={handlePrevStage}
              onEndCall={handleOpenEndCall}
            />
          ) : (
            /* Empty State: Prompt Caller to Start Call */
            <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <PhoneCall className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  Ready for your next cold call?
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Keep this companion screen open during the call. It will guide you through all 8 stages: Opening → Purpose → Permission → Business → Need → Objection → Next step → Close.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setIsStartModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-950/40 transition flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Cold Call</span>
                </button>
                <button
                  onClick={() => setActiveTab('past')}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm font-semibold border border-slate-800 transition"
                >
                  View Past Calls ({callsList.length})
                </button>
              </div>

              {/* Demo call quick button */}
              <div className="pt-6 border-t border-slate-900">
                <button
                  onClick={() => {
                    handleStartCall({
                      prospect_name: 'Mr. Dhanchand',
                      company: 'Dhanchand Chemicals'
                    });
                  }}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1.5 p-2 rounded-lg hover:bg-emerald-950/30 transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>1-Click Launch Video Demo: Mr. Dhanchand (T095)</span>
                </button>
              </div>
            </div>
          )
        ) : (
          /* Past Calls Screen */
          <PastCallsScreen
            calls={callsList}
            onRefresh={loadCalls}
            isLoading={isLoadingCalls}
            onViewCallDetails={handleViewCallDetails}
          />
        )}
      </main>

      {/* Start Call Modal */}
      <StartCallModal
        isOpen={isStartModalOpen}
        onClose={() => setIsStartModalOpen(false)}
        onStartCall={handleStartCall}
      />

      {/* End Call Modal */}
      <EndCallModal
        isOpen={isEndModalOpen}
        onClose={handleCloseModalDismiss}
        activeCall={activeCall}
        currentStageNumber={endCallPreData?.currentStageNumber || currentStageNumber}
        currentOutcome={endCallPreData?.currentOutcome}
        currentWords={endCallPreData?.currentWords}
        onConfirmClose={handleConfirmClose}
      />

    </div>
  );
}
