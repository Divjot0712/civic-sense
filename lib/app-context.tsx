'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { PageId, UserRole, LanguageCode, AppSettings, District, Notification } from './types';
import { NOTIFICATIONS, BACKGROUND_PRESETS, ACCENT_COLORS } from './mock-data';
import { translate } from './translations';

interface AppContextValue {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  user: { role: UserRole; name: string } | null;
  login: (role: UserRole) => void;
  logout: () => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  selectedDistrict: District | null;
  setSelectedDistrict: (d: District | null) => void;
  notifications: Notification[];
  unreadCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  aiAssistantOpen: boolean;
  setAiAssistantOpen: (open: boolean) => void;
  presentationMode: boolean;
  setPresentationMode: (v: boolean) => void;
  guidedDemoStep: number;
  setGuidedDemoStep: (n: number) => void;
  t: (key: string) => string;
}

const defaultSettings: AppSettings = {
  theme: 'dark',
  background: 'deep-space',
  accentColor: 'blue',
  glassEffect: true,
  animations: true,
  mapStyle: 'dark',
  reducedMotion: false,
  highContrast: false,
  fontSize: 'medium',
  aiResponseStyle: 'detailed',
  confidenceThreshold: 80,
  autoClustering: true,
  autoTranslation: true,
  interfaceLanguage: 'en',
  citizenLanguage: 'hi',
  refreshInterval: 30,
  demoMode: true,
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState<PageId>('overview');
  const [user, setUser] = useState<{ role: UserRole; name: string } | null>(null);
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);
  const [searchOpen, setSearchOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false);
  const [guidedDemoStep, setGuidedDemoStep] = useState(0);

  const login = useCallback((role: UserRole) => {
    const names: Record<UserRole, string> = {
      'government-official': 'Rajesh Kumar',
      'administrator': 'Priya Sharma',
      'planning-officer': 'Amit Patel',
      'analyst': 'Sneha Reddy',
      'auditor': 'Vikram Singh',
    };
    setUser({ role, name: names[role] });
    setCurrentPage('overview');
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setCurrentPage('overview');
  }, []);

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const t = useCallback((key: string) => {
    return translate(key as never, language);
  }, [language]);

  // Apply theme class
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'light') {
      root.classList.add('theme-light');
      root.classList.remove('dark');
    } else {
      root.classList.remove('theme-light');
      root.classList.add('dark');
    }
  }, [settings.theme]);

  // Apply accent color
  useEffect(() => {
    const accent = ACCENT_COLORS.find((a) => a.id === settings.accentColor);
    if (accent) {
      document.documentElement.style.setProperty('--accent-primary', accent.value);
    }
  }, [settings.accentColor]);

  // Apply font size
  useEffect(() => {
    const root = document.documentElement;
    const sizes = { small: '14px', medium: '16px', large: '18px' };
    root.style.fontSize = sizes[settings.fontSize];
  }, [settings.fontSize]);

  // Keyboard shortcut for search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value: AppContextValue = {
    currentPage, setCurrentPage, user, login, logout,
    language, setLanguage, settings, updateSettings,
    selectedDistrict, setSelectedDistrict,
    notifications, unreadCount,
    markNotificationRead, markAllNotificationsRead,
    searchOpen, setSearchOpen,
    aiAssistantOpen, setAiAssistantOpen,
    presentationMode, setPresentationMode,
    guidedDemoStep, setGuidedDemoStep,
    t,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
