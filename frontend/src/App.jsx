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
  const [backendHealth, setBackendHealth] = useState({ status: 'ok' });
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);

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
      if (Array.isArray(data)) {
        setBackendHealth((prev) => ({ ...prev, status: 'ok' }));
      }
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

  const handleSaveAndNext = ({ stage_number, what_happened, prospect_words }) => {
    // 1. Instant optimistic state update (0ms lag!)
    const updated = {
      ...completedStages,
      [stage_number]: { what_happened, prospect_words }
    };
    setCompletedStages(updated);

    // 2. Advance stage or complete call immediately
    if (stage_number < stages.length) {
      setCurrentStageNumber(stage_number + 1);
    } else {
      setEndCallPreData({
        currentStageNumber: stage_number,
        currentOutcome: what_happened,
        currentWords: prospect_words
      });
      setIsEndModalOpen(true);
    }

    // 3. Persist to backend in background without blocking UI
    if (activeCall?.id && !activeCall.id.startsWith('local-')) {
      api.saveStageResult(activeCall.id, {
        stage_number,
        what_happened,
        prospect_words
      }).catch((err) => {
        console.warn('Could not persist stage to backend in background:', err);
      });
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
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      
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
      {backendHealth?.status === 'down' && !isBannerDismissed && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-800 flex items-center justify-between">
          <div className="max-w-4xl mx-auto w-full flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="font-medium">
                Render backend is spinning up from idle state. Ready for demo calls in seconds.
              </span>
            </div>
            <button
              onClick={() => setIsBannerDismissed(true)}
              className="text-amber-800 hover:text-black px-1.5 py-0.5 rounded text-[11px] font-bold"
              title="Dismiss notice"
            >
              ✕
            </button>
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
            <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-2xs">
                  <PhoneCall className="w-7 h-7" />
                </div>
                <div className="space-y-1.5">
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Start Live Cold Call
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Keep this companion screen open during your cold call. It guides you step-by-step through all 8 stages from Opening to Close.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => setIsStartModalOpen(true)}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-sm transition flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Start New Call</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('past')}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold border border-slate-200 transition"
                  >
                    View Past Calls ({callsList.length})
                  </button>
                </div>

                {/* Demo call quick button */}
                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      handleStartCall({
                        prospect_name: 'Mr. Dhanchand',
                        company: 'Dhanchand Chemicals'
                      });
                    }}
                    className="w-full text-xs font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 p-2.5 rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>1-Click Launch Video Demo: Mr. Dhanchand (T095)</span>
                  </button>
                </div>
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
