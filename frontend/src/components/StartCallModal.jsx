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
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-6 shadow-xl relative space-y-5 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-2xs">
              <PhoneCall className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Start New Cold Call</h3>
              <p className="text-xs text-slate-500 font-medium">Screen 1 companion will guide you through all 8 stages</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Demo Fill Options */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Fast Demo Setup (For 6-Min Video)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handlePreFillDemoT095}
              className="p-3 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200 text-left transition text-xs shadow-2xs"
            >
              <div className="font-extrabold text-emerald-900 flex items-center justify-between">
                <span>Transcript T095</span>
                <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900">Recommended</span>
              </div>
              <p className="text-xs text-slate-900 mt-1 font-bold">Mr. Dhanchand</p>
              <p className="text-[11px] text-slate-500 font-medium">Dhanchand Chemicals</p>
            </button>

            <button
              type="button"
              onClick={handlePreFillDemoClinic}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition text-xs shadow-2xs"
            >
              <div className="font-bold text-slate-700">Reference Screen</div>
              <p className="text-xs text-slate-900 mt-1 font-bold">Dr. Anjali Menon</p>
              <p className="text-[11px] text-slate-500 font-medium">Menon Family Clinic</p>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Prospect Name</span>
            </label>
            <input
              type="text"
              value={prospectName}
              onChange={(e) => setProspectName(e.target.value)}
              placeholder="e.g. Mr. Dhanchand or Dev ji"
              required
              className="w-full bg-slate-50/60 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>Company Name</span>
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Dhanchand Chemicals"
              required
              className="w-full bg-slate-50/60 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition font-medium"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isStarting}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm disabled:opacity-50"
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
