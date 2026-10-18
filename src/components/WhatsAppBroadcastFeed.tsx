import React from 'react';
import { useApp } from '../context/AppContext';
import { Radio, X, MessageCircle, ExternalLink, Flame } from 'lucide-react';

interface BroadcastDrawerProps {
  onClose: () => void;
}

export const WhatsAppBroadcastFeed: React.FC<BroadcastDrawerProps> = ({ onClose }) => {
  const { broadcasts, properties, setSelectedRowId, setDetailDrawerProperty } = useApp();

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border-l border-slate-200 w-full max-w-md h-full shadow-2xl flex flex-col text-slate-800 animate-slideLeft">
        {/* Header */}
        <div className="bg-[#f8f9fa] px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#0f9d58] border border-emerald-200 flex items-center justify-center">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900">Live WhatsApp Broadcast Channel</h2>
              <p className="text-[11px] text-slate-500">
                Verified realtor listings broadcast in real-time
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

        {/* Feed List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1 text-xs">
          {broadcasts.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No recent WhatsApp broadcasts.
            </div>
          ) : (
            broadcasts.map((bc) => {
              const matchedProp = properties.find((p) => p.id === bc.propertyId);

              return (
                <div
                  key={bc.id}
                  onClick={() => {
                    if (matchedProp) {
                      setSelectedRowId(matchedProp.id);
                      setDetailDrawerProperty(matchedProp);
                      onClose();
                    }
                  }}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-[#0f9d58] shadow-2xs hover:shadow-sm transition-all cursor-pointer space-y-1.5 group"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#0f9d58] font-bold flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      WHATSAPP ALERT
                    </span>
                    <span className="text-slate-500">{bc.timestamp}</span>
                  </div>

                  <p className="text-slate-800 font-medium group-hover:text-[#0f9d58] transition-colors">
                    {bc.message}
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-mono pt-1">
                    <span className="text-slate-500">{bc.area}</span>
                    <span className="text-[#0f9d58] font-bold">{bc.priceFormatted}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="bg-[#f8f9fa] px-6 py-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between font-mono">
          <span>Connected: FastProp Broadcast API</span>
          <span className="text-[#0f9d58] font-bold">● Active</span>
        </div>
      </div>
    </div>
  );
};
