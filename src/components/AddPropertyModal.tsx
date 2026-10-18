import React, { useState } from 'react';
import { PropertyType, SizeUnit } from '../types';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/formatters';
import {
  Building2,
  X,
  PlusCircle,
  MapPin,
  Lock,
  Sparkles,
  CheckCircle,
  Radio,
  Coins,
} from 'lucide-react';

interface AddPropertyModalProps {
  onClose: () => void;
}

const COMMON_AREAS = [
  'DHA Phase 6, Karachi',
  'DHA Phase 5, Lahore',
  'DHA Phase 8, Karachi',
  'DHA Phase 7, Lahore',
  'Bahria Town Precinct 10, Karachi',
  'Gulshan-e-Iqbal Block 13D, Karachi',
  'Sector F-7 Markaz, Islamabad',
  'Clifton Block 4, Karachi',
  'E-11/2, Islamabad',
  'Chak Shahzad, Islamabad',
  'Gulberg III, Lahore',
  'Bahria Town Phase 8, Rawalpindi',
];

const PROPERTY_TYPES: PropertyType[] = [
  'Commercial Plot',
  'Residential Plot',
  'Residential House',
  'Apartment / Flat',
  'Commercial Shop',
  'Upper / Lower Portion',
  'Penthouse',
  'Farmhouse',
];

const SIZE_UNITS: SizeUnit[] = ['Sq. Yards', 'Marla', 'Kanal', 'Sq. Feet'];

const FEATURE_TAGS = [
  'Corner Plot',
  'West Open',
  'Park Facing',
  'Main Boulevard',
  '100ft Wide Road',
  'Ready Possession',
  'Utilities Paid',
  'Basement Available',
  'Brand New Construction',
  'Solar Powered',
];

export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({ onClose }) => {
  const { currentUser, addProperty, settings, setAuthModalOpen } = useApp();

  const [title, setTitle] = useState('');
  const [area, setArea] = useState('DHA Phase 6');
  const [city, setCity] = useState('Karachi');
  const [customArea, setCustomArea] = useState('');
  const [type, setType] = useState<PropertyType>('Residential Plot');
  const [sizeNumber, setSizeNumber] = useState<number>(500);
  const [sizeUnit, setSizeUnit] = useState<SizeUnit>('Sq. Yards');
  const [demandPrice, setDemandPrice] = useState<number>(55000000);
  const [description, setDescription] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['Corner Plot', 'West Open']);
  const [sellerName, setSellerName] = useState(currentUser.name);

  // If user is not phone verified or is guest, prompt verification
  if (currentUser.role === 'guest' || !currentUser.isPhoneVerified) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
        <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 text-center text-slate-800 space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#0f9d58] border border-emerald-200 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900">WhatsApp Verification Required</h3>
          <p className="text-xs text-slate-500">
            To prevent spam brokers and duplicate inventory, all sellers must authenticate their WhatsApp mobile number.
          </p>
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-1/2 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onClose();
                setAuthModalOpen(true);
              }}
              className="w-1/2 py-2 rounded-lg bg-[#0f9d58] hover:bg-[#0d8a4d] text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              Verify WhatsApp
            </button>
          </div>
        </div>
      </div>
    );
  }

  const toggleFeature = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalArea = customArea.trim() ? customArea.trim() : area;
    const finalTitle =
      title.trim() ||
      `${sizeNumber} ${sizeUnit} ${type} in ${finalArea}`;

    addProperty({
      title: finalTitle,
      area: finalArea,
      city,
      type,
      sizeNumber: Number(sizeNumber) || 1,
      sizeUnit,
      demandPrice: Number(demandPrice) || 1000000,
      description,
      features: selectedFeatures,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col text-slate-800 max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#f8f9fa] px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#0f9d58] border border-emerald-200 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900">Post New Property Inventory</h2>
              <p className="text-[11px] text-slate-500">
                Instant publishing to live spreadsheet feed & WhatsApp broadcast
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Location & Area Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-700 font-bold block mb-1">
                Area / Corridor (Select Preset)
              </label>
              <select
                value={area}
                onChange={(e) => {
                  setArea(e.target.value);
                  if (e.target.value.includes('Lahore')) setCity('Lahore');
                  else if (e.target.value.includes('Islamabad') || e.target.value.includes('Rawalpindi')) setCity('Islamabad');
                  else setCity('Karachi');
                }}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0f9d58] cursor-pointer"
              >
                {COMMON_AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-700 font-bold block mb-1">
                Or Custom Area / Street
              </label>
              <input
                type="text"
                value={customArea}
                onChange={(e) => setCustomArea(e.target.value)}
                placeholder="e.g. DHA Phase 6 Main Khayaban-e-Hafiz"
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0f9d58]"
              />
            </div>
          </div>

          {/* Property Type & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-700 font-bold block mb-1">
                Property Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as PropertyType)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0f9d58] cursor-pointer"
              >
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-700 font-bold block mb-1">
                City / Jurisdiction
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0f9d58] cursor-pointer"
              >
                <option value="Karachi">Karachi</option>
                <option value="Lahore">Lahore</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Rawalpindi">Rawalpindi</option>
                <option value="Peshawar">Peshawar</option>
              </select>
            </div>
          </div>

          {/* Size & Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-700 font-bold block mb-1">
                Size (Numeric)
              </label>
              <input
                type="number"
                min={1}
                value={sizeNumber}
                onChange={(e) => setSizeNumber(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#0f9d58]"
                required
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-700 font-bold block mb-1">
                Size Unit
              </label>
              <select
                value={sizeUnit}
                onChange={(e) => setSizeUnit(e.target.value as SizeUnit)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0f9d58] cursor-pointer"
              >
                {SIZE_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Demand / Selling Price with Live Conversion */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] text-slate-700 font-bold">
                Demand / Selling Price (PKR)
              </label>
              <span className="font-mono text-xs font-bold text-[#0f9d58] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {formatPrice(demandPrice, settings)}
              </span>
            </div>
            <input
              type="number"
              step={100000}
              min={100000}
              value={demandPrice}
              onChange={(e) => setDemandPrice(Number(e.target.value))}
              placeholder="e.g. 85000000 for 8.5 Crore"
              className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-[#0f9d58]"
              required
            />
            <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-slate-500 font-mono">
              <span>Quick Presets:</span>
              <button
                type="button"
                onClick={() => setDemandPrice(15000000)}
                className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 border border-slate-200 cursor-pointer"
              >
                1.5 Cr
              </button>
              <button
                type="button"
                onClick={() => setDemandPrice(35000000)}
                className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 border border-slate-200 cursor-pointer"
              >
                3.5 Cr
              </button>
              <button
                type="button"
                onClick={() => setDemandPrice(85000000)}
                className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 border border-slate-200 cursor-pointer"
              >
                8.5 Cr
              </button>
              <button
                type="button"
                onClick={() => setDemandPrice(150000000)}
                className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 border border-slate-200 cursor-pointer"
              >
                15 Cr
              </button>
            </div>
          </div>

          {/* Title & Description */}
          <div>
            <label className="text-[11px] text-slate-700 font-bold block mb-1">
              Headline Title (Optional - auto-generated if blank)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 500 Sq Yds Prime Commercial Plot on 100ft Main Road"
              className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0f9d58]"
            />
          </div>

          {/* Feature Highlights Pills */}
          <div>
            <label className="text-[11px] text-slate-700 font-bold block mb-1.5">
              Key Property Highlights
            </label>
            <div className="flex flex-wrap gap-1.5">
              {FEATURE_TAGS.map((tag) => {
                const active = selectedFeatures.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleFeature(tag)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer ${
                      active
                        ? 'bg-emerald-50 text-[#0f9d58] border-emerald-300 font-semibold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {active ? '✓ ' : '+ '}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contact Verification Banner (Anti-Spam Measure) */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-mono font-semibold">
                Verified Seller Contact (Locked)
              </span>
              <span className="font-bold text-slate-900">{currentUser.name}</span>
              <span className="text-[#0f9d58] font-mono ml-2 font-bold">
                {currentUser.phone}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-[#0f9d58] bg-emerald-50 px-2 py-1 rounded border border-emerald-200 font-bold">
              <CheckCircle className="w-3 h-3" />
              <span>Anti-Spam Protected</span>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-medium border border-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-2/3 py-2.5 rounded-xl bg-[#0f9d58] hover:bg-[#0d8a4d] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Radio className="w-4 h-4 text-white animate-pulse" />
              <span>Publish to Feed & Broadcast</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
