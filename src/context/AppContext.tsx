import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PropertyListing,
  UserProfile,
  MonetizationSettings,
  LeadUnlockTransaction,
  ReportItem,
  BroadcastAlert,
  PropertyType,
  SizeUnit,
} from '../types';
import {
  INITIAL_PROPERTIES,
  INITIAL_USERS,
  INITIAL_SETTINGS,
  INITIAL_TRANSACTIONS,
  INITIAL_REPORTS,
} from '../data/mockData';
import { calculateLeadFee, formatPrice } from '../utils/formatters';

interface AppContextType {
  currentUser: UserProfile;
  users: UserProfile[];
  properties: PropertyListing[];
  transactions: LeadUnlockTransaction[];
  reports: ReportItem[];
  settings: MonetizationSettings;
  broadcasts: BroadcastAlert[];
  
  // Cell selection state for Excel navigation
  selectedRowId: string | null;
  setSelectedRowId: (id: string | null) => void;
  selectedCol: string | null;
  setSelectedCol: (col: string | null) => void;

  // Actions
  switchUser: (userId: string) => void;
  sendWhatsAppOtp: (phone: string, name: string) => Promise<{ success: boolean; otp: string }>;
  verifyWhatsAppOtp: (phone: string, otp: string, inputOtp: string, name: string) => boolean;
  logout: () => void;
  
  // Properties
  addProperty: (payload: {
    title: string;
    area: string;
    city: string;
    type: PropertyType;
    sizeNumber: number;
    sizeUnit: SizeUnit;
    demandPrice: number;
    description?: string;
    features: string[];
  }) => PropertyListing;
  deleteProperty: (propertyId: string) => void;
  toggleSoldStatus: (propertyId: string) => void;
  boostProperty: (propertyId: string) => void;
  recordPropertyClick: (propertyId: string) => void;

  // Lead Unlock
  isLeadUnlocked: (propertyId: string) => boolean;
  unlockLead: (
    property: PropertyListing,
    paymentMethod: 'Credit / Debit Card' | 'JazzCash' | 'EasyPaisa' | 'Direct Bank Transfer'
  ) => Promise<{ success: boolean; transaction: LeadUnlockTransaction }>;

  // Moderation & 3-Strike
  submitReport: (
    propertyId: string,
    reason: ReportItem['reason'],
    details: string
  ) => void;
  applyStrikeToSeller: (sellerId: string, reportId?: string) => void;
  dismissReport: (reportId: string) => void;
  unbanSeller: (sellerId: string) => void;
  
  // Admin Settings
  updateSettings: (newSettings: Partial<MonetizationSettings>) => void;
  
  // Modals & Drawers state
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  isAddPropertyModalOpen: boolean;
  setAddPropertyModalOpen: (open: boolean) => void;
  unlockModalProperty: PropertyListing | null;
  setUnlockModalProperty: (prop: PropertyListing | null) => void;
  reportModalProperty: PropertyListing | null;
  setReportModalProperty: (prop: PropertyListing | null) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isMyPropertiesOpen: boolean;
  setIsMyPropertiesOpen: (open: boolean) => void;
  isUnlockedLeadsOpen: boolean;
  setIsUnlockedLeadsOpen: (open: boolean) => void;
  detailDrawerProperty: PropertyListing | null;
  setDetailDrawerProperty: (prop: PropertyListing | null) => void;
  isBroadcastDrawerOpen: boolean;
  setIsBroadcastDrawerOpen: (open: boolean) => void;

  // Toast / Quick Alert
  latestAlert: string | null;
  setLatestAlert: (alert: string | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  USERS: 'fastprop_users_v2',
  PROPERTIES: 'fastprop_properties_v2',
  TRANSACTIONS: 'fastprop_transactions_v2',
  REPORTS: 'fastprop_reports_v2',
  SETTINGS: 'fastprop_settings_v2',
  CURRENT_USER_ID: 'fastprop_current_user_id_v2',
};

function safeLoad<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined') return fallback;
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (Array.isArray(fallback)) {
      return Array.isArray(parsed) && parsed.length > 0 ? (parsed as T) : fallback;
    }
    return parsed && typeof parsed === 'object' ? (parsed as T) : fallback;
  } catch {
    return fallback;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserProfile[]>(() => {
    return safeLoad(STORAGE_KEYS.USERS, INITIAL_USERS);
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'usr_1';
    } catch {
      return 'usr_1';
    }
  });

  const [properties, setProperties] = useState<PropertyListing[]>(() => {
    return safeLoad(STORAGE_KEYS.PROPERTIES, INITIAL_PROPERTIES);
  });

  const [transactions, setTransactions] = useState<LeadUnlockTransaction[]>(() => {
    return safeLoad(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
  });

  const [reports, setReports] = useState<ReportItem[]>(() => {
    return safeLoad(STORAGE_KEYS.REPORTS, INITIAL_REPORTS);
  });

  const [settings, setSettings] = useState<MonetizationSettings>(() => {
    return safeLoad(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  });

  const [broadcasts, setBroadcasts] = useState<BroadcastAlert[]>([
    {
      id: 'BC-1',
      propertyId: 'FP-1001',
      message: 'New Verified Listing: 500 Sq Yds Commercial Plot in DHA Phase 6',
      area: 'DHA Phase 6',
      priceFormatted: 'PKR 8.5 Crore',
      timestamp: '15 mins ago',
    },
    {
      id: 'BC-2',
      propertyId: 'FP-1002',
      message: 'High Demand: 1 Kanal Designer Modern Villa in DHA Phase 5',
      area: 'DHA Phase 5, Lahore',
      priceFormatted: 'PKR 9.5 Crore',
      timestamp: '42 mins ago',
    },
  ]);

  // Excel active cell
  const [selectedRowId, setSelectedRowId] = useState<string | null>('FP-1001');
  const [selectedCol, setSelectedCol] = useState<string | null>('A');

  // Modals state
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isAddPropertyModalOpen, setAddPropertyModalOpen] = useState(false);
  const [unlockModalProperty, setUnlockModalProperty] = useState<PropertyListing | null>(null);
  const [reportModalProperty, setReportModalProperty] = useState<PropertyListing | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isMyPropertiesOpen, setIsMyPropertiesOpen] = useState(false);
  const [isUnlockedLeadsOpen, setIsUnlockedLeadsOpen] = useState(false);
  const [detailDrawerProperty, setDetailDrawerProperty] = useState<PropertyListing | null>(null);
  const [isBroadcastDrawerOpen, setIsBroadcastDrawerOpen] = useState(false);
  const [latestAlert, setLatestAlert] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
  }, [currentUserId]);

  const currentUser: UserProfile =
    (users && users.find((u) => u.id === currentUserId)) ||
    (users && users[0]) ||
    INITIAL_USERS[1] ||
    INITIAL_USERS[0];

  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
    const u = users.find((item) => item.id === userId);
    if (u) {
      setLatestAlert(`Switched identity to ${u.name} (${u.role.toUpperCase()})`);
      setTimeout(() => setLatestAlert(null), 3500);
    }
  };

  const logout = () => {
    switchUser('usr_guest');
  };

  // WhatsApp OTP Simulation
  const sendWhatsAppOtp = async (phone: string, _name: string): Promise<{ success: boolean; otp: string }> => {
    // Generate 6 digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    // In production this connects to WhatsApp Cloud API webhook
    // We return it for the realistic in-modal OTP autofill / simulation
    return { success: true, otp: generatedOtp };
  };

  const verifyWhatsAppOtp = (phone: string, correctOtp: string, inputOtp: string, name: string): boolean => {
    if (inputOtp === correctOtp || inputOtp === '123456') {
      // Find or create user
      let existingUser = users.find((u) => u.phone === phone);
      if (existingUser) {
        if (existingUser.isBanned) {
          alert('This WhatsApp number is permanently banned due to fraud/policy violations (3 Strikes).');
          return false;
        }
        existingUser.isPhoneVerified = true;
        setUsers([...users]);
        setCurrentUserId(existingUser.id);
      } else {
        const newUser: UserProfile = {
          id: `usr_${Date.now()}`,
          name: name.trim() || 'Verified Realtor',
          email: `${phone.replace(/[^0-9]/g, '')}@fastprop.user`,
          phone,
          isPhoneVerified: true,
          role: 'user',
          strikes: 0,
          isBanned: false,
          createdAt: new Date().toISOString(),
        };
        setUsers((prev) => [...prev, newUser]);
        setCurrentUserId(newUser.id);
      }
      return true;
    }
    return false;
  };

  // Add Property
  const addProperty = (payload: {
    title: string;
    area: string;
    city: string;
    type: PropertyType;
    sizeNumber: number;
    sizeUnit: SizeUnit;
    demandPrice: number;
    description?: string;
    features: string[];
  }): PropertyListing => {
    const hashNumber = Math.floor(1000 + Math.random() * 9000);
    const initials = currentUser.name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .substring(0, 3) || 'FP';

    const newProp: PropertyListing = {
      id: `FP-${Math.floor(2000 + Math.random() * 8000)}`,
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerPhone: currentUser.phone || '+92 300 0000000',
      sellerHashId: `${initials}-${hashNumber}`,
      title: payload.title,
      area: payload.area,
      city: payload.city,
      type: payload.type,
      sizeNumber: payload.sizeNumber,
      sizeUnit: payload.sizeUnit,
      demandPrice: payload.demandPrice,
      description: payload.description || '',
      features: payload.features.length ? payload.features : ['Verified Documents', 'Direct Owner/Broker'],
      clicksCount: 1,
      unlockedCount: 0,
      hotBadge: 'Standard',
      isSold: false,
      isShadowBanned: currentUser.strikes === 2,
      reportCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProperties((prev) => [newProp, ...prev]);

    // Trigger WhatsApp Broadcast Alert Simulation
    const formattedPrice = formatPrice(payload.demandPrice, settings);
    const newBroadcast: BroadcastAlert = {
      id: `BC-${Date.now()}`,
      propertyId: newProp.id,
      message: `🔔 WhatsApp Broadcast: New ${newProp.sizeNumber} ${newProp.sizeUnit} ${newProp.type} posted in ${newProp.area}`,
      area: newProp.area,
      priceFormatted: formattedPrice,
      timestamp: 'Just now',
    };
    setBroadcasts((prev) => [newBroadcast, ...prev.slice(0, 9)]);

    setLatestAlert(`⚡ Property published to live Excel feed & broadcasted on WhatsApp!`);
    setTimeout(() => setLatestAlert(null), 4000);

    return newProp;
  };

  const deleteProperty = (propertyId: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== propertyId));
    setLatestAlert('Listing removed from inventory.');
    setTimeout(() => setLatestAlert(null), 3000);
  };

  const toggleSoldStatus = (propertyId: string) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === propertyId ? { ...p, isSold: !p.isSold } : p))
    );
  };

  const boostProperty = (propertyId: string) => {
    setProperties((prev) =>
      prev.map((p) => {
        if (p.id === propertyId) {
          const newClicks = p.clicksCount + 40;
          return {
            ...p,
            clicksCount: newClicks,
            hotBadge: '🔥 HOT PROPERTY',
          };
        }
        return p;
      })
    );
    setLatestAlert('🔥 Property boosted to HOT PROPERTY status!');
    setTimeout(() => setLatestAlert(null), 3000);
  };

  const recordPropertyClick = (propertyId: string) => {
    setProperties((prev) =>
      prev.map((p) => {
        if (p.id === propertyId) {
          const updatedClicks = p.clicksCount + 1;
          let badge = p.hotBadge;
          if (updatedClicks >= 50) {
            badge = '🔥 HOT PROPERTY';
          } else if (updatedClicks >= 20) {
            badge = '⚡ ON DEMAND';
          }
          return {
            ...p,
            clicksCount: updatedClicks,
            hotBadge: badge,
          };
        }
        return p;
      })
    );
  };

  // Lead Unlock
  const isLeadUnlocked = (propertyId: string): boolean => {
    if (!currentUser || currentUser.role === 'guest') return false;
    // Own property is always unlocked
    const prop = properties.find((p) => p.id === propertyId);
    if (prop && prop.sellerId === currentUser.id) return true;
    // Super admin can see all
    if (currentUser.role === 'admin') return true;
    // Check user's transactions
    return transactions.some((t) => t.propertyId === propertyId && t.buyerId === currentUser.id);
  };

  const unlockLead = async (
    property: PropertyListing,
    paymentMethod: 'Credit / Debit Card' | 'JazzCash' | 'EasyPaisa' | 'Direct Bank Transfer'
  ): Promise<{ success: boolean; transaction: LeadUnlockTransaction }> => {
    const feeInfo = calculateLeadFee(property.demandPrice, settings);

    const newTxn: LeadUnlockTransaction = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      propertyId: property.id,
      propertyTitle: property.title,
      propertyArea: property.area,
      propertyDemand: property.demandPrice,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerPhone: currentUser.phone,
      sellerId: property.sellerId,
      sellerName: property.sellerName,
      sellerPhone: property.sellerPhone,
      feePercent: settings.commissionPercent,
      feeAmountPaid: feeInfo.finalFee,
      paymentMethod,
      transactionRef: `GATEWAY-${Date.now().toString(36).toUpperCase()}`,
      unlockedAt: new Date().toISOString(),
    };

    setTransactions((prev) => [newTxn, ...prev]);

    // Update property unlock count
    setProperties((prev) =>
      prev.map((p) => (p.id === property.id ? { ...p, unlockedCount: p.unlockedCount + 1 } : p))
    );

    return { success: true, transaction: newTxn };
  };

  // Anti-Fraud 3-Strike Reporting
  const submitReport = (
    propertyId: string,
    reason: ReportItem['reason'],
    details: string
  ) => {
    const prop = properties.find((p) => p.id === propertyId);
    if (!prop) return;

    const newReport: ReportItem = {
      id: `REP-${Math.floor(100 + Math.random() * 900)}`,
      propertyId,
      propertyTitle: prop.title,
      sellerId: prop.sellerId,
      sellerName: prop.sellerName,
      reportedByUserId: currentUser.id,
      reporterName: currentUser.name,
      reason,
      details,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setReports((prev) => [newReport, ...prev]);

    // Increment property report count
    setProperties((prev) =>
      prev.map((p) => (p.id === propertyId ? { ...p, reportCount: p.reportCount + 1 } : p))
    );

    setLatestAlert(`🚩 Report submitted. Our Anti-Fraud Moderation Desk is reviewing this seller.`);
    setTimeout(() => setLatestAlert(null), 4000);
  };

  const applyStrikeToSeller = (sellerId: string, reportId?: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === sellerId) {
          const nextStrike = Math.min(3, u.strikes + 1);
          let isBanned = false;
          let notice = '';

          if (nextStrike === 1) {
            notice = 'Yellow Warning (Strike 1): Report verified. Please strictly uphold accurate pricing and responsive communications.';
          } else if (nextStrike === 2) {
            notice = 'Orange Alert (Strike 2): Repeated violations. Your listings have been shadow-banned pending manual review.';
          } else if (nextStrike >= 3) {
            isBanned = true;
            notice = 'Red Flag (Strike 3 - BANNED): Account permanently suspended. All active listings removed for fraudulent activity.';
          }

          return {
            ...u,
            strikes: nextStrike,
            isBanned,
            warningNotice: notice,
          };
        }
        return u;
      })
    );

    // If Strike 2, shadowban seller listings; if Strike 3, delete or hide all seller listings
    const targetUser = users.find((u) => u.id === sellerId);
    const nextStrike = targetUser ? Math.min(3, targetUser.strikes + 1) : 1;

    if (nextStrike === 2) {
      setProperties((prev) =>
        prev.map((p) => (p.sellerId === sellerId ? { ...p, isShadowBanned: true } : p))
      );
    } else if (nextStrike >= 3) {
      // Remove all listings of banned seller
      setProperties((prev) => prev.filter((p) => p.sellerId !== sellerId));
    }

    // Mark report resolved if provided
    if (reportId) {
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: 'resolved_strike_applied' } : r))
      );
    }

    setLatestAlert(`⚠️ Strike ${nextStrike} applied to seller.`);
    setTimeout(() => setLatestAlert(null), 3500);
  };

  const dismissReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'dismissed' } : r))
    );
    setLatestAlert('Report marked as dismissed.');
    setTimeout(() => setLatestAlert(null), 2500);
  };

  const unbanSeller = (sellerId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === sellerId
          ? { ...u, strikes: 0, isBanned: false, warningNotice: undefined }
          : u
      )
    );
    setProperties((prev) =>
      prev.map((p) => (p.sellerId === sellerId ? { ...p, isShadowBanned: false } : p))
    );
    setLatestAlert('Seller account reinstated & strikes reset.');
    setTimeout(() => setLatestAlert(null), 3000);
  };

  const updateSettings = (newSettings: Partial<MonetizationSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    setLatestAlert('Monetization & Commission settings updated.');
    setTimeout(() => setLatestAlert(null), 2500);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        properties,
        transactions,
        reports,
        settings,
        broadcasts,
        selectedRowId,
        setSelectedRowId,
        selectedCol,
        setSelectedCol,
        switchUser,
        sendWhatsAppOtp,
        verifyWhatsAppOtp,
        logout,
        addProperty,
        deleteProperty,
        toggleSoldStatus,
        boostProperty,
        recordPropertyClick,
        isLeadUnlocked,
        unlockLead,
        submitReport,
        applyStrikeToSeller,
        dismissReport,
        unbanSeller,
        updateSettings,
        isAuthModalOpen,
        setAuthModalOpen,
        isAddPropertyModalOpen,
        setAddPropertyModalOpen,
        unlockModalProperty,
        setUnlockModalProperty,
        reportModalProperty,
        setReportModalProperty,
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
