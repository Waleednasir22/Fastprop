import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatExactCurrency } from '../utils/formatters';
import {
  Table2,
  PlusCircle,
  ShieldAlert,
  Unlock,
  Building2,
  Bell,
  Search,
  UserCheck,
  UserX,
  LogOut,
  ChevronDown,
  Sparkles,
  Radio,
  SlidersHorizontal,
} from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  viewMode: 'dense' | 'comfortable';
  setViewMode: (v: 'dense' | 'comfortable') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
}) => {
  const {
    currentUser,
    users,
    properties,
    transactions,
    reports,
    settings,
    broadcasts,
    switchUser,
    logout,
    setAuthModalOpen,
    setAddPropertyModalOpen,
    setIsAdminOpen,
    setIsMyPropertiesOpen,
    setIsUnlockedLeadsOpen,
    setIsBroadcastDrawerOpen,
    selectedRowId,
    selectedCol,
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Active cell inspection info
  const selectedProp = properties.find((p) => p.id === selectedRowId) || properties[0];

  const totalGMV = properties
    .filter((p) => !p.isSold && !p.isShadowBanned)
    .reduce((sum, p) => sum + p.demandPrice, 0);

  const activeCount = properties.filter((p) => !p.isSold && !p.isShadowBanned).length;

  const myUnlockedCount = transactions.filter((t) => t.buyerId === currentUser.id).length;
  const myPropertiesCount = properties.filter((p) => p.sellerId === currentUser.id).length;
  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length;

  return (
    <header className="shrink-0 z-40 bg-white border-b border-slate-200 text-slate-800 shadow-xs">
      {/* Top Ticker Ribbon (Google Sheets subtle top bar) */}
      <div className="bg-[#f8f9fa] px-4 py-1.5 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 font-mono-numbers">
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="flex items-center gap-1.5 text-[#0f9d58] font-semibold shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0f9d58] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0f9d58]"></span>
            </span>
            <span className="font-bold tracking-tight">FASTPROP LIVE</span>
          </div>

          <div className="hidden md:flex items-center gap-3 text-slate-600 truncate text-[11px]">
            <span>
              Active Inventory: <strong className="text-slate-900 font-semibold">{activeCount}</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span>
              Total Live GMV: <strong className="text-[#0f9d58] font-bold">{formatExactCurrency(totalGMV, settings)}</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span>
              Model: <strong className="text-slate-700 font-mono">{settings.commissionPercent}% Pay-Per-Lead</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsBroadcastDrawerOpen(true)}
            className="flex items-center gap-1.5 text-slate-700 hover:text-[#0f9d58] transition-colors cursor-pointer"
            title="Open Live WhatsApp Broadcasts"
          >
            <Radio className="w-3.5 h-3.5 text-[#0f9d58] animate-pulse" />
            <span className="hidden sm:inline font-sans text-xs">WhatsApp Alerts</span>
            <span className="bg-emerald-100 text-[#0f9d58] px-1.5 py-0.2 rounded text-[10px] font-bold border border-emerald-200">
              {broadcasts.length}
            </span>
          </button>

          {/* Quick Identity Switcher for Demo testing */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-300 px-2 py-0.5 rounded-full text-[11px] text-slate-700 shadow-xs cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-[#0f9d58]"></span>
              <span className="font-sans font-medium truncate max-w-[110px]">
                {currentUser.name}
              </span>
              <span className="text-[10px] uppercase px-1 rounded bg-slate-100 text-slate-600 font-mono">
                {currentUser.role}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 text-xs font-sans">
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    Switch Persona
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    Test buyer, seller, flagged, and admin roles
                  </div>
                </div>

                {users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUser(u.id);
                      setIsUserMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      u.id === currentUser.id ? 'bg-emerald-50 text-[#0f9d58] font-semibold' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span>{u.name}</span>
                        {u.strikes > 0 && (
                          <span
                            className={`text-[9px] px-1 rounded font-mono ${
                              u.strikes === 1
                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                : u.strikes === 2
                                ? 'bg-orange-100 text-orange-800 border border-orange-200'
                                : 'bg-red-100 text-red-800 border border-red-200'
                            }`}
                          >
                            Strike {u.strikes}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">{u.phone || 'No Phone (Guest)'}</div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                      {u.role}
                    </span>
                  </button>
                ))}

                <div className="border-t border-slate-100 mt-1 pt-1 px-1">
                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-red-600 hover:bg-red-50 rounded flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Reset to Guest Visitor
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Brand Logo & Google Sheets style badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#0f9d58] flex items-center justify-center shadow-md shadow-emerald-600/20">
              <Table2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900">FastProp</span>
                <span className="bg-emerald-50 text-[#0f9d58] text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-200 font-mono">
                  SHEETS VIEW
                </span>
              </div>
              <p className="text-[11px] text-slate-500 -mt-0.5">
                Real Estate Inventory & Lead Exchange
              </p>
            </div>
          </div>
        </div>

        {/* Global Google-Style Search Bar */}
        <div className="flex-1 max-w-md min-w-[240px]">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Area (DHA Phase 6, Bahria), Type (Plot, Villa), or Seller..."
              className="w-full bg-[#f1f3f4] hover:bg-[#e8eaed] focus:bg-white border border-transparent focus:border-blue-500 rounded-full pl-9 pr-12 py-2 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:shadow-sm transition-all"
            />
            <div className="absolute right-3 top-2 flex items-center gap-1 pointer-events-none">
              <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                /
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Post Inventory Button - Google Green Primary */}
          <button
            onClick={() => {
              if (currentUser.role === 'guest') {
                setAuthModalOpen(true);
              } else {
                setAddPropertyModalOpen(true);
              }
            }}
            className="flex items-center gap-1.5 bg-[#0f9d58] hover:bg-[#0d8a4d] active:scale-95 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs shadow-sm transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Inventory</span>
          </button>

          {/* My Unlocked Leads */}
          <button
            onClick={() => {
              if (currentUser.role === 'guest') {
                setAuthModalOpen(true);
              } else {
                setIsUnlockedLeadsOpen(true);
              }
            }}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-lg text-xs text-slate-700 shadow-2xs transition-colors cursor-pointer"
            title="View unlocked contact details"
          >
            <Unlock className="w-3.5 h-3.5 text-[#0f9d58]" />
            <span className="hidden md:inline font-medium">Unlocked Leads</span>
            <span className="bg-emerald-100 text-[#0f9d58] px-1.5 py-0.5 rounded text-[10px] font-bold">
              {myUnlockedCount}
            </span>
          </button>

          {/* My Inventory */}
          <button
            onClick={() => {
              if (currentUser.role === 'guest') {
                setAuthModalOpen(true);
              } else {
                setIsMyPropertiesOpen(true);
              }
            }}
            className="hidden sm:flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-lg text-xs text-slate-700 shadow-2xs transition-colors cursor-pointer"
            title="Manage my posted inventory"
          >
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-medium">My Listings</span>
            {myPropertiesCount > 0 && (
              <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                {myPropertiesCount}
              </span>
            )}
          </button>

          {/* Super Admin Desk Button */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              currentUser.role === 'admin'
                ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
            title="Super Admin Control Panel"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden lg:inline">Admin Desk</span>
            {pendingReportsCount > 0 && (
              <span className="bg-red-600 text-white px-1.5 py-0.2 rounded-full text-[10px] font-bold animate-pulse">
                {pendingReportsCount}
              </span>
            )}
          </button>

          {/* User Sign In if Guest */}
          {currentUser.role === 'guest' ? (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Verify WhatsApp</span>
            </button>
          ) : (
            <div className="hidden xl:flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#0f9d58]"></span>
              <span className="text-slate-700 font-mono text-[11px] font-medium">{currentUser.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Google Sheets Formula Bar */}
      <div className="bg-[#f8f9fa] px-4 py-1 border-t border-slate-200 flex items-center gap-3 text-xs">
        {/* Cell Name Box */}
        <div className="flex items-center gap-1 font-mono bg-white px-2.5 py-0.5 rounded border border-slate-300 text-[#0f9d58] font-bold shrink-0 text-[11px] shadow-2xs">
          <span>{selectedCol || 'A'}</span>
          <span>{selectedRowId ? properties.findIndex((p) => p.id === selectedRowId) + 1 : '1'}</span>
        </div>

        {/* Formula fx symbol (Google Sheets style) */}
        <span className="text-slate-400 font-mono font-bold select-none text-[13px] italic">
          fx
        </span>

        {/* Formula bar content */}
        <div className="flex-1 truncate font-mono text-[11px] text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
          {selectedProp ? (
            <span>
              <span className="text-[#0f9d58] font-bold">{selectedProp.id}</span>
              {' = '}
              <span className="text-slate-900 font-semibold">{selectedProp.area}</span>
              {' | '}
              <span className="text-slate-700">{selectedProp.sizeNumber} {selectedProp.sizeUnit} {selectedProp.type}</span>
              {' | Demand: '}
              <span className="text-[#0f9d58] font-bold">{formatExactCurrency(selectedProp.demandPrice, settings)}</span>
              {' | Seller: '}
              <span className="text-slate-600">{selectedProp.sellerHashId}</span>
              {' | Status: '}
              <span className="text-amber-700 font-semibold">{selectedProp.hotBadge}</span>
            </span>
          ) : (
            <span className="text-slate-400">Select any row or cell in spreadsheet to inspect formula and details...</span>
          )}
        </div>

        {/* View density toggle */}
        <div className="hidden sm:flex items-center gap-1 bg-white border border-slate-300 p-0.5 rounded-lg text-[11px] shadow-2xs">
          <button
            onClick={() => setViewMode('dense')}
            className={`px-2.5 py-0.5 rounded font-medium transition-colors cursor-pointer ${
              viewMode === 'dense' ? 'bg-[#0f9d58] text-white font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Dense spreadsheet view (Fastest navigation)"
          >
            Sheets View
          </button>
          <button
            onClick={() => setViewMode('comfortable')}
            className={`px-2.5 py-0.5 rounded font-medium transition-colors cursor-pointer ${
              viewMode === 'comfortable' ? 'bg-[#0f9d58] text-white font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Comfortable card view"
          >
            Cards View
          </button>
        </div>
      </div>

      {/* Warning banner if current logged in user has strikes */}
      {currentUser.strikes > 0 && currentUser.warningNotice && (
        <div
          className={`px-4 py-1.5 text-xs flex items-center justify-between font-medium ${
            currentUser.strikes === 1
              ? 'bg-yellow-50 border-b border-yellow-200 text-yellow-900'
              : currentUser.strikes === 2
              ? 'bg-orange-50 border-b border-orange-200 text-orange-900'
              : 'bg-red-50 border-b border-red-200 text-red-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{currentUser.warningNotice}</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-white border border-slate-200 uppercase font-mono shadow-2xs">
            Anti-Fraud Penalty System
          </span>
        </div>
      )}
    </header>
  );
};
