import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageCircle,
  X,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Smartphone,
  Lock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { sendWhatsAppOtp, verifyWhatsAppOtp, users } = useApp();

  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+92 300 7861122');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [simulatedWhatsAppBanner, setSimulatedWhatsAppBanner] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate phone
    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.length < 10) {
      setError('Please provide a valid WhatsApp number with country code (e.g. +92 300 1234567)');
      return;
    }

    // Check if phone belongs to permanently banned user
    const existing = users.find((u) => u.phone === cleanPhone);
    if (existing && existing.isBanned) {
      setError('This WhatsApp mobile number is permanently blacklisted under our 3-Strike Anti-Fraud Policy.');
      return;
    }

    setIsSending(true);
    const res = await sendWhatsAppOtp(cleanPhone, name);
    setIsSending(false);

    if (res.success) {
      setGeneratedOtp(res.otp);
      setSimulatedWhatsAppBanner(`[WhatsApp Cloud API] FastProp verification code: ${res.otp}`);
      setStep('otp');
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const success = verifyWhatsAppOtp(phone.trim(), generatedOtp, otp.trim(), name);
    if (success) {
      onClose();
    } else {
      setError('Invalid OTP code. Please enter the 6-digit code sent to your WhatsApp.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col text-slate-800">
        {/* Header */}
        <div className="bg-[#f8f9fa] px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#0f9d58] border border-emerald-200 flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900">WhatsApp OTP Authentication</h2>
              <p className="text-[11px] text-slate-500">Verified Realtor & Buyer Onboarding</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Simulated Incoming WhatsApp Notification banner */}
        {simulatedWhatsAppBanner && (
          <div className="bg-emerald-50 border-b border-emerald-200 p-3 text-xs flex items-center justify-between animate-slideDown">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#0f9d58] flex items-center justify-center text-white shrink-0 shadow-2xs">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-emerald-800 font-bold uppercase block font-mono">
                  WhatsApp Alert Simulation
                </span>
                <span className="text-slate-900 font-mono font-bold">{simulatedWhatsAppBanner}</span>
              </div>
            </div>

            <button
              onClick={() => setOtp(generatedOtp)}
              className="bg-[#0f9d58] hover:bg-[#0d8a4d] text-white font-bold px-2 py-1 rounded text-[10px] shrink-0 transition-colors cursor-pointer shadow-2xs"
              title="Quick auto-fill"
            >
              Auto-Fill
            </button>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {step === 'input' ? (
            <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] text-slate-700 font-bold block mb-1">
                  Full Name / Agency Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Asad Rehman (Al-Haram Real Estate)"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0f9d58]"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-700 font-bold block mb-1">
                  WhatsApp Mobile Number (With Country Code)
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#0f9d58]"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  We lock your verified WhatsApp number to prevent duplicate inventory and broker spam.
                </p>
              </div>

              <div>
                <label className="text-[11px] text-slate-700 font-bold block mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@realtor.pk"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0f9d58]"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-2.5 rounded-xl bg-[#0f9d58] hover:bg-[#0d8a4d] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSending ? (
                  <span>Dispatching WhatsApp OTP...</span>
                ) : (
                  <>
                    <span>Send 6-Digit WhatsApp OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
              <div className="text-center pb-2">
                <span className="text-xs text-slate-600">
                  Enter the 6-digit code dispatched to WhatsApp:
                </span>
                <span className="block font-mono text-sm font-bold text-[#0f9d58] mt-0.5">
                  {phone}
                </span>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="• • • • • •"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 text-center text-xl font-mono tracking-widest text-[#0f9d58] font-bold focus:outline-none focus:ring-2 focus:ring-[#0f9d58]"
                  autoFocus
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="w-1/3 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-medium border border-slate-300 transition-colors cursor-pointer"
                >
                  Change
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-[#0f9d58] hover:bg-[#0d8a4d] text-white font-bold shadow-md transition-all cursor-pointer"
                >
                  Verify & Enter FastProp
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
