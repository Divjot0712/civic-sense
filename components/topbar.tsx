'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/app-context';
import { Search, Bell, Sparkles, ChevronDown, Command, X } from 'lucide-react';
import { LANGUAGES } from '@/lib/translations';
import { DISTRICTS, PROJECTS } from '@/lib/mock-data';
import type { PageId } from '@/lib/types';

const pageTitles: Record<PageId, string> = {
  overview: 'National Infrastructure Intelligence',
  'citizen-voice': 'Citizen Voice',
  'demand-map': 'Demand Map',
  infrastructure: 'Infrastructure Health',
  'ai-insights': 'AI Infrastructure Analyst',
  projects: 'Government Projects',
  impact: 'From Investment to Impact',
  simulator: 'Infrastructure Investment Simulator',
  reports: 'Report Generator',
  'data-explorer': 'Data Explorer',
  settings: 'Settings',
};

export function TopBar() {
  const { currentPage, language, setLanguage, setSearchOpen, aiAssistantOpen, setAiAssistantOpen, notifications, unreadCount, markNotificationRead, setCurrentPage, t, user, presentationMode, setPresentationMode } = useApp();
  const [langOpen, setLangOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const currentLang = LANGUAGES.find((l) => l.code === language);

  const handleSearchClick = () => setSearchOpen(true);

  const handleNotificationClick = (page: PageId) => {
    setCurrentPage(page);
    setNotifOpen(false);
  };

  if (presentationMode) {
    return (
      <div className="hidden lg:flex items-center justify-between h-14 px-6 border-b border-c bg-secondary/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white p-0.5 flex items-center justify-center shadow-sm border border-white/20 shrink-0 overflow-hidden">
            <img src="/logo.png" alt="CIVIC SENSE" className="w-full h-full object-contain" />
          </div>
          <span className="text-sm font-bold text-t-primary">CIVIC-SENSE — Presentation Mode</span>
        </div>
        <button
          onClick={() => setPresentationMode(false)}
          className="text-xs text-t-secondary hover:text-t-primary px-3 py-1.5 rounded-lg border border-c hover:bg-surface transition-colors"
        >
          Exit Presentation
        </button>
      </div>
    );
  }

  return (
    <header className="sticky top-0 z-30 h-14 flex items-center justify-between px-4 lg:px-6 border-b border-c bg-secondary/80 backdrop-blur-md">
      {/* Left: page title */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="lg:hidden w-7 h-7 rounded-lg bg-white p-0.5 flex items-center justify-center shadow-sm border border-white/20 shrink-0 overflow-hidden">
          <img src="/logo.png" alt="CIVIC SENSE" className="w-full h-full object-contain" />
        </div>
        <h2 className="text-sm font-semibold text-t-primary truncate">
          {pageTitles[currentPage]}
        </h2>
      </div>

      {/* Center: search */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          onClick={handleSearchClick}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-surface border border-c hover:border-accent-primary/30 transition-colors text-left"
        >
          <Search className="w-4 h-4 text-t-muted" />
          <span className="text-sm text-t-muted flex-1">{t('search')}</span>
          <kbd className="flex items-center gap-0.5 text-[10px] text-t-muted px-1.5 py-0.5 rounded border border-c bg-elevated">
            <Command className="w-2.5 h-2.5" />K
          </kbd>
        </button>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1.5">
        {/* Mobile search */}
        <button
          onClick={handleSearchClick}
          className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-t-secondary hover:bg-surface transition-colors"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Language selector */}
        <div ref={langRef} className="relative">
          <button
            onClick={() => setLangOpen((p) => !p)}
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-t-secondary hover:bg-surface transition-colors"
          >
            <span className="text-sm font-medium hidden sm:inline">{currentLang?.label}</span>
            <span className="text-sm sm:hidden">{currentLang?.code.toUpperCase()}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <AnimatePresence>
            {langOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute right-0 top-full mt-1 w-44 max-h-72 overflow-y-auto scrollbar-thin rounded-xl border border-c bg-popover shadow-xl z-50"
              >
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-surface transition-colors ${
                      language === lang.code ? 'accent-primary font-medium' : 'text-t-secondary'
                    }`}
                  >
                    <span>{lang.label}</span>
                    <span className="text-xs text-t-muted">{lang.nativeLabel}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen((p) => !p)}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center text-t-secondary hover:bg-surface transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-accent-critical text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute right-0 top-full mt-1 w-80 max-h-96 overflow-y-auto scrollbar-thin rounded-xl border border-c bg-popover shadow-xl z-50"
              >
                <div className="px-3 py-2 border-b border-c flex items-center justify-between">
                  <span className="text-sm font-semibold text-t-primary">Notifications</span>
                  <span className="text-xs text-t-muted">{unreadCount} unread</span>
                </div>
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => { markNotificationRead(n.id); handleNotificationClick(n.page); }}
                    className="w-full flex items-start gap-2.5 px-3 py-2.5 hover:bg-surface transition-colors text-left border-b border-c/50"
                  >
                    <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      n.type === 'critical' ? 'bg-accent-critical' :
                      n.type === 'warning' ? 'bg-accent-warning' :
                      n.type === 'success' ? 'bg-accent-success' : 'bg-accent-info'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-t-primary">{n.title}</p>
                      <p className="text-xs text-t-muted truncate">{n.description}</p>
                      <p className="text-[10px] text-t-muted mt-0.5">{n.time}</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* AI Assistant */}
        <button
          onClick={() => setAiAssistantOpen(!aiAssistantOpen)}
          className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors ${
            aiAssistantOpen
              ? 'bg-accent-primary/20 accent-primary'
              : 'text-t-secondary hover:bg-surface'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">{t('aiAssistant')}</span>
        </button>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen((p) => !p)}
            className="w-9 h-9 rounded-lg bg-accent-primary/20 flex items-center justify-center text-sm font-bold accent-primary hover:bg-accent-primary/30 transition-colors"
          >
            {user?.name?.charAt(0) || 'G'}
          </button>
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute right-0 top-full mt-1 w-56 rounded-xl border border-c bg-popover shadow-xl z-50"
              >
                <div className="px-3 py-3 border-b border-c">
                  <p className="text-sm font-medium text-t-primary">{user?.name}</p>
                  <p className="text-xs text-t-muted capitalize">{user?.role.replace('-', ' ')}</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={() => { setPresentationMode(true); setProfileOpen(false); }}
                    className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-t-secondary hover:bg-surface hover:text-t-primary transition-colors"
                  >
                    <Sparkles className="w-4 h-4" /> Presentation Mode
                  </button>
                  <button
                    onClick={() => { setCurrentPage('settings'); setProfileOpen(false); }}
                    className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-t-secondary hover:bg-surface hover:text-t-primary transition-colors"
                  >
                    <span>Settings</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

export function SearchModal() {
  const { searchOpen, setSearchOpen, setCurrentPage } = useApp();
  const [query, setQuery] = useState('');

  const results: { type: string; label: string; sublabel: string; page: PageId }[] = [];

  if (query.length > 0) {
    const q = query.toLowerCase();
    DISTRICTS.forEach((d) => {
      if (d.name.toLowerCase().includes(q) || d.stateName.toLowerCase().includes(q)) {
        results.push({ type: 'District', label: d.name, sublabel: d.stateName, page: 'demand-map' });
      }
    });
    PROJECTS.forEach((p) => {
      if (p.name.toLowerCase().includes(q) || p.districtName.toLowerCase().includes(q)) {
        results.push({ type: 'Project', label: p.name, sublabel: p.districtName, page: 'projects' });
      }
    });
  }

  const pages: { label: string; page: PageId }[] = [
    { label: 'Overview', page: 'overview' },
    { label: 'Citizen Voice', page: 'citizen-voice' },
    { label: 'Demand Map', page: 'demand-map' },
    { label: 'Infrastructure', page: 'infrastructure' },
    { label: 'AI Insights', page: 'ai-insights' },
    { label: 'Projects', page: 'projects' },
    { label: 'Impact', page: 'impact' },
    { label: 'Simulator', page: 'simulator' },
    { label: 'Reports', page: 'reports' },
    { label: 'Data Explorer', page: 'data-explorer' },
    { label: 'Settings', page: 'settings' },
  ];

  pages.forEach((p) => {
    if (p.label.toLowerCase().includes(query.toLowerCase())) {
      results.push({ type: 'Page', label: p.label, sublabel: '', page: p.page });
    }
  });

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4" onClick={() => setSearchOpen(false)}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-xl rounded-2xl border border-c bg-popover shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-c">
          <Search className="w-4 h-4 text-t-muted" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search districts, projects, complaints…"
            className="flex-1 bg-transparent text-sm text-t-primary placeholder:text-t-muted outline-none"
          />
          <button onClick={() => setSearchOpen(false)} className="text-t-muted hover:text-t-primary">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto scrollbar-thin">
          {results.length === 0 && query.length > 0 && (
            <div className="px-4 py-8 text-center text-sm text-t-muted">No results found for "{query}"</div>
          )}
          {query.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-t-muted">Start typing to search…</div>
          )}
          {results.slice(0, 12).map((r, i) => (
            <button
              key={i}
              onClick={() => { setCurrentPage(r.page); setSearchOpen(false); setQuery(''); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface transition-colors text-left"
            >
              <span className="text-[10px] font-medium text-t-muted uppercase px-1.5 py-0.5 rounded bg-elevated">{r.type}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-t-primary truncate">{r.label}</p>
                {r.sublabel && <p className="text-xs text-t-muted truncate">{r.sublabel}</p>}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
