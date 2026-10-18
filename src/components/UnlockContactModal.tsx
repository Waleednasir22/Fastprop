import React, { useState, useEffect } from 'react';
import { PropertyListing } from '../types';
import { useApp } from '../context/AppContext';
import {
  calculateLeadFee,
  formatPrice,
  formatExactCurrency,
  generateWhatsAppLink,
} from '../utils/formatters';
import { fireConfetti } from '../utils/confetti';
import {
  ShieldAlert,
  CreditCard,
  Lock,
  CheckCircle2,
  X,
  MessageCircle,
  Phone,
  ArrowRight,
  Sparkles,
  Smartphone,
  Building,
  Info,
} from 'lucide-react';

interface UnlockContactModalProps {
  property: PropertyListing | null;
  onClose: () => void;
}

type Step = 'disclaimer' | 'calculation' | 'payment' | 'unlocked';

export const UnlockContactModal: React.FC<UnlockContactModalProps> = ({ property, onClose }) => {
  const { currentUser, settings, unlockLead } = useApp();

  const [currentStep, setCurrentStep] = useState<Step>('disclaimer');
  const [agreedToDisclaimer, setAgreedToDisclaimer] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    'Credit / Debit Card' | 'JazzCash' | 'EasyPaisa' | 'Direct Bank Transfer'
  >('Credit / Debit Card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 9012');
  const [mobileWalletNumber, setMobileWalletNumber] = useState(currentUser.phone || '+92 300 1234567');
  const [isProcessing, setIsProcessing] = useState(false);
  const [unlockedDetails, setUnlockedDetails] = useState<{
    phone: string;
    name: string;
    transactionRef: string;
  } | null>(null);

  useEffect(() => {
    if (property) {
      setCurrentStep('disclaimer');
      setAgreedToDisclaimer(false);
      setIsProcessing(false);
      setUnlockedDetails(null);
    }
  }, [property]);

  if (!property) return null;

  const feeData = calculateLeadFee(property.demandPrice, settings);

  const handleDisclaimerProceed = () => {
    if (!agreedToDisclaimer) return;
    setCurrentStep('calculation');
  };

  const handleCalculationProceed = () => {
    setCurrentStep('payment');
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    // Simulate real gateway processing delay
    setTimeout(async () => {
      const res = await unlockLead(property, paymentMethod);
      setIsProcessing(false);
      if (res.success) {
        setUnlockedDetails({
          phone: property.sellerPhone,
          name: property.sellerName,
          transactionRef: res.transaction.transactionRef,
        });
        setCurrentStep('unlocked');
        fireConfetti();
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col text-slate-800">
        {/* Modal Header */}
        <div className="bg-[#f8f9fa] px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#0f9d58] border border-emerald-200 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900">Lead Unlock & 0.33% Commission Desk</h2>
              <p className="text-[11px] text-slate-500 font-mono">
                Property ID: <span className="text-[#0f9d58] font-bold">{property.id}</span>
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

        {/* Step Progress Tracker */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-[11px]">
          <div
            className={`flex items-center gap-1.5 font-medium ${
              currentStep === 'disclaimer'
                ? 'text-[#0f9d58] font-bold'
                : 'text-slate-500'
            }`}
          >
            <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
              currentStep === 'disclaimer' ? 'bg-[#0f9d58] text-white border-[#0f9d58]' : 'bg-white border-slate-300'
            }`}>
              1
            </span>
            <span>Legal Terms</span>
          </div>

          <span className="text-slate-300">→</span>

          <div
            className={`flex items-center gap-1.5 font-medium ${
              currentStep === 'calculation'
                ? 'text-[#0f9d58] font-bold'
                : 'text-slate-500'
            }`}
          >
            <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
              currentStep === 'calculation' ? 'bg-[#0f9d58] text-white border-[#0f9d58]' : 'bg-white border-slate-300'
            }`}>
              2
            </span>
            <span>0.33% Fee</span>
          </div>

          <span className="text-slate-300">→</span>

          <div
            className={`flex items-center gap-1.5 font-medium ${
              currentStep === 'payment'
                ? 'text-[#0f9d58] font-bold'
                : 'text-slate-500'
            }`}
          >
            <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
              currentStep === 'payment' ? 'bg-[#0f9d58] text-white border-[#0f9d58]' : 'bg-white border-slate-300'
            }`}>
              3
            </span>
            <span>Checkout</span>
          </div>

          <span className="text-slate-300">→</span>

          <div
            className={`flex items-center gap-1.5 font-medium ${
              currentStep === 'unlocked'
                ? 'text-[#0f9d58] font-bold'
                : 'text-slate-500'
            }`}
          >
            <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
              currentStep === 'unlocked' ? 'bg-[#0f9d58] text-white border-[#0f9d58]' : 'bg-white border-slate-300'
            }`}>
              4
            </span>
            <span>WhatsApp Lead</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          {/* STEP 1: DISCLAIMER POP-UP MODAL */}
          {currentStep === 'disclaimer' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-950">
                <div className="flex items-center gap-2 mb-2 font-bold text-amber-800 text-xs uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Platform Information Disclaimer</span>
                </div>
                <p className="text-xs text-amber-900/90 leading-relaxed font-sans">
                  "Disclaimer: We are purely an information platform connecting buyers and sellers.
                  We do not verify property legalities, titles, or town-planning approvals, and take no
                  responsibility for financial disputes, fraudulent claims, or misrepresentation by
                  brokers or owners. Proceed at your own discretion."
                </p>
              </div>

              {/* Property Snapshot */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                <div className="text-[10px] uppercase text-slate-500 font-mono mb-1 font-semibold">
                  Target Inventory
                </div>
                <div className="font-bold text-slate-900 text-sm">{property.title}</div>
                <div className="flex items-center gap-3 mt-1.5 text-slate-600">
                  <span>
                    Location: <strong className="text-[#0f9d58]">{property.area}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Size: <strong>{property.sizeNumber} {property.sizeUnit}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Demand: <strong className="text-[#0f9d58]">{formatPrice(property.demandPrice, settings)}</strong>
                  </span>
                </div>
              </div>

              {/* Mandatory Checkbox */}
              <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-300 cursor-pointer hover:bg-slate-100/70 transition-colors">
                <input
                  type="checkbox"
                  checked={agreedToDisclaimer}
                  onChange={(e) => setAgreedToDisclaimer(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#0f9d58] focus:ring-[#0f9d58] accent-[#0f9d58]"
                />
                <span className="text-xs text-slate-700 leading-snug">
                  <strong className="text-slate-900">I Agree & Accept Terms:</strong> I acknowledge that FastProp facilitates direct contact and is not party to contracts, token money, or legal title verification.
                </span>
              </label>

              <button
                disabled={!agreedToDisclaimer}
                onClick={handleDisclaimerProceed}
                className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  agreedToDisclaimer
                    ? 'bg-[#0f9d58] hover:bg-[#0d8a4d] text-white shadow-md active:scale-98'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                }`}
              >
                <span>Proceed to Fee Calculation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: DYNAMIC FEE CALCULATION DISPLAY */}
          {currentStep === 'calculation' && (
            <div className="space-y-4">
              <div className="text-center pb-2">
                <h3 className="font-bold text-base text-slate-900">Dynamic 0.33% Lead Fee Calculation</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Transparent pay-per-lead unlocking fee based on verified property demand
                </p>
              </div>

              {/* Detailed Breakdown Card */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-600 font-sans">Property Demand Price:</span>
                  <span className="text-slate-900 font-bold text-sm">
                    {formatExactCurrency(property.demandPrice, settings)}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-600 font-sans">Platform Lead Rate:</span>
                  <span className="text-[#0f9d58] font-bold">
                    {settings.commissionPercent}% (0.33% Model)
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-600 font-sans">Calculated Raw Commission:</span>
                  <span className="text-slate-800">
                    {formatExactCurrency(feeData.rawFee, settings)}
                  </span>
                </div>

                {feeData.isCapped && (
                  <div className="flex items-center justify-between text-amber-800 text-[11px] pb-2 border-b border-slate-200 font-sans bg-amber-50 p-2 rounded">
                    <span className="flex items-center gap-1 font-medium">
                      <Info className="w-3.5 h-3.5" /> Super Admin Cap Applied:
                    </span>
                    <span className="font-mono font-bold">Max Cap: {formatExactCurrency(settings.maxLeadFeeCap, settings)}</span>
                  </div>
                )}

                {feeData.isMinApplied && (
                  <div className="flex items-center justify-between text-blue-800 text-[11px] pb-2 border-b border-slate-200 font-sans bg-blue-50 p-2 rounded">
                    <span className="flex items-center gap-1 font-medium">
                      <Info className="w-3.5 h-3.5" /> Minimum Floor Applied:
                    </span>
                    <span className="font-mono font-bold">Min Fee: {formatExactCurrency(settings.minLeadFee, settings)}</span>
                  </div>
                )}

                {/* Final Fee Box */}
                <div className="pt-2 flex items-center justify-between bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                  <div>
                    <span className="text-[10px] uppercase text-[#0f9d58] block font-bold font-sans">
                      Payable Lead Unlock Fee
                    </span>
                    <span className="text-[11px] text-slate-600 font-sans">100% Instant WhatsApp Unlock</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-[#0f9d58]">
                      {formatExactCurrency(feeData.finalFee, settings)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setCurrentStep('disclaimer')}
                  className="w-1/3 py-2.5 rounded-xl text-xs bg-white hover:bg-slate-50 text-slate-700 font-medium border border-slate-300 transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handleCalculationProceed}
                  className="w-2/3 py-2.5 rounded-xl text-xs font-bold bg-[#0f9d58] hover:bg-[#0d8a4d] text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ONLINE PAYMENT GATEWAY CHECKOUT */}
          {currentStep === 'payment' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Select Payment Gateway</h3>
                  <p className="text-[11px] text-slate-500">Google Pay & SSL Encrypted Checkout</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block font-sans">Total to pay:</span>
                  <span className="font-mono font-bold text-[#0f9d58] text-sm">
                    {formatExactCurrency(feeData.finalFee, settings)}
                  </span>
                </div>
              </div>

              {/* Gateway Method Selector */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Credit / Debit Card')}
                  className={`p-3 rounded-xl border flex items-center gap-2 text-left transition-all cursor-pointer ${
                    paymentMethod === 'Credit / Debit Card'
                      ? 'bg-emerald-50 border-[#0f9d58] text-[#0f9d58] font-bold shadow-2xs'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4 shrink-0 text-[#0f9d58]" />
                  <div>
                    <div className="leading-tight text-slate-900">Debit / Card</div>
                    <div className="text-[10px] text-slate-500 font-normal">Visa / Master</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('JazzCash')}
                  className={`p-3 rounded-xl border flex items-center gap-2 text-left transition-all cursor-pointer ${
                    paymentMethod === 'JazzCash'
                      ? 'bg-emerald-50 border-[#0f9d58] text-[#0f9d58] font-bold shadow-2xs'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Smartphone className="w-4 h-4 shrink-0 text-red-600" />
                  <div>
                    <div className="leading-tight text-slate-900">JazzCash</div>
                    <div className="text-[10px] text-slate-500 font-normal">Mobile Wallet</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('EasyPaisa')}
                  className={`p-3 rounded-xl border flex items-center gap-2 text-left transition-all cursor-pointer ${
                    paymentMethod === 'EasyPaisa'
                      ? 'bg-emerald-50 border-[#0f9d58] text-[#0f9d58] font-bold shadow-2xs'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Smartphone className="w-4 h-4 shrink-0 text-green-600" />
                  <div>
                    <div className="leading-tight text-slate-900">EasyPaisa</div>
                    <div className="text-[10px] text-slate-500 font-normal">Instant Wallet</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Direct Bank Transfer')}
                  className={`p-3 rounded-xl border flex items-center gap-2 text-left transition-all cursor-pointer ${
                    paymentMethod === 'Direct Bank Transfer'
                      ? 'bg-emerald-50 border-[#0f9d58] text-[#0f9d58] font-bold shadow-2xs'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Building className="w-4 h-4 shrink-0 text-blue-600" />
                  <div>
                    <div className="leading-tight text-slate-900">Bank / Raast</div>
                    <div className="text-[10px] text-slate-500 font-normal">Direct Transfer</div>
                  </div>
                </button>
              </div>

              {/* Gateway Input fields */}
              {paymentMethod === 'Credit / Debit Card' ? (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1 font-medium">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono text-xs focus:ring-1 focus:ring-[#0f9d58] focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-600 block mb-1 font-medium">Expiry Date</label>
                      <input
                        type="text"
                        defaultValue="08/28"
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono text-xs focus:ring-1 focus:ring-[#0f9d58] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-600 block mb-1 font-medium">CVV</label>
                      <input
                        type="password"
                        defaultValue="891"
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono text-xs focus:ring-1 focus:ring-[#0f9d58] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <label className="text-[11px] text-slate-600 block mb-1 font-medium">
                    {paymentMethod} Registered Mobile Number
                  </label>
                  <input
                    type="text"
                    value={mobileWalletNumber}
                    onChange={(e) => setMobileWalletNumber(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono text-xs focus:ring-1 focus:ring-[#0f9d58] focus:outline-none"
                    placeholder="+92 300 0000000"
                  />
                  <p className="text-[10px] text-slate-500">
                    A push authorization request will be prompted on your {paymentMethod} app.
                  </p>
                </div>
              )}

              {/* Pay Button */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep('calculation')}
                  className="w-1/3 py-2.5 rounded-xl text-xs bg-white hover:bg-slate-50 text-slate-700 font-medium border border-slate-300 transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleProcessPayment}
                  className="w-2/3 py-2.5 rounded-xl text-xs font-bold bg-[#0f9d58] hover:bg-[#0d8a4d] active:scale-98 text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Authorizing Webhook...
                    </span>
                  ) : (
                    <span>Pay {formatExactCurrency(feeData.finalFee, settings)} & Unlock</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: REAL-TIME INSTANT UNLOCK */}
          {currentStep === 'unlocked' && unlockedDetails && (
            <div className="text-center space-y-4 animate-scaleUp">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-300 text-[#0f9d58] flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="bg-emerald-100 text-[#0f9d58] text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300 uppercase tracking-wider">
                  Payment Verified • Lead Unlocked
                </span>
                <h3 className="font-extrabold text-lg text-slate-900 mt-1">
                  Verified Seller Contact Details
                </h3>
                <p className="text-xs text-slate-500">
                  Reference: <span className="font-mono text-slate-700">{unlockedDetails.transactionRef}</span>
                </p>
              </div>

              {/* Revealed Contact Card */}
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 text-left space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
                  <span className="text-xs text-slate-600">Seller Full Name:</span>
                  <span className="text-sm font-bold text-slate-900">{unlockedDetails.name}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
                  <span className="text-xs text-slate-600">WhatsApp Mobile:</span>
                  <span className="text-sm font-mono font-bold text-[#0f9d58]">
                    {unlockedDetails.phone}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Property:</span>
                  <span className="text-slate-800 font-medium truncate max-w-[200px]">{property.title}</span>
                </div>
              </div>

              {/* Direct Communication Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href={generateWhatsAppLink(
                    unlockedDetails.phone,
                    property.title,
                    property.id,
                    formatPrice(property.demandPrice, settings)
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-[#0f9d58] hover:bg-[#0d8a4d] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>

                <a
                  href={`tel:${unlockedDetails.phone.replace(/\s+/g, '')}`}
                  className="py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 border border-slate-300 shadow-2xs transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-[#0f9d58]" />
                  <span>Call Directly</span>
                </a>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer mt-2"
              >
                Done & Return to Sheets
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
