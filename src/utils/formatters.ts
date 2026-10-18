import { MonetizationSettings } from '../types';

export function formatPrice(amountPKR: number, settings: MonetizationSettings): string {
  if (settings.currency === 'USD') {
    const usd = Math.round(amountPKR / (settings.currencyRateToPKR || 278));
    return `$${usd.toLocaleString()}`;
  }
  if (settings.currency === 'AED') {
    const aed = Math.round(amountPKR / (settings.currencyRateToPKR || 75));
    return `AED ${aed.toLocaleString()}`;
  }

  // PKR formatting with Lakh & Crore helpers
  if (amountPKR >= 10000000) {
    const crore = (amountPKR / 10000000).toFixed(2).replace(/\.00$/, '');
    return `PKR ${crore} Crore`;
  } else if (amountPKR >= 100000) {
    const lakh = (amountPKR / 100000).toFixed(2).replace(/\.00$/, '');
    return `PKR ${lakh} Lakh`;
  } else {
    return `PKR ${amountPKR.toLocaleString()}`;
  }
}

export function formatExactCurrency(amountPKR: number, settings: MonetizationSettings): string {
  if (settings.currency === 'USD') {
    const usd = Math.round(amountPKR / 278);
    return `$${usd.toLocaleString()}`;
  }
  if (settings.currency === 'AED') {
    const aed = Math.round(amountPKR / 75);
    return `AED ${aed.toLocaleString()}`;
  }
  return `PKR ${Math.round(amountPKR).toLocaleString()}`;
}

export function calculateLeadFee(
  demandPKR: number,
  settings: MonetizationSettings
): {
  rawFee: number;
  finalFee: number;
  isCapped: boolean;
  isMinApplied: boolean;
  rateApplied: number;
} {
  if (settings.fixedFeeModeEnabled) {
    return {
      rawFee: settings.fixedFeeAmount,
      finalFee: settings.fixedFeeAmount,
      isCapped: false,
      isMinApplied: false,
      rateApplied: 0,
    };
  }

  const rate = settings.commissionPercent / 100;
  const rawFee = Math.round(demandPKR * rate);
  let finalFee = rawFee;
  let isMinApplied = false;
  let isCapped = false;

  if (settings.minLeadFee && finalFee < settings.minLeadFee) {
    finalFee = settings.minLeadFee;
    isMinApplied = true;
  }

  if (settings.maxLeadFeeCap && settings.maxLeadFeeCap > 0 && finalFee > settings.maxLeadFeeCap) {
    finalFee = settings.maxLeadFeeCap;
    isCapped = true;
  }

  return {
    rawFee,
    finalFee,
    isCapped,
    isMinApplied,
    rateApplied: settings.commissionPercent,
  };
}

export function maskPhone(phone: string): string {
  if (!phone) return '+92 3•• •••••••';
  // Keep country code + first 2 digits of mobile code, mask rest
  const cleaned = phone.trim();
  if (cleaned.length < 8) return '••••••••••';
  return cleaned.substring(0, 7) + ' ••• ••••';
}

export function maskSellerName(name: string): string {
  if (!name) return 'Verified Broker';
  const parts = name.split(' ');
  if (parts.length === 1) return `${parts[0][0]}••••`;
  return `${parts[0]} ${parts[1][0]}••••`;
}

export function generateWhatsAppLink(
  phone: string,
  propertyTitle: string,
  propertyId: string,
  demandFormatted: string
): string {
  const digits = phone.replace(/[^0-9]/g, '');
  const message = encodeURIComponent(
    `Salam! I am reaching out through FastProp regarding your listing: "${propertyTitle}" (ID: ${propertyId}, Listed: ${demandFormatted}). Is this inventory still available for inspection / final offer?`
  );
  return `https://wa.me/${digits}?text=${message}`;
}
