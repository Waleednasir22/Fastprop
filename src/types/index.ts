export type UserRole = 'guest' | 'user' | 'admin';

export type PropertyType =
  | 'Residential Plot'
  | 'Commercial Plot'
  | 'Residential House'
  | 'Apartment / Flat'
  | 'Commercial Shop'
  | 'Upper / Lower Portion'
  | 'Penthouse'
  | 'Farmhouse';

export type SizeUnit = 'Sq. Yards' | 'Marla' | 'Kanal' | 'Sq. Feet';

export type HotBadge = '🔥 HOT PROPERTY' | '⚡ ON DEMAND' | 'Standard';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string; // WhatsApp verified number
  isPhoneVerified: boolean;
  role: UserRole;
  strikes: number; // 0 = Clean, 1 = Yellow Warning, 2 = Orange Shadowban, 3 = Red Banned
  isBanned: boolean;
  warningNotice?: string;
  createdAt: string;
}

export interface PropertyListing {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerPhone: string; // Real WhatsApp number
  sellerHashId: string; // Anonymous ID e.g. "FP-8492"
  title: string;
  area: string; // e.g. "DHA Phase 6"
  city: string; // Karachi, Lahore, Islamabad, etc.
  type: PropertyType;
  sizeNumber: number;
  sizeUnit: SizeUnit;
  demandPrice: number; // in PKR
  description?: string;
  features: string[]; // e.g. ['Corner', 'West Open', 'Main Boulevard', 'Park Facing']
  clicksCount: number;
  unlockedCount: number;
  hotBadge: HotBadge;
  isSold: boolean;
  isShadowBanned: boolean; // Flag 2
  reportCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReportItem {
  id: string;
  propertyId: string;
  propertyTitle: string;
  sellerId: string;
  sellerName: string;
  reportedByUserId: string;
  reporterName: string;
  reason:
    | 'Fake / Wrong Price Listed'
    | 'Seller Not Responding / Misbehavior'
    | 'Already Sold Out'
    | 'Misrepresented Property Details';
  details: string;
  status: 'pending' | 'resolved_strike_applied' | 'dismissed';
  createdAt: string;
}

export interface LeadUnlockTransaction {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyArea: string;
  propertyDemand: number;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  feePercent: number; // 0.33%
  feeAmountPaid: number;
  paymentMethod: 'Credit / Debit Card' | 'JazzCash' | 'EasyPaisa' | 'Direct Bank Transfer';
  transactionRef: string;
  unlockedAt: string;
}

export interface MonetizationSettings {
  commissionPercent: number; // Default 0.33
  minLeadFee: number; // e.g. PKR 1,500
  maxLeadFeeCap: number; // 0 = unlimited, or e.g. PKR 50,000
  fixedFeeModeEnabled: boolean;
  fixedFeeAmount: number;
  currency: 'PKR' | 'USD' | 'AED';
  currencyRateToPKR: number; // 1 for PKR, ~278 for USD, ~75 for AED
}

export interface BroadcastAlert {
  id: string;
  propertyId: string;
  message: string;
  area: string;
  priceFormatted: string;
  timestamp: string;
}
