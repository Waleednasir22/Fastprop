import React, { useState, useMemo } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { PropertyFilterBar } from './components/PropertyFilterBar';
import { ExcelGrid } from './components/ExcelGrid';
import { UnlockContactModal } from './components/UnlockContactModal';
import { ReportListingModal } from './components/ReportListingModal';
import { AddPropertyModal } from './components/AddPropertyModal';
import { AuthModal } from './components/AuthModal';
import { AdminPanel } from './components/AdminPanel';
import { MyInventoryModal } from './components/MyInventoryModal';
import { UnlockedLeadsModal } from './components/UnlockedLeadsModal';
import { PropertyDetailDrawer } from './components/PropertyDetailDrawer';
import { WhatsAppBroadcastFeed } from './components/WhatsAppBroadcastFeed';
import {
  Bell,
  CheckCircle2,
  Table,
  Zap,
  TrendingUp,
  Flame,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';

const FastPropApp: React.FC = () => {
  const {
    properties,
    currentUser,
    unlockModalProperty,
    setUnlockModalProperty,
    reportModalProperty,
    setReportModalProperty,
    isAddPropertyModalOpen,
    setAddPropertyModalOpen,
    isAuthModalOpen,
    setAuthModalOpen,
    isAdminOpen,
    setIsAdminOpen,
    isMyPropertiesOpen,
    setIsMyPropertiesOpen,
    isUnlockedLeadsOpen,
    setIsUnlockedLeadsOpen,
    detailDrawerProperty,
    setDetailDrawerProperty,
    isBroadcastDrawerOpen,
    setIsBroadcastDrawerOpen,
    latestAlert,
    setLatestAlert,
  } = useApp();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000000]);
  const [hotOnly, setHotOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'clicks' | 'price_desc' | 'price_asc' | 'newest'>('clicks');
  const [viewMode, setViewMode] = useState<'dense' | 'comfortable'>('dense');

  // Extract unique areas from active inventory
  const availableAreas = useMemo(() => {
    const set = new Set<string>();
    properties.forEach((p) => {
      if (p.area) set.add(p.area);
    });
    return Array.from(set).sort();
  }, [properties]);

  // Filter & Sort Logic
  const filteredProperties = useMemo(() => {
    return properties
      .filter((p) => {
        // Hide shadowbanned listings from non-admin/non-owner view
        if (p.isShadowBanned && currentUser.role !== 'admin' && currentUser.id !== p.sellerId) {
          return false;
        }

        // Search Query (title, area, city, type, or seller hash)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            p.title.toLowerCase().includes(q) ||
            p.area.toLowerCase().includes(q) ||
            p.city.toLowerCase().includes(q) ||
            p.type.toLowerCase().includes(q) ||
            p.sellerHashId.toLowerCase().includes(q) ||
            p.id.toLowerCase().includes(q);
          if (!matches) return false;
        }

        // Area Filter
        if (selectedArea !== 'All' && p.area !== selectedArea) {
          return false;
        }

        // Type Filter
        if (selectedType !== 'All' && p.type !== selectedType) {
          return false;
        }

        // Price Range
        if (p.demandPrice < priceRange[0] || p.demandPrice > priceRange[1]) {
          return false;
        }

        // Hot Only
        if (hotOnly && p.hotBadge !== '🔥 HOT PROPERTY') {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'clicks') return b.clicksCount - a.clicksCount;
        if (sortBy === 'price_desc') return b.demandPrice - a.demandPrice;
        if (sortBy === 'price_asc') return a.demandPrice - b.demandPrice;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return 0;
      });
  }, [properties, searchQuery, selectedArea, selectedType, priceRange, hotOnly, sortBy, currentUser]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedArea('All');
    setSelectedType('All');
    setPriceRange([0, 1000000000]);
    setHotOnly(false);
    setSortBy('clicks');
  };

  return (
    <div className="h-screen bg-[#f8f9fa] text-slate-900 flex flex-col font-sans selection:bg-[#0f9d58] selection:text-white overflow-hidden">
      {/* Toast Alert Notification */}
      {latestAlert && (
        <div className="fixed bottom-5 right-5 z-50 bg-white border border-slate-200 shadow-2xl shadow-slate-400/25 text-slate-800 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-[#0f9d58] shrink-0" />
          <span>{latestAlert}</span>
        </div>
      )}

      {/* Main Sticky Navbar with Excel Formula Bar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Excel Property Filter & Tools Bar */}
      <PropertyFilterBar
        selectedArea={selectedArea}
        setSelectedArea={setSelectedArea}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        hotOnly={hotOnly}
        setHotOnly={setHotOnly}
        sortBy={sortBy}
        setSortBy={setSortBy}
        availableAreas={availableAreas}
        totalFiltered={filteredProperties.length}
        filteredProperties={filteredProperties}
        onReset={handleResetFilters}
      />

      {/* Main Interactive Spreadsheet Canvas */}
      <main className="flex-1 w-full bg-white min-h-0 overflow-hidden flex flex-col">
        <ExcelGrid properties={filteredProperties} viewMode={viewMode} />
      </main>

      {/* Modals & Slide-over Drawers */}
      {unlockModalProperty && (
        <UnlockContactModal
          property={unlockModalProperty}
          onClose={() => setUnlockModalProperty(null)}
        />
      )}

      {reportModalProperty && (
        <ReportListingModal
          property={reportModalProperty}
          onClose={() => setReportModalProperty(null)}
        />
      )}

      {isAddPropertyModalOpen && (
        <AddPropertyModal onClose={() => setAddPropertyModalOpen(false)} />
      )}

      {isAuthModalOpen && <AuthModal onClose={() => setAuthModalOpen(false)} />}

      {isAdminOpen && <AdminPanel onClose={() => setIsAdminOpen(false)} />}

      {isMyPropertiesOpen && (
        <MyInventoryModal onClose={() => setIsMyPropertiesOpen(false)} />
      )}

      {isUnlockedLeadsOpen && (
        <UnlockedLeadsModal onClose={() => setIsUnlockedLeadsOpen(false)} />
      )}

      {detailDrawerProperty && (
        <PropertyDetailDrawer
          property={detailDrawerProperty}
          onClose={() => setDetailDrawerProperty(null)}
        />
      )}

      {isBroadcastDrawerOpen && (
        <WhatsAppBroadcastFeed onClose={() => setIsBroadcastDrawerOpen(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <FastPropApp />
    </AppProvider>
  );
}
