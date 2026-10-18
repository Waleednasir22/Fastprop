import React from 'react';
import { PropertyListing } from '../types';
import { useApp } from '../context/AppContext';
import {
  formatPrice,
  formatExactCurrency,
  maskPhone,
  maskSellerName,
  calculateLeadFee,
  generateWhatsAppLink,
} from '../utils/formatters';
import {
  X,
  MapPin,
  Building,
  Flame,
  Zap,
  Lock,
  Unlock,
  MessageCircle,
  Phone,
  Flag,
  Eye,
  CheckCircle2,
  Share2,
  Copy,
} from 'lucide-react';

interface DetailDrawerProps {
  property: PropertyListing | null;
  onClose: () => void;
}

export const PropertyDetailDrawer: React.FC<DetailDrawerProps> = ({ property, onClose }) => {
  const {
    currentUser,
    settings,
    isLeadUnlocked,
    setAuthModalOpen,
    setUnlockModalProperty,
    setReportModalProperty,
    setLatestAlert,
  } = useApp();

  if (!property) return null;

  const unlocked = isLeadUnlocked(property.id);
  const feeData = calculateLeadFee(property.demandPrice, settings);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setLatestAlert(`Copied listing link for ${property.id} to clipboard!`);
    setTimeout(() => setLatestAlert(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border-l border-slate-200 w-full max-w-lg h-full shadow-2xl flex flex-col text-slate-800 animate-slideLeft">
        {/* Header */}
        <div className="bg-[#f8f9fa] px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs bg-emerald-50 text-[#0f9d58] font-bold px-2 py-0.5 rounded border border-emerald-200">
              {property.id}
            </span>
            <span className="text-xs text-slate-500 font-mono font-medium">CELL DETAILS</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors"
              title="Copy share link"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {/* Status Badge & Title */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {property.hotBadge === '🔥 HOT PROPERTY' ? (
                <span className="bg-amber-50 text-amber-900 border border-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-600" /> HOT PROPERTY
                </span>
              ) : property.hotBadge === '⚡ ON DEMAND' ? (
                <span className="bg-blue-50 text-blue-900 border border-blue-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-blue-600" /> ON DEMAND
                </span>
              ) : (
                <span className="bg-slate-100 text-slate-600 text-[10px] px-2.5 py-0.5 rounded-full font-mono">
                  Standard Listing
                </span>
              )}

              <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                {property.clicksCount} Views in 24h
              </span>
            </div>

            <h1 className="text-base font-bold text-slate-900 leading-snug">{property.title}</h1>

            <div className="flex items-center gap-1.5 text-slate-500 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#0f9d58] shrink-0" />
              <span className="text-slate-800 font-semibold">{property.area}</span>
              <span>•</span>
              <span>{property.city}</span>
            </div>
          </div>

          {/* Pricing Highlight Card */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-500 block font-semibold">Total Selling Demand</span>
            <div className="text-2xl font-black font-mono text-[#0f9d58]">
              {formatPrice(property.demandPrice, settings)}
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Exact: {formatExactCurrency(property.demandPrice, settings)}
            </div>
          </div>

          {/* Specification Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-mono font-semibold">Property Type</span>
              <span className="font-semibold text-slate-900">{property.type}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-mono font-semibold">Inventory Size</span>
              <span className="font-semibold text-slate-900 font-mono">
                {property.sizeNumber} {property.sizeUnit}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-mono font-semibold">Seller ID</span>
              <span className="font-mono text-slate-800 font-bold">{property.sellerHashId}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-mono font-semibold">Listing Status</span>
              <span className="font-semibold text-[#0f9d58]">
                {property.isSold ? 'Sold' : 'Active & Verified'}
              </span>
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div>
              <span className="text-[11px] font-bold text-slate-700 block mb-1">Seller Notes:</span>
              <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                {property.description}
              </p>
            </div>
          )}

          {/* Features */}
          <div>
            <span className="text-[11px] font-bold text-slate-700 block mb-1.5">Property Attributes:</span>
            <div className="flex flex-wrap gap-1.5">
              {property.features.map((f) => (
                <span
                  key={f}
                  className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-[11px] border border-slate-200"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Contact & Unlock Panel */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
              Contact & Lead Credentials
            </span>

            {unlocked ? (
              <div className="space-y-3">
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-[#0f9d58] font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Lead Verified & Unlocked</span>
                  </div>
                  <div className="text-slate-900 font-semibold">{property.sellerName}</div>
                  <div className="text-[#0f9d58] font-mono font-bold text-sm">
                    {property.sellerPhone}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={generateWhatsAppLink(
                      property.sellerPhone,
                      property.title,
                      property.id,
                      formatPrice(property.demandPrice, settings)
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-[#0f9d58] hover:bg-[#0d8a4d] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={`tel:${property.sellerPhone.replace(/\s+/g, '')}`}
                    className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-300 shadow-2xs"
                  >
                    <Phone className="w-4 h-4 text-[#0f9d58]" />
                    <span>Call Phone</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between shadow-2xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-mono font-semibold">
                      Seller Details (Locked)
                    </span>
                    <span className="text-slate-800 font-semibold">
                      {maskSellerName(property.sellerName)}
                    </span>
                    <span className="font-mono text-slate-400 text-xs block blur-[2px]">
                      {maskPhone(property.sellerPhone)}
                    </span>
                  </div>
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 px-1">
                  <span>Pay-Per-Lead Fee (0.33%):</span>
                  <span className="text-[#0f9d58] font-bold">
                    {formatExactCurrency(feeData.finalFee, settings)}
                  </span>
                </div>

                <button
                  onClick={() => {
                    if (currentUser.role === 'guest') setAuthModalOpen(true);
                    else setUnlockModalProperty(property);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#0f9d58] hover:bg-[#0d8a4d] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Unlock Verified Contact ({formatExactCurrency(feeData.finalFee, settings)})</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#f8f9fa] px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs">
          <button
            onClick={() => setReportModalProperty(property)}
            className="flex items-center gap-1.5 text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Report / Flag (3-Strike System)</span>
          </button>

          <span className="text-slate-400 font-mono text-[10px]">
            FastProp Real Estate Terminal
          </span>
        </div>
      </div>
    </div>
  );
};
