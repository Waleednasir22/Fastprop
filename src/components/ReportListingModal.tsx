import React, { useState } from 'react';
import { PropertyListing, ReportItem } from '../types';
import { useApp } from '../context/AppContext';
import {
  Flag,
  AlertTriangle,
  X,
  ShieldCheck,
  CheckCircle2,
  FileWarning,
} from 'lucide-react';

interface ReportModalProps {
  property: PropertyListing | null;
  onClose: () => void;
}

const REASONS: ReportItem['reason'][] = [
  'Fake / Wrong Price Listed',
  'Seller Not Responding / Misbehavior',
  'Already Sold Out',
  'Misrepresented Property Details',
];

export const ReportListingModal: React.FC<ReportModalProps> = ({ property, onClose }) => {
  const { submitReport, currentUser } = useApp();

  const [selectedReason, setSelectedReason] = useState<ReportItem['reason']>(
    'Fake / Wrong Price Listed'
  );
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!property) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport(property.id, selectedReason, details.trim() || 'Reported via fast anti-fraud flag');
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col text-slate-800">
        {/* Header */}
        <div className="bg-[#f8f9fa] px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 border border-red-200 flex items-center justify-center">
              <Flag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900">Report Listing (3-Strike Policy)</h2>
              <p className="text-[11px] text-slate-500 font-mono">ID: {property.id}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#0f9d58] border border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Report Received</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Thank you for protecting FastProp. Our compliance desk has routed this to the moderation queue.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* 3-Strike Explainer Card */}
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 space-y-1.5 text-[11px] text-amber-900">
                <div className="flex items-center gap-1.5 text-amber-800 font-bold uppercase tracking-wider text-[10px]">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>FastProp 3-Strike Penalty Rule</span>
                </div>
                <div className="grid grid-cols-3 gap-1 pt-1 font-mono text-[10px] text-center">
                  <div className="bg-white border border-amber-300 p-1.5 rounded text-amber-800 shadow-2xs">
                    <span className="block font-bold">STRIKE 1</span>
                    <span className="text-[9px] text-slate-500">Warning</span>
                  </div>
                  <div className="bg-white border border-orange-300 p-1.5 rounded text-orange-800 shadow-2xs">
                    <span className="block font-bold">STRIKE 2</span>
                    <span className="text-[9px] text-slate-500">Shadow-ban</span>
                  </div>
                  <div className="bg-white border border-red-300 p-1.5 rounded text-red-800 shadow-2xs">
                    <span className="block font-bold">STRIKE 3</span>
                    <span className="text-[9px] text-slate-500">Permaban</span>
                  </div>
                </div>
              </div>

              {/* Target Property */}
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Reported Listing:</span>
                <span className="font-bold text-slate-900">{property.title}</span>
                <span className="text-slate-500 block text-[11px] mt-0.5">
                  Seller: {property.sellerHashId} ({property.sellerName})
                </span>
              </div>

              {/* Reason Selector */}
              <div>
                <label className="text-[11px] text-slate-700 font-bold block mb-1.5">
                  Violation Category:
                </label>
                <div className="space-y-1.5">
                  {REASONS.map((r) => (
                    <label
                      key={r}
                      className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${
                        selectedReason === r
                          ? 'bg-red-50 border-red-300 text-red-950 font-medium'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="reportReason"
                        checked={selectedReason === r}
                        onChange={() => setSelectedReason(r)}
                        className="accent-red-600"
                      />
                      <span>{r}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Details Textarea */}
              <div>
                <label className="text-[11px] text-slate-700 font-bold block mb-1">
                  Evidence / Specific Details (Optional):
                </label>
                <textarea
                  rows={2}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="e.g. Demanded 2.5 Crore on phone call instead of 2.1 Crore listed, or unreachable after multiple attempts."
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500 text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-medium border border-slate-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-md cursor-pointer"
                >
                  Submit Flag to Admin
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
