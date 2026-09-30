'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/app-context';
import type { PageId } from '@/lib/types';
import {
  LayoutDashboard, Mic, Map, Building2, BrainCircuit, FolderKanban,
  TrendingUp, SlidersHorizontal, FileText, Database, Settings,
  Bell, HelpCircle, User, Activity, ChevronLeft, X,
} from 'lucide-react';

const navItems: { id: PageId; labelKey: string; icon: React.ElementType }[] = [
  { id: 'overview', labelKey: 'overview', icon: LayoutDashboard },
  { id: 'citizen-voice', labelKey: 'citizenVoice', icon: Mic },
  { id: 'demand-map', labelKey: 'demandMap', icon: Map },
  { id: 'infrastructure', labelKey: 'infrastructure', icon: Building2 },
  { id: 'ai-insights', labelKey: 'aiInsights', icon: BrainCircuit },
  { id: 'projects', labelKey: 'projects', icon: FolderKanban },
  { id: 'impact', labelKey: 'impact', icon: TrendingUp },
  { id: 'simulator', labelKey: 'simulator', icon: SlidersHorizontal },
  { id: 'reports', labelKey: 'reports', icon: FileText },
  { id: 'data-explorer', labelKey: 'dataExplorer', icon: Database },
  { id: 'settings', labelKey: 'settings', icon: Settings },
];

export function Sidebar() {
  const { currentPage, setCurrentPage, user, logout, t, settings, presentationMode } = useApp();

  if (presentationMode) return null;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 h-screen sticky top-0 bg-secondary border-r border-c shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-c shrink-0">
          <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-sm border border-white/20 shrink-0 overflow-hidden">
            <img src="/logo.png" alt="CIVIC SENSE Logo" className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-t-primary tracking-tight truncate">CIVIC-SENSE</h1>
            <p className="text-[10px] text-t-muted leading-none mt-0.5 truncate">AI Infrastructure Intelligence</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2">
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const active = currentPage === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`group w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all relative ${
                    active
                      ? 'bg-accent-primary/10 text-t-primary'
                      : 'text-t-secondary hover:text-t-primary hover:bg-surface'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-accent-primary"
                    />
                  )}
                  <Icon className={`w-4 h-4 shrink-0 ${active ? 'accent-primary' : ''}`} />
                  <span className="truncate">{t(item.labelKey)}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Bottom section */}
        <div className="border-t border-c p-2 space-y-0.5">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-t-secondary hover:text-t-primary hover:bg-surface transition-all">
            <Bell className="w-4 h-4" />
            <span>{t('notifications')}</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-t-secondary hover:text-t-primary hover:bg-surface transition-all">
            <HelpCircle className="w-4 h-4" />
            <span>{t('help')}</span>
          </button>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-surface">
            <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 accent-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-t-primary truncate">{user?.name || 'Guest'}</p>
              <button onClick={logout} className="text-[10px] text-t-muted hover:text-t-primary">
                Sign out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-secondary border-t border-c">
        <div className="flex items-center justify-around px-2 py-2 overflow-x-auto scrollbar-thin">
          {navItems.slice(0, 7).map((item) => {
            const active = currentPage === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg shrink-0 transition-colors ${
                  active ? 'accent-primary' : 'text-t-muted'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[9px] font-medium">{t(item.labelKey).split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
