import React, { useState } from 'react';
import { PhoneCall, Sparkles, X, User, Building, ArrowRight, Zap } from 'lucide-react';

export default function StartCallModal({ isOpen, onClose, onStartCall }) {
  const [prospectName, setProspectName] = useState('');
  const [company, setCompany] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prospectName.trim() || !company.trim()) {
      alert('Please enter both prospect name and company.');
      return;
    }
    setIsStarting(true);
    try {
      await onStartCall({
        prospect_name: prospectName.trim(),
        company: company.trim()
      });
      onClose();
    } catch (err) {
      alert(`Error starting call: ${err.message}`);
    } finally {
      setIsStarting(false);
    }
  };

  const handlePreFillDemoT095 = () => {
    setProspectName('Mr. Dhanchand');
    setCompany('Dhanchand Chemicals');
  };

  const handlePreFillDemoClinic = () => {
    setProspectName('Dr. Anjali Menon');
    setCompany('Menon Family Clinic');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Start New Cold Call</h3>
              <p className="text-xs text-slate-400">Screen 1 companion will guide you through all 8 stages</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Demo Fill Options */}
        <div className="space-y-2">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Fast Demo Setup (For 6-Min Video)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handlePreFillDemoT095}
              className="p-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/30 text-left transition text-xs"
            >
              <div className="font-bold text-emerald-300 flex items-center justify-between">
                <span>Transcript T095</span>
                <span className="text-[10px] font-mono px-1 rounded bg-emerald-500/20">Recommended</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 font-medium">Mr. Dhanchand</p>
              <p className="text-[10px] text-slate-500">Dhanchand Chemicals</p>
            </button>

            <button
              type="button"
              onClick={handlePreFillDemoClinic}
              className="p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 text-left transition text-xs"
            >
              <div className="font-bold text-slate-300">Reference Screen</div>
              <p className="text-[11px] text-slate-300 mt-0.5 font-medium">Dr. Anjali Menon</p>
              <p className="text-[10px] text-slate-500">Menon Family Clinic</p>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Prospect Name</span>
            </label>
            <input
              type="text"
              value={prospectName}
              onChange={(e) => setProspectName(e.target.value)}
              placeholder="e.g. Mr. Dhanchand or Dev ji"
              required
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-500" />
              <span>Company Name</span>
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Dhanchand Chemicals"
              required
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isStarting}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-950/40 disabled:opacity-50"
            >
              <span>{isStarting ? 'Starting Call...' : 'Open Call Screen'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
