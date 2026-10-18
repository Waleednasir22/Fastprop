import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatExactCurrency, formatPrice } from '../utils/formatters';
import {
  ShieldAlert,
  X,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  UserX,
  UserCheck,
  Flame,
  Trash2,
  CheckCircle2,
  Sliders,
  FileText,
  Search,
  Eye,
  Building,
} from 'lucide-react';

interface AdminPanelProps {
  onClose: () => void;
}

type AdminTab = 'kpis' | 'monetization' | 'reports' | 'users' | 'inventory' | 'ledger';

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const {
    currentUser,
    users,
    properties,
    reports,
    transactions,
    settings,
    updateSettings,
    applyStrikeToSeller,
    dismissReport,
    unbanSeller,
    deleteProperty,
    boostProperty,
    toggleSoldStatus,
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('kpis');

  // Monetization form states
  const [commPercent, setCommPercent] = useState(settings.commissionPercent);
  const [minFee, setMinFee] = useState(settings.minLeadFee);
  const [maxCap, setMaxCap] = useState(settings.maxLeadFeeCap);
  const [fixedMode, setFixedMode] = useState(settings.fixedFeeModeEnabled);
  const [fixedAmt, setFixedAmt] = useState(settings.fixedFeeAmount);
  const [selectedCurrency, setSelectedCurrency] = useState(settings.currency);

  // Search filter inside admin tabs
  const [userSearch, setUserSearch] = useState('');
  const [propSearch, setPropSearch] = useState('');

  // Calculations
  const totalRevenue = transactions.reduce((sum, t) => sum + t.feeAmountPaid, 0);
  const totalGMV = properties.reduce((sum, p) => sum + p.demandPrice, 0);
  const pendingReports = reports.filter((r) => r.status === 'pending');
  const bannedCount = users.filter((u) => u.isBanned).length;

  const handleSaveMonetization = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      commissionPercent: Number(commPercent),
      minLeadFee: Number(minFee),
      maxLeadFeeCap: Number(maxCap),
      fixedFeeModeEnabled: fixedMode,
      fixedFeeAmount: Number(fixedAmt),
      currency: selectedCurrency,
      currencyRateToPKR: selectedCurrency === 'USD' ? 278 : selectedCurrency === 'AED' ? 75 : 1,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col text-slate-800 max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#f8f9fa] px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shadow-2xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base text-slate-900">Google Workspace Style Admin Console</h2>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-200 font-mono">
                  SUPER ADMIN
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Anti-fraud moderation, 0.33% fee rules, seller sanctions & transaction telemetry
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

        {/* Tab Navigation (Google Sheets / Workspace style) */}
        <div className="bg-[#f8f9fa] border-b border-slate-200 px-6 flex items-center gap-1 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('kpis')}
            className={`py-3 px-3 font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'kpis'
                ? 'border-[#0f9d58] text-[#0f9d58]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            📊 Analytics & KPIs
          </button>

          <button
            onClick={() => setActiveTab('monetization')}
            className={`py-3 px-3 font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'monetization'
                ? 'border-[#0f9d58] text-[#0f9d58]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            💰 Monetization & 0.33% Rules
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`py-3 px-3 font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'reports'
                ? 'border-[#0f9d58] text-[#0f9d58]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🚩 3-Strike Moderation Queue</span>
            {pendingReports.length > 0 && (
              <span className="bg-red-600 text-white px-1.5 py-0.2 rounded-full text-[10px] font-bold">
                {pendingReports.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`py-3 px-3 font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'users'
                ? 'border-[#0f9d58] text-[#0f9d58]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            👥 Accounts & Blacklist
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-3 px-3 font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'border-[#0f9d58] text-[#0f9d58]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            🏢 Inventory Controls
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`py-3 px-3 font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'ledger'
                ? 'border-[#0f9d58] text-[#0f9d58]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            📑 Revenue Ledger ({transactions.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* TAB 1: KPIS & ANALYTICS */}
          {activeTab === 'kpis' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-[10px] uppercase font-mono text-slate-500 mb-1 font-semibold">
                    Total Lead Revenue
                  </div>
                  <div className="text-xl font-bold font-mono text-[#0f9d58]">
                    {formatExactCurrency(totalRevenue, settings)}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">From pay-per-lead unlocks</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-[10px] uppercase font-mono text-slate-500 mb-1 font-semibold">
                    Gross Live GMV
                  </div>
                  <div className="text-xl font-bold font-mono text-slate-900">
                    {formatPrice(totalGMV, settings)}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">{properties.length} active listings</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-[10px] uppercase font-mono text-slate-500 mb-1 font-semibold">
                    Pending Fraud Reports
                  </div>
                  <div className="text-xl font-bold font-mono text-red-600">
                    {pendingReports.length}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Awaiting 3-strike review</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-[10px] uppercase font-mono text-slate-500 mb-1 font-semibold">
                    Banned Accounts
                  </div>
                  <div className="text-xl font-bold font-mono text-orange-600">
                    {bannedCount} accounts
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Permanently blacklisted</div>
                </div>
              </div>

              {/* Conversion and Click Algorithm Metrics */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs space-y-3">
                <h3 className="font-bold text-sm text-slate-900">
                  🔥 Click Tracking & Hot Property Algorithm Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[11px]">
                  <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                    <span className="text-amber-700 font-bold block mb-1">🔥 Hot Property Rule</span>
                    <span className="text-slate-700">Trigger: &gt; 50 clicks in 24 hours</span>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Currently: {properties.filter((p) => p.hotBadge === '🔥 HOT PROPERTY').length} active listings
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                    <span className="text-blue-700 font-bold block mb-1">⚡ On Demand Rule</span>
                    <span className="text-slate-700">Trigger: 20 to 50 clicks in 24 hours</span>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Currently: {properties.filter((p) => p.hotBadge === '⚡ ON DEMAND').length} active listings
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                    <span className="text-[#0f9d58] font-bold block mb-1">0.33% Unlock Ratio</span>
                    <span className="text-slate-700">
                      Unlocks: {transactions.length} / Clicks: {properties.reduce((s, p) => s + p.clicksCount, 0)}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Platform Lead Conversion Active
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MONETIZATION CONTROLS */}
          {activeTab === 'monetization' && (
            <form onSubmit={handleSaveMonetization} className="space-y-4 max-w-xl text-xs">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <h3 className="font-bold text-sm text-slate-900">0.33% Commission & Pricing Rules</h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-700 font-bold block mb-1">
                      Commission Percent (%)
                    </label>
                    <input
                      type="number"
                      step={0.01}
                      min={0.05}
                      max={5}
                      value={commPercent}
                      onChange={(e) => setCommPercent(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono text-[#0f9d58] font-bold"
                    />
                    <span className="text-[10px] text-slate-500">Default: 0.33%</span>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-700 font-bold block mb-1">
                      Active Currency
                    </label>
                    <select
                      value={selectedCurrency}
                      onChange={(e) => setSelectedCurrency(e.target.value as any)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 cursor-pointer"
                    >
                      <option value="PKR">Pakistani Rupee (PKR - Lakh/Crore)</option>
                      <option value="USD">US Dollar ($ USD)</option>
                      <option value="AED">UAE Dirham (AED)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-700 font-bold block mb-1">
                      Minimum Lead Floor Fee (PKR)
                    </label>
                    <input
                      type="number"
                      step={500}
                      value={minFee}
                      onChange={(e) => setMinFee(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-700 font-bold block mb-1">
                      Maximum Fee Cap (0 = Uncapped)
                    </label>
                    <input
                      type="number"
                      step={5000}
                      value={maxCap}
                      onChange={(e) => setMaxCap(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono text-slate-800"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={fixedMode}
                      onChange={(e) => setFixedMode(e.target.checked)}
                      className="accent-[#0f9d58]"
                    />
                    <span className="text-slate-800 font-medium">
                      Enable Flat Fixed Fee Override (ignores percentage)
                    </span>
                  </label>

                  {fixedMode && (
                    <div className="mt-2">
                      <label className="text-[11px] text-slate-600 block mb-1">
                        Fixed Flat Fee Amount (PKR)
                      </label>
                      <input
                        type="number"
                        value={fixedAmt}
                        onChange={(e) => setFixedAmt(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono text-slate-800"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#0f9d58] hover:bg-[#0d8a4d] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Save Monetization Configuration
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: 3-STRIKE MODERATION QUEUE */}
          {activeTab === 'reports' && (
            <div className="space-y-4 text-xs">
              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-amber-900">
                <span className="font-bold text-xs block mb-1">
                  ⚖️ Anti-Fraud 3-Strike Penalty Enforcement Engine
                </span>
                <p className="text-[11px] text-amber-800 leading-relaxed font-sans">
                  Strike 1: Yellow Warning banner to seller. • Strike 2: Orange Warning & automatic
                  shadow-ban of seller listings. • Strike 3: Red Flag account suspension, blacklist phone
                  & removal of all live listings.
                </p>
              </div>

              {reports.length === 0 ? (
                <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                  No fraud reports currently on file.
                </div>
              ) : (
                <div className="space-y-3">
                  {reports.map((rep) => {
                    const seller = users.find((u) => u.id === rep.sellerId);
                    const sellerStrikes = seller ? seller.strikes : 0;

                    return (
                      <div
                        key={rep.id}
                        className={`bg-white p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs ${
                          rep.status === 'pending'
                            ? 'border-red-300 ring-1 ring-red-200 bg-red-50/20'
                            : 'border-slate-200 opacity-80'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[#0f9d58] font-bold">{rep.id}</span>
                            <span className="bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded text-[10px] border border-red-200">
                              {rep.reason}
                            </span>
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                                rep.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800 animate-pulse border border-yellow-200'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {rep.status.toUpperCase()}
                            </span>
                          </div>

                          <div className="text-slate-900 font-semibold">{rep.propertyTitle}</div>
                          <p className="text-[11px] text-slate-600 italic">"{rep.details}"</p>

                          <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono pt-1">
                            <span>Reporter: {rep.reporterName}</span>
                            <span>•</span>
                            <span>
                              Target Seller: {rep.sellerName} (Current: Strike {sellerStrikes})
                            </span>
                          </div>
                        </div>

                        {rep.status === 'pending' && (
                          <div className="flex sm:flex-col gap-2 shrink-0">
                            <button
                              onClick={() => applyStrikeToSeller(rep.sellerId, rep.id)}
                              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors cursor-pointer"
                            >
                              Apply Strike ({Math.min(3, sellerStrikes + 1)})
                            </button>
                            <button
                              onClick={() => dismissReport(rep.id)}
                              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs transition-colors cursor-pointer"
                            >
                              Dismiss False Report
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: USERS & BLACKLIST */}
          {activeTab === 'users' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div className="relative max-w-xs w-full">
                  <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search name, phone, or email..."
                    className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0f9d58]"
                  />
                </div>
                <span className="text-slate-500 font-mono text-[11px]">
                  Total accounts: {users.length}
                </span>
              </div>

              <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                <table className="w-full text-left divide-y divide-slate-200">
                  <thead className="bg-[#f8f9fa] text-slate-600 font-mono text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Name / Entity</th>
                      <th className="py-2.5 px-3">Verified WhatsApp</th>
                      <th className="py-2.5 px-3">Role</th>
                      <th className="py-2.5 px-3">Strikes Status</th>
                      <th className="py-2.5 px-3 text-right">Moderation Override</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {users
                      .filter(
                        (u) =>
                          u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                          u.phone.includes(userSearch)
                      )
                      .map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-medium text-slate-900">
                            {u.name}
                            <span className="block text-[10px] text-slate-500 font-mono">{u.id}</span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[#0f9d58] font-bold text-xs">
                            {u.phone || 'Guest (Unauthenticated)'}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px] uppercase text-slate-600">
                            {u.role}
                          </td>
                          <td className="py-2.5 px-3">
                            {u.isBanned ? (
                              <span className="bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded text-[10px] font-mono border border-red-200">
                                🚫 BANNED (Strike 3)
                              </span>
                            ) : u.strikes === 2 ? (
                              <span className="bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded text-[10px] font-mono border border-orange-200">
                                ⚠️ SHADOWBANNED (Strike 2)
                              </span>
                            ) : u.strikes === 1 ? (
                              <span className="bg-yellow-100 text-yellow-800 font-bold px-2 py-0.5 rounded text-[10px] font-mono border border-yellow-200">
                                ⚠️ WARNING (Strike 1)
                              </span>
                            ) : (
                              <span className="bg-emerald-50 text-[#0f9d58] font-bold px-2 py-0.5 rounded text-[10px] font-mono border border-emerald-200">
                                ✓ CLEAN
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {u.strikes > 0 ? (
                              <button
                                onClick={() => unbanSeller(u.id)}
                                className="px-2.5 py-1 rounded bg-white hover:bg-slate-50 text-slate-800 text-[11px] font-semibold transition-colors border border-slate-300 cursor-pointer shadow-2xs"
                              >
                                Reset Strikes / Unban
                              </button>
                            ) : (
                              <button
                                onClick={() => applyStrikeToSeller(u.id)}
                                className="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-semibold transition-colors border border-red-200 cursor-pointer"
                              >
                                Manual Strike
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: INVENTORY OVERRIDES */}
          {activeTab === 'inventory' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={propSearch}
                  onChange={(e) => setPropSearch(e.target.value)}
                  placeholder="Filter inventory by title or ID..."
                  className="w-72 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0f9d58]"
                />
                <span className="text-slate-500 font-mono text-[11px]">
                  {properties.length} Listings Live
                </span>
              </div>

              <div className="space-y-2">
                {properties
                  .filter(
                    (p) =>
                      p.title.toLowerCase().includes(propSearch.toLowerCase()) ||
                      p.id.toLowerCase().includes(propSearch.toLowerCase())
                  )
                  .map((p) => (
                    <div
                      key={p.id}
                      className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3 shadow-2xs hover:border-slate-300"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[#0f9d58] font-bold">{p.id}</span>
                          <span className="font-semibold text-slate-900">{p.title}</span>
                          {p.isSold && (
                            <span className="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded text-[10px] border border-slate-200">
                              SOLD
                            </span>
                          )}
                          {p.isShadowBanned && (
                            <span className="bg-orange-100 text-orange-800 px-1.5 py-0.2 rounded text-[10px] border border-orange-200">
                              SHADOWBANNED
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1 font-mono">
                          <span>{p.area}</span>
                          <span>•</span>
                          <span className="text-[#0f9d58] font-bold">{formatPrice(p.demandPrice, settings)}</span>
                          <span>•</span>
                          <span>{p.clicksCount} clicks</span>
                          <span>•</span>
                          <span>Seller: {p.sellerHashId}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => boostProperty(p.id)}
                          className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Flame className="w-3 h-3 text-amber-600" />
                          <span>Boost Hot</span>
                        </button>

                        <button
                          onClick={() => toggleSoldStatus(p.id)}
                          className="px-2.5 py-1 rounded bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-[11px] cursor-pointer"
                        >
                          {p.isSold ? 'Reactivate' : 'Mark as Sold'}
                        </button>

                        <button
                          onClick={() => deleteProperty(p.id)}
                          className="p-1 rounded bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 cursor-pointer"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 6: REVENUE LEDGER */}
          {activeTab === 'ledger' && (
            <div className="space-y-4 text-xs">
              <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                <table className="w-full text-left divide-y divide-slate-200 font-mono text-[11px]">
                  <thead className="bg-[#f8f9fa] text-slate-600 text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Transaction Ref</th>
                      <th className="py-2.5 px-3">Property</th>
                      <th className="py-2.5 px-3">Buyer</th>
                      <th className="py-2.5 px-3">Seller</th>
                      <th className="py-2.5 px-3">Fee Paid (0.33%)</th>
                      <th className="py-2.5 px-3">Method</th>
                      <th className="py-2.5 px-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {transactions.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-bold text-[#0f9d58]">{t.transactionRef}</td>
                        <td className="py-2.5 px-3 font-sans text-slate-900 font-medium">
                          {t.propertyTitle.slice(0, 26)}...
                          <span className="block text-[10px] text-slate-500 font-normal">{t.propertyArea}</span>
                        </td>
                        <td className="py-2.5 px-3 font-sans text-slate-700">{t.buyerName}</td>
                        <td className="py-2.5 px-3 font-sans text-slate-700">{t.sellerName}</td>
                        <td className="py-2.5 px-3 font-bold text-[#0f9d58]">
                          {formatExactCurrency(t.feeAmountPaid, settings)}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{t.paymentMethod}</td>
                        <td className="py-2.5 px-3 text-slate-500">
                          {new Date(t.unlockedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
