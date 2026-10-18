import React from 'react';
import { PropertyType, PropertyListing } from '../types';
import {
  Filter,
  Download,
  RotateCcw,
  Flame,
  ArrowUpDown,
  Building,
  MapPin,
  Coins,
} from 'lucide-react';

interface FilterBarProps {
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  hotOnly: boolean;
  setHotOnly: (val: boolean) => void;
  sortBy: 'clicks' | 'price_desc' | 'price_asc' | 'newest';
  setSortBy: (sort: 'clicks' | 'price_desc' | 'price_asc' | 'newest') => void;
  availableAreas: string[];
  totalFiltered: number;
  filteredProperties: PropertyListing[];
  onReset: () => void;
}

const PROPERTY_TYPES: (PropertyType | 'All')[] = [
  'All',
  'Commercial Plot',
  'Residential Plot',
  'Residential House',
  'Apartment / Flat',
  'Commercial Shop',
  'Upper / Lower Portion',
  'Penthouse',
  'Farmhouse',
];

export const PropertyFilterBar: React.FC<FilterBarProps> = ({
  selectedArea,
  setSelectedArea,
  selectedType,
  setSelectedType,
  priceRange,
  setPriceRange,
  hotOnly,
  setHotOnly,
  sortBy,
  setSortBy,
  availableAreas,
  totalFiltered,
  filteredProperties,
  onReset,
}) => {
  // CSV Export utility
  const handleExportCSV = () => {
    if (!filteredProperties.length) return;

    const headers = [
      'ID',
      'Title',
      'Area',
      'City',
      'Type',
      'Size',
      'Demand (PKR)',
      'Status',
      'Clicks',
      'Seller Hash ID',
      'Created Date',
    ];

    const rows = filteredProperties.map((p) => [
      `"${p.id}"`,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.area}"`,
      `"${p.city}"`,
      `"${p.type}"`,
      `"${p.sizeNumber} ${p.sizeUnit}"`,
      p.demandPrice,
      `"${p.hotBadge}"`,
      p.clicksCount,
      `"${p.sellerHashId}"`,
      `"${new Date(p.createdAt).toLocaleDateString()}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fastprop_inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="shrink-0 bg-white border-b border-slate-200 px-4 py-2.5 text-xs shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Quick Filter Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Area Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 shadow-2xs hover:border-slate-400">
            <MapPin className="w-3.5 h-3.5 text-[#0f9d58] shrink-0" />
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="bg-transparent text-slate-800 focus:outline-none cursor-pointer pr-1 font-medium"
            >
              <option value="All" className="bg-white text-slate-800">
                All Corridors ({availableAreas.length})
              </option>
              {availableAreas.map((area) => (
                <option key={area} value={area} className="bg-white text-slate-800">
                  {area}
                </option>
              ))}
            </select>
          </div>

          {/* Property Type Dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 shadow-2xs hover:border-slate-400">
            <Building className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-transparent text-slate-800 focus:outline-none cursor-pointer pr-1 font-medium"
            >
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type} className="bg-white text-slate-800">
                  {type === 'All' ? 'All Property Types' : type}
                </option>
              ))}
            </select>
          </div>

          {/* Price Quick Presets */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 shadow-2xs hover:border-slate-400">
            <Coins className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <select
              value={
                priceRange[1] === 10000000
                  ? 'under_1cr'
                  : priceRange[0] === 10000000 && priceRange[1] === 50000000
                  ? '1_to_5cr'
                  : priceRange[0] === 50000000 && priceRange[1] === 100000000
                  ? '5_to_10cr'
                  : priceRange[0] === 100000000
                  ? 'above_10cr'
                  : 'all'
              }
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'under_1cr') setPriceRange([0, 10000000]);
                else if (val === '1_to_5cr') setPriceRange([10000000, 50000000]);
                else if (val === '5_to_10cr') setPriceRange([50000000, 100000000]);
                else if (val === 'above_10cr') setPriceRange([100000000, 1000000000]);
                else setPriceRange([0, 1000000000]);
              }}
              className="bg-transparent text-slate-800 focus:outline-none cursor-pointer pr-1 font-medium"
            >
              <option value="all" className="bg-white text-slate-800">
                Any Price Range
              </option>
              <option value="under_1cr" className="bg-white text-slate-800">
                Under 1 Crore (&lt; 10M)
              </option>
              <option value="1_to_5cr" className="bg-white text-slate-800">
                1 to 5 Crore
              </option>
              <option value="5_to_10cr" className="bg-white text-slate-800">
                5 to 10 Crore
              </option>
              <option value="above_10cr" className="bg-white text-slate-800">
                10 Crore+ (Prime)
              </option>
            </select>
          </div>

          {/* Hot Badge Toggle */}
          <button
            onClick={() => setHotOnly(!hotOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              hotOnly
                ? 'bg-amber-50 border-amber-400 text-amber-900 font-bold shadow-2xs'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${hotOnly ? 'text-amber-600 animate-bounce' : 'text-slate-400'}`} />
            <span>🔥 Hot Only (&gt;50 Clicks)</span>
          </button>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 shadow-2xs hover:border-slate-400">
            <ArrowUpDown className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-800 focus:outline-none cursor-pointer pr-1 font-medium"
            >
              <option value="clicks" className="bg-white text-slate-800">
                Most Viewed (Clicks)
              </option>
              <option value="newest" className="bg-white text-slate-800">
                Newest Listed
              </option>
              <option value="price_asc" className="bg-white text-slate-800">
                Price: Low to High
              </option>
              <option value="price_desc" className="bg-white text-slate-800">
                Price: High to Low
              </option>
            </select>
          </div>
        </div>

        {/* Action Buttons: Reset & Export to CSV */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-mono text-[11px] mr-1">
            Showing <strong className="text-[#0f9d58] font-semibold">{totalFiltered}</strong> rows
          </span>

          <button
            onClick={onReset}
            className="flex items-center gap-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer shadow-2xs"
            title="Reset all filters"
          >
            <RotateCcw className="w-3 h-3 text-slate-500" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-[#0f9d58] hover:bg-[#0d8a4d] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer"
            title="Download visible inventory as CSV spreadsheet"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
};
