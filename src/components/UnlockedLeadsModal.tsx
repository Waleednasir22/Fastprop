import React from 'react';
import { useApp } from '../context/AppContext';
import { formatExactCurrency, formatPrice, generateWhatsAppLink } from '../utils/formatters';
import {
  Unlock,
  X,
  MessageCircle,
  Phone,
  Building,
  CheckCircle2,
  Calendar,
  ExternalLink,
} from 'lucide-react';

interface UnlockedLeadsModalProps {
  onClose: () => void;
}

export const UnlockedLeadsModal: React.FC<UnlockedLeadsModalProps> = ({ onClose }) => {
  const { transactions, currentUser, settings, properties } = useApp();

  const myLeads = transactions.filter((t) => t.buyerId === currentUser.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col text-slate-800 max-h-[85vh]">
        {/* Header */}
        <div className="bg-[#f8f9fa] px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#0f9d58] border border-emerald-200 flex items-center justify-center">
              <Unlock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900">My Unlocked Realtor Leads</h2>
              <p className="text-[11px] text-slate-500">
                Permanently unlocked seller WhatsApp numbers & transaction records
              </p>
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
        <div className="p-6 overflow-y-auto space-y-3">
          {myLeads.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Unlock className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-800">No unlocked leads yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Click "Unlock Contact (0.33%)" on any inventory row in the Sheets grid to connect directly with the verified seller.
              </p>
            </div>
          ) : (
            myLeads.map((lead) => {
              const liveProp = properties.find((p) => p.id === lead.propertyId);
              const demandPrice = liveProp ? liveProp.demandPrice : lead.propertyDemand;

              return (
                <div
                  key={lead.id}
                  className="bg-white p-4 rounded-xl border border-slate-200 hover:border-[#0f9d58] shadow-2xs hover:shadow-sm transition-all text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#0f9d58] font-bold">{lead.propertyId}</span>
                      <span className="font-bold text-slate-900">{lead.propertyTitle}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                      <span>{lead.propertyArea}</span>
                      <span>•</span>
                      <span>Demand: <strong className="text-[#0f9d58]">{formatPrice(demandPrice, settings)}</strong></span>
                      <span>•</span>
                      <span className="font-mono text-slate-500">Fee Paid: {formatExactCurrency(lead.feeAmountPaid, settings)}</span>
                    </div>

                    <div className="bg-emerald-50/60 px-2.5 py-1.5 rounded-lg border border-emerald-200 inline-flex items-center gap-2 mt-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0f9d58]" />
                      <span className="font-semibold text-slate-800">{lead.sellerName}</span>
                      <span className="font-mono text-[#0f9d58] font-bold">{lead.sellerPhone}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={generateWhatsAppLink(lead.sellerPhone, lead.propertyTitle, lead.propertyId, formatPrice(demandPrice, settings))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#0f9d58] hover:bg-[#0d8a4d] text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    <a
                      href={`tel:${lead.sellerPhone.replace(/\s+/g, '')}`}
                      className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 p-1.5 rounded-lg text-xs transition-colors shadow-2xs cursor-pointer"
                      title="Direct phone call"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
