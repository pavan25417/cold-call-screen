import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white border border-zinc-200 w-full max-w-md rounded-xl p-6 shadow-xl relative space-y-5 text-zinc-900">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-zinc-900 tracking-tight">
              Start new cold call
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Screen 1 companion will guide you through all 8 stages.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 transition p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Demo Fast Fill */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
            Quick demo presets:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handlePreFillDemoT095}
              className="p-2.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-left transition text-xs"
            >
              <div className="font-bold text-zinc-900 flex items-center justify-between">
                <span>Transcript T095</span>
                <span className="text-[9px] font-semibold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">Demo</span>
              </div>
              <p className="text-xs text-zinc-900 mt-0.5 font-medium">Mr. Dhanchand</p>
              <p className="text-[11px] text-zinc-500">Dhanchand Chemicals</p>
            </button>

            <button
              type="button"
              onClick={handlePreFillDemoClinic}
              className="p-2.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-left transition text-xs"
            >
              <div className="font-bold text-zinc-900">Reference clinic</div>
              <p className="text-xs text-zinc-900 mt-0.5 font-medium">Dr. Anjali Menon</p>
              <p className="text-[11px] text-zinc-500">Menon Family Clinic</p>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-700 block">
              Prospect name
            </label>
            <input
              type="text"
              value={prospectName}
              onChange={(e) => setProspectName(e.target.value)}
              placeholder="e.g. Mr. Dhanchand"
              required
              className="w-full bg-white border border-zinc-300 focus:border-zinc-900 focus:outline-none rounded-lg px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 font-medium transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-700 block">
              Company
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Dhanchand Chemicals"
              required
              className="w-full bg-white border border-zinc-300 focus:border-zinc-900 focus:outline-none rounded-lg px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 font-medium transition"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isStarting}
              className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <span>{isStarting ? 'Starting call...' : 'Open call screen'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
