import React, { useEffect } from 'react';
import { PropertyListing } from '../types';
import { useApp } from '../context/AppContext';
import {
  formatPrice,
  formatExactCurrency,
  maskPhone,
  maskSellerName,
  generateWhatsAppLink,
} from '../utils/formatters';
import {
  Flame,
  Zap,
  Lock,
  Unlock,
  MessageCircle,
  Phone,
  Flag,
  Eye,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';

interface ExcelGridProps {
  properties: PropertyListing[];
  viewMode: 'dense' | 'comfortable';
}

export const ExcelGrid: React.FC<ExcelGridProps> = ({ properties, viewMode }) => {
  const {
    currentUser,
    settings,
    selectedRowId,
    setSelectedRowId,
    selectedCol,
    setSelectedCol,
    setAuthModalOpen,
    setUnlockModalProperty,
    setReportModalProperty,
    setDetailDrawerProperty,
    isLeadUnlocked,
    recordPropertyClick,
  } = useApp();

  // Keyboard Navigation for true Google Sheets desktop feel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (!properties.length) return;

      const currentIndex = properties.findIndex((p) => p.id === selectedRowId);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = currentIndex < properties.length - 1 ? currentIndex + 1 : 0;
        setSelectedRowId(properties[nextIndex].id);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : properties.length - 1;
        setSelectedRowId(properties[prevIndex].id);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const currentProp = properties[currentIndex !== -1 ? currentIndex : 0];
        if (currentProp) {
          recordPropertyClick(currentProp.id);
          setDetailDrawerProperty(currentProp);
        }
      } else if (e.key === 'u' || e.key === 'U') {
        const currentProp = properties[currentIndex !== -1 ? currentIndex : 0];
        if (currentProp && !isLeadUnlocked(currentProp.id)) {
          if (currentUser.role === 'guest') setAuthModalOpen(true);
          else setUnlockModalProperty(currentProp);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [properties, selectedRowId, currentUser, isLeadUnlocked]);

  const handleRowClick = (prop: PropertyListing, colLetter: string) => {
    setSelectedRowId(prop.id);
    setSelectedCol(colLetter);
    recordPropertyClick(prop.id);
  };

  const handleUnlockClick = (e: React.MouseEvent, prop: PropertyListing) => {
    e.stopPropagation();
    recordPropertyClick(prop.id);
    if (currentUser.role === 'guest') {
      setAuthModalOpen(true);
    } else {
      setUnlockModalProperty(prop);
    }
  };

  const handleReportClick = (e: React.MouseEvent, prop: PropertyListing) => {
    e.stopPropagation();
    if (currentUser.role === 'guest') {
      setAuthModalOpen(true);
    } else {
      setReportModalProperty(prop);
    }
  };

  if (properties.length === 0) {
    return (
      <div className="py-24 text-center text-slate-500 bg-white flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mb-4">
          <Info className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">No properties match your filter criteria</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          Try expanding your price range, choosing 'All Corridors', or resetting your active search filters.
        </p>
      </div>
    );
  }

  // Comfortable Card View Mode (Google Material Cards)
  if (viewMode === 'comfortable') {
    return (
      <div className="flex-1 overflow-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-[#f8f9fa]">
        {properties.map((prop, idx) => {
          const unlocked = isLeadUnlocked(prop.id);
          const isSelected = selectedRowId === prop.id;

          return (
            <div
              key={prop.id}
              onClick={() => {
                setSelectedRowId(prop.id);
                recordPropertyClick(prop.id);
                setDetailDrawerProperty(prop);
              }}
              className={`bg-white rounded-xl border p-4 transition-all hover:border-[#0f9d58] hover:shadow-md cursor-pointer relative flex flex-col justify-between ${
                isSelected ? 'border-[#0f9d58] ring-2 ring-emerald-500/20 shadow-xs' : 'border-slate-200 shadow-2xs'
              }`}
            >
              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-[#0f9d58] font-bold border border-slate-200">
                      {prop.id}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">#{idx + 1}</span>
                  </div>

                  {prop.hotBadge === '🔥 HOT PROPERTY' ? (
                    <span className="bg-amber-50 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                      <Flame className="w-3 h-3 text-amber-600" /> HOT PROPERTY
                    </span>
                  ) : prop.hotBadge === '⚡ ON DEMAND' ? (
                    <span className="bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Zap className="w-3 h-3 text-blue-600" /> ON DEMAND
                    </span>
                  ) : (
                    <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-mono">
                      Standard
                    </span>
                  )}
                </div>

                {/* Title & Location */}
                <h3 className="font-bold text-sm text-slate-900 line-clamp-2 mb-1 group-hover:text-[#0f9d58]">
                  {prop.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                  <span className="text-[#0f9d58] font-semibold">{prop.area}</span>
                  <span>•</span>
                  <span>{prop.city}</span>
                </div>

                {/* Key specs badge row */}
                <div className="grid grid-cols-2 gap-2 mb-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Type & Size</span>
                    <span className="font-bold text-slate-800">
                      {prop.sizeNumber} {prop.sizeUnit}
                    </span>
                    <span className="text-[11px] text-slate-600 block truncate">{prop.type}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Demand (Price)</span>
                    <span className="font-mono text-sm font-extrabold text-[#0f9d58] block">
                      {formatPrice(prop.demandPrice, settings)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {formatExactCurrency(prop.demandPrice, settings)}
                    </span>
                  </div>
                </div>

                {/* Features pills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {prop.features.slice(0, 3).map((f) => (
                    <span
                      key={f}
                      className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded border border-slate-200"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact & Unlock Action */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                <div className="text-xs">
                  <span className="text-[10px] text-slate-500 block">Seller ID:</span>
                  <span className="font-mono text-slate-700 font-semibold">{prop.sellerHashId}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleReportClick(e, prop)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Report fake or inaccurate listing"
                  >
                    <Flag className="w-3.5 h-3.5" />
                  </button>

                  {unlocked ? (
                    <a
                      href={generateWhatsAppLink(prop.sellerPhone, prop.title, prop.id, formatPrice(prop.demandPrice, settings))}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 bg-[#0f9d58] hover:bg-[#0d8a4d] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  ) : (
                    <button
                      onClick={(e) => handleUnlockClick(e, prop)}
                      className="flex items-center gap-1.5 bg-[#0f9d58] hover:bg-[#0d8a4d] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Unlock (0.33%)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Google Sheets Style Dense Grid View (Primary Spec)
  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-white select-none">
      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full border-collapse text-left border-b border-slate-300">
          {/* Google Sheets Header with Column Coordinates [A], [B], [C] */}
          <thead className="sticky top-0 z-20 bg-[#f8f9fa] border-b border-slate-300 text-[11px] font-mono text-slate-700 shadow-xs">
            <tr>
              {/* Gutter / Row Number Column Header (#) */}
              <th className="w-12 py-2 px-2 text-center bg-[#e8eaed] border-r border-slate-300 text-slate-700 select-none font-bold">
                #
              </th>

              {/* Column A: Area & Location */}
              <th className="py-2 px-3 border-r border-slate-300 font-semibold text-slate-700 min-w-[190px]">
                <span className="text-[#0f9d58] mr-1.5 font-bold">[A]</span>
                <span>Area / Location</span>
              </th>

            {/* Column B: Type */}
            <th className="py-2 px-3 border-r border-slate-300 font-semibold text-slate-700 min-w-[140px]">
              <span className="text-[#0f9d58] mr-1.5 font-bold">[B]</span>
              <span>Property Type</span>
            </th>

            {/* Column C: Size */}
            <th className="py-2 px-3 border-r border-slate-300 font-semibold text-slate-700 min-w-[120px]">
              <span className="text-[#0f9d58] mr-1.5 font-bold">[C]</span>
              <span>Size</span>
            </th>

            {/* Column D: Demand (Price) */}
            <th className="py-2 px-3 border-r border-slate-300 font-semibold text-slate-700 min-w-[160px]">
              <span className="text-[#0f9d58] mr-1.5 font-bold">[D]</span>
              <span>Demand (Price)</span>
            </th>

            {/* Column E: Status / Hot Badge */}
            <th className="py-2 px-3 border-r border-slate-300 font-semibold text-slate-700 min-w-[150px]">
              <span className="text-[#0f9d58] mr-1.5 font-bold">[E]</span>
              <span>Status Tag</span>
            </th>

            {/* Column F: Activity & Views */}
            <th className="py-2 px-3 border-r border-slate-300 font-semibold text-slate-700 min-w-[110px]">
              <span className="text-[#0f9d58] mr-1.5 font-bold">[F]</span>
              <span>Activity</span>
            </th>

            {/* Column G: Seller Identity */}
            <th className="py-2 px-3 border-r border-slate-300 font-semibold text-slate-700 min-w-[140px]">
              <span className="text-[#0f9d58] mr-1.5 font-bold">[G]</span>
              <span>Seller ID</span>
            </th>

            {/* Column H: Action Button / Contact */}
            <th className="py-2 px-3 border-r border-slate-300 font-semibold text-slate-700 min-w-[210px]">
              <span className="text-[#0f9d58] mr-1.5 font-bold">[H]</span>
              <span>Verified Contact</span>
            </th>

            {/* Column I: Flag & Security */}
            <th className="py-2 px-2 text-center font-semibold text-slate-700 min-w-[60px]">
              <span className="text-[#0f9d58] mr-1 font-bold">[I]</span>
              <span>Flag</span>
            </th>
          </tr>
        </thead>

        {/* Google Sheets Dense Table Body */}
        <tbody className="divide-y divide-slate-200 text-xs">
          {properties.map((prop, index) => {
            const isSelected = selectedRowId === prop.id;
            const isUnlocked = isLeadUnlocked(prop.id);
            const isHot = prop.hotBadge === '🔥 HOT PROPERTY';
            const isOnDemand = prop.hotBadge === '⚡ ON DEMAND';

            return (
              <tr
                key={prop.id}
                onClick={() => handleRowClick(prop, 'A')}
                onDoubleClick={() => {
                  setDetailDrawerProperty(prop);
                }}
                className={`transition-colors font-sans group ${
                  isSelected
                    ? 'bg-emerald-50/70 border-emerald-400'
                    : index % 2 === 0
                    ? 'bg-white hover:bg-slate-50 text-slate-800'
                    : 'bg-slate-50/40 hover:bg-slate-100/70 text-slate-800'
                }`}
              >
                {/* Row Number Gutter */}
                <td
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRowId(prop.id);
                    setSelectedCol('ROW');
                  }}
                  className={`py-2 px-2 text-center font-mono text-[11px] border-r border-slate-300 font-medium ${
                    isSelected ? 'bg-[#0f9d58] text-white font-bold' : 'text-slate-500 bg-[#f8f9fa]'
                  }`}
                >
                  {index + 1}
                </td>

                {/* [A] Area & Location */}
                <td
                  onClick={() => handleRowClick(prop, 'A')}
                  className={`py-2 px-3 border-r border-slate-200 ${
                    isSelected && selectedCol === 'A' ? 'excel-cell-active' : ''
                  }`}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 group-hover:text-[#0f9d58] transition-colors">
                        {prop.area}
                      </span>
                      <span className="text-[10px] px-1 py-0.2 rounded bg-slate-100 text-slate-600 font-mono border border-slate-200">
                        {prop.city}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 truncate max-w-[220px]" title={prop.title}>
                      {prop.title}
                    </span>
                  </div>
                </td>

                {/* [B] Type */}
                <td
                  onClick={() => handleRowClick(prop, 'B')}
                  className={`py-2 px-3 border-r border-slate-200 ${
                    isSelected && selectedCol === 'B' ? 'excel-cell-active' : ''
                  }`}
                >
                  <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap">
                    {prop.type}
                  </span>
                </td>

                {/* [C] Size */}
                <td
                  onClick={() => handleRowClick(prop, 'C')}
                  className={`py-2 px-3 border-r border-slate-200 font-mono-numbers whitespace-nowrap ${
                    isSelected && selectedCol === 'C' ? 'excel-cell-active' : ''
                  }`}
                >
                  <span className="font-bold text-slate-800">{prop.sizeNumber}</span>
                  <span className="text-slate-500 ml-1 text-[11px]">{prop.sizeUnit}</span>
                </td>

                {/* [D] Demand Price */}
                <td
                  onClick={() => handleRowClick(prop, 'D')}
                  className={`py-2 px-3 border-r border-slate-200 font-mono-numbers ${
                    isSelected && selectedCol === 'D' ? 'excel-cell-active' : ''
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-extrabold text-[#0f9d58] text-sm tracking-tight">
                      {formatPrice(prop.demandPrice, settings)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {formatExactCurrency(prop.demandPrice, settings)}
                    </span>
                  </div>
                </td>

                {/* [E] Status Tag / Hot Badge */}
                <td
                  onClick={() => handleRowClick(prop, 'E')}
                  className={`py-2 px-3 border-r border-slate-200 ${
                    isSelected && selectedCol === 'E' ? 'excel-cell-active' : ''
                  }`}
                >
                  {prop.isSold ? (
                    <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-300">
                      SOLD OUT
                    </span>
                  ) : isHot ? (
                    <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-300 text-[10px] font-black px-2 py-0.5 rounded shadow-2xs animate-pulse whitespace-nowrap">
                      <Flame className="w-3 h-3 text-amber-600 shrink-0" />
                      <span>🔥 HOT PROPERTY</span>
                    </div>
                  ) : isOnDemand ? (
                    <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-900 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap">
                      <Zap className="w-3 h-3 text-blue-600 shrink-0" />
                      <span>⚡ ON DEMAND</span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-500 font-mono">
                      Standard
                    </span>
                  )}
                </td>

                {/* [F] Activity / Views */}
                <td
                  onClick={() => handleRowClick(prop, 'F')}
                  className={`py-2 px-3 border-r border-slate-200 font-mono-numbers text-[11px] ${
                    isSelected && selectedCol === 'F' ? 'excel-cell-active' : ''
                  }`}
                >
                  <div className="flex items-center gap-1.5" title={`${prop.clicksCount} views in 24h. Click to view.`}>
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-bold text-slate-700">{prop.clicksCount}</span>
                    <span className="text-[10px] text-slate-500">views</span>
                  </div>
                </td>

                {/* [G] Seller Identity */}
                <td
                  onClick={() => handleRowClick(prop, 'G')}
                  className={`py-2 px-3 border-r border-slate-200 font-mono ${
                    isSelected && selectedCol === 'G' ? 'excel-cell-active' : ''
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 text-[11px]">
                      {prop.sellerHashId}
                    </span>
                    <span className="text-[10px] text-slate-500 font-sans">
                      {isUnlocked ? prop.sellerName : maskSellerName(prop.sellerName)}
                    </span>
                  </div>
                </td>

                {/* [H] Action Button: Unlock Contact (0.33% Commission Model) */}
                <td
                  onClick={() => handleRowClick(prop, 'H')}
                  className={`py-2 px-3 border-r border-slate-200 ${
                    isSelected && selectedCol === 'H' ? 'excel-cell-active' : ''
                  }`}
                >
                  {isUnlocked ? (
                    <div className="flex items-center gap-1.5">
                      <div className="flex flex-col mr-1">
                        <span className="font-mono text-[#0f9d58] font-bold text-[11px]">
                          {prop.sellerPhone}
                        </span>
                        <span className="text-[9px] text-emerald-700 font-medium flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5 text-[#0f9d58]" /> Verified
                        </span>
                      </div>

                      {/* Direct WhatsApp Action Button */}
                      <a
                        href={generateWhatsAppLink(
                          prop.sellerPhone,
                          prop.title,
                          prop.id,
                          formatPrice(prop.demandPrice, settings)
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#0f9d58] hover:bg-[#0d8a4d] text-white font-bold px-2 py-1 rounded text-[11px] flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                        title="Chat directly on WhatsApp"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span className="hidden xl:inline">Chat</span>
                      </a>

                      {/* Direct Phone Call Button */}
                      <a
                        href={`tel:${prop.sellerPhone.replace(/\s+/g, '')}`}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 p-1 rounded text-[11px] flex items-center transition-all cursor-pointer shadow-2xs"
                        title="Direct voice call"
                      >
                        <Phone className="w-3 h-3" />
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <span className="font-mono text-slate-400 blur-[2px] select-none text-[11px]">
                          {maskPhone(prop.sellerPhone)}
                        </span>
                        <span className="text-[9px] text-slate-500 font-medium">Locked Lead</span>
                      </div>

                      <button
                        onClick={(e) => handleUnlockClick(e, prop)}
                        className="bg-[#0f9d58] hover:bg-[#0d8a4d] active:scale-95 text-white font-bold px-2.5 py-1 rounded text-[11px] flex items-center gap-1 shadow-xs transition-all cursor-pointer whitespace-nowrap"
                        title="Unlock seller WhatsApp & direct contact (0.33% commission model)"
                      >
                        <Unlock className="w-3 h-3" />
                        <span>Unlock (0.33%)</span>
                      </button>
                    </div>
                  )}
                </td>

                {/* [I] Anti-Fraud Report Flag */}
                <td className="py-2 px-2 text-center">
                  <button
                    onClick={(e) => handleReportClick(e, prop)}
                    className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Report fake broker, misleading price, or fraud (3-Strike System)"
                  >
                    <Flag className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>

      {/* Spreadsheet Status Footer bar */}
      <div className="bg-[#f8f9fa] border-t border-slate-300 px-4 py-2 shrink-0 flex flex-wrap items-center justify-between text-xs text-slate-600 font-mono">
        <div className="flex items-center gap-4">
          <span>
            READY | Selected Cell:{' '}
            <strong className="text-[#0f9d58] font-bold">{selectedRowId || 'None'}</strong>
          </span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="hidden sm:inline">
            Shortcuts:{' '}
            <kbd className="bg-white border border-slate-300 px-1 py-0.5 rounded text-[10px] text-slate-700 shadow-2xs">↑</kbd>{' '}
            <kbd className="bg-white border border-slate-300 px-1 py-0.5 rounded text-[10px] text-slate-700 shadow-2xs">↓</kbd> navigate,{' '}
            <kbd className="bg-white border border-slate-300 px-1 py-0.5 rounded text-[10px] text-slate-700 shadow-2xs">Enter</kbd> details,{' '}
            <kbd className="bg-white border border-slate-300 px-1 py-0.5 rounded text-[10px] text-slate-700 shadow-2xs">U</kbd> unlock
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span>Click tracking automatically updates 🔥 Hot Badge (&gt; 50 clicks)</span>
        </div>
      </div>
    </div>
  );
};
