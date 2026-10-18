import React from 'react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/formatters';
import {
  Building2,
  X,
  Flame,
  Trash2,
  Eye,
  Unlock,
  AlertTriangle,
  PlusCircle,
} from 'lucide-react';

interface MyInventoryModalProps {
  onClose: () => void;
}

export const MyInventoryModal: React.FC<MyInventoryModalProps> = ({ onClose }) => {
  const {
    properties,
    currentUser,
    settings,
    boostProperty,
    deleteProperty,
    toggleSoldStatus,
    setAddPropertyModalOpen,
  } = useApp();

  const myProperties = properties.filter((p) => p.sellerId === currentUser.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col text-slate-800 max-h-[85vh]">
        {/* Header */}
        <div className="bg-[#f8f9fa] px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900">My Posted Inventory</h2>
              <p className="text-[11px] text-slate-500">
                Manage your real estate listings, track views, and monitor buyer leads
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                setAddPropertyModalOpen(true);
              }}
              className="bg-[#0f9d58] hover:bg-[#0d8a4d] text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Listing</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-3">
          {myProperties.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Building2 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-800">No properties posted yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Post your plots, houses, and commercial inventory directly to FastProp's live spreadsheet feed.
              </p>
              <button
                onClick={() => {
                  onClose();
                  setAddPropertyModalOpen(true);
                }}
                className="mt-4 px-4 py-2 bg-[#0f9d58] hover:bg-[#0d8a4d] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Post Your First Property
              </button>
            </div>
          ) : (
            myProperties.map((prop) => (
              <div
                key={prop.id}
                className="bg-white p-4 rounded-xl border border-slate-200 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs hover:border-slate-300 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[#0f9d58] font-bold">{prop.id}</span>
                    <span className="font-bold text-slate-900">{prop.title}</span>
                    {prop.isSold && (
                      <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200">
                        SOLD
                      </span>
                    )}
                    {prop.isShadowBanned && (
                      <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded border border-orange-200">
                        SHADOWBANNED
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-slate-500 text-[11px] font-mono">
                    <span>{prop.area}</span>
                    <span>•</span>
                    <span className="text-[#0f9d58] font-bold">
                      {formatPrice(prop.demandPrice, settings)}
                    </span>
                    <span>•</span>
                    <span>
                      {prop.sizeNumber} {prop.sizeUnit}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1 font-mono">
                    <span className="flex items-center gap-1 text-slate-700">
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <strong>{prop.clicksCount}</strong> views
                    </span>
                    <span className="flex items-center gap-1 text-[#0f9d58]">
                      <Unlock className="w-3.5 h-3.5" />
                      <strong>{prop.unlockedCount}</strong> buyer unlocks
                    </span>
                    <span className="text-amber-800 font-medium">{prop.hotBadge}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => boostProperty(prop.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold flex items-center gap-1 text-xs cursor-pointer shadow-2xs"
                    title="Simulate surge in clicks for HOT badge"
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-600" />
                    <span>Boost Views</span>
                  </button>

                  <button
                    onClick={() => toggleSoldStatus(prop.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold cursor-pointer shadow-2xs"
                  >
                    {prop.isSold ? 'Reactivate' : 'Mark as Sold'}
                  </button>

                  <button
                    onClick={() => deleteProperty(prop.id)}
                    className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 cursor-pointer"
                    title="Delete listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
