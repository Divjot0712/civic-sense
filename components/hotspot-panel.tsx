'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/app-context';
import type { District } from '@/lib/types';
import { CATEGORY_LABELS } from '@/lib/mock-data';
import { X, Search, FolderPlus, SlidersHorizontal, FileText, TrendingUp, Users, Building2, IndianRupee, AlertCircle } from 'lucide-react';
import { SeverityBadge, formatINR } from './shared';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export function HotspotPanel({ district, onClose }: { district: District; onClose: () => void }) {
  const { setCurrentPage, setSelectedDistrict } = useApp();

  const topIssues = Object.entries(district.demandByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const chartData = topIssues.map(([key, value]) => ({
    name: CATEGORY_LABELS[key as keyof typeof CATEGORY_LABELS],
    value,
    fill: key === 'water' ? '#4285F4' : key === 'roads' ? '#00C2FF' : key === 'electricity' ? '#FBBC04' : key === 'waste' ? '#F97316' : key === 'healthcare' ? '#34A853' : '#EA4335',
  }));

  const aiAssessment = district.infrastructureIndex < 50
    ? 'High infrastructure demand combined with below-average service availability suggests a significant infrastructure gap. Immediate intervention recommended.'
    : district.infrastructureIndex < 65
    ? 'Moderate demand with acceptable infrastructure levels. Monitor trends and plan preventive maintenance.'
    : 'Infrastructure is generally adequate for current demand levels. Focus on maintenance and quality improvement.';

  const handleNavigate = (page: string) => {
    setSelectedDistrict(district);
    setCurrentPage(page as never);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 bottom-0 z-[55] w-full max-w-sm bg-secondary border-l border-c flex flex-col"
      >
        <div className="flex items-center justify-between px-4 h-14 border-b border-c shrink-0">
          <div>
            <h3 className="text-sm font-bold text-t-primary">{district.name}</h3>
            <p className="text-xs text-t-muted">{district.stateName}</p>
          </div>
          <button onClick={onClose} className="text-t-muted hover:text-t-primary p-1.5 rounded-lg hover:bg-surface transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          {/* Key metrics */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-surface border border-c p-3">
              <div className="flex items-center gap-1.5 mb-1"><TrendingUp className="w-3.5 h-3.5 accent-primary" /><span className="text-[10px] text-t-muted">Demand</span></div>
              <p className="text-lg font-bold text-t-primary">{district.citizenRequests.toLocaleString()}</p>
              <p className="text-[10px] text-t-muted">citizen requests</p>
            </div>
            <div className="rounded-lg bg-surface border border-c p-3">
              <div className="flex items-center gap-1.5 mb-1"><Users className="w-3.5 h-3.5 accent-cyan" /><span className="text-[10px] text-t-muted">Population</span></div>
              <p className="text-lg font-bold text-t-primary">{(district.population / 1000000).toFixed(1)}M</p>
              <p className="text-[10px] text-t-muted">residents</p>
            </div>
            <div className="rounded-lg bg-surface border border-c p-3">
              <div className="flex items-center gap-1.5 mb-1"><Building2 className="w-3.5 h-3.5 accent-warning" /><span className="text-[10px] text-t-muted">Infra Index</span></div>
              <p className="text-lg font-bold text-t-primary">{district.infrastructureIndex}<span className="text-xs text-t-muted">/100</span></p>
            </div>
            <div className="rounded-lg bg-surface border border-c p-3">
              <div className="flex items-center gap-1.5 mb-1"><IndianRupee className="w-3.5 h-3.5 accent-success" /><span className="text-[10px] text-t-muted">Investment</span></div>
              <p className="text-lg font-bold text-t-primary">{formatINR(district.investment)}</p>
            </div>
          </div>

          {/* Resolution rate */}
          <div className="rounded-lg bg-surface border border-c p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-t-muted">Complaint Resolution Rate</span>
              <span className="text-sm font-semibold text-t-primary">{district.resolvedRate}%</span>
            </div>
            <div className="h-2 rounded-full bg-base overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${district.resolvedRate}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-accent-primary to-accent-cyan"
              />
            </div>
          </div>

          {/* Top issues chart */}
          <div>
            <p className="text-xs font-medium text-t-secondary mb-2">Top Issues</p>
            <div className="rounded-lg bg-surface border border-c p-3">
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={chartData} layout="horizontal">
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip cursor={{ fill: 'rgba(66,133,244,0.1)' }} contentStyle={{ background: '#0D1B2A', border: '1px solid #1E3050', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Assessment */}
          <div className="rounded-lg bg-accent-primary/5 border border-accent-primary/20 p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <AlertCircle className="w-3.5 h-3.5 accent-primary" />
              <span className="text-xs font-medium accent-primary">AI Assessment</span>
            </div>
            <p className="text-xs text-t-secondary leading-relaxed">{aiAssessment}</p>
          </div>

          {/* Under-reported warning */}
          {district.underReported && (
            <div className="rounded-lg bg-accent-warning/10 border border-accent-warning/30 p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <AlertCircle className="w-3.5 h-3.5 accent-warning" />
                <span className="text-xs font-medium accent-warning">Potentially Under-Reported</span>
              </div>
              <p className="text-xs text-t-secondary">Low digital connectivity may mean actual demand is higher than reported.</p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="border-t border-c p-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => handleNavigate('ai-insights')} className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-surface border border-c text-xs text-t-secondary hover:text-t-primary hover:border-accent-primary/30 transition-colors">
              <Search className="w-3.5 h-3.5" /> Investigate
            </button>
            <button onClick={() => handleNavigate('projects')} className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-surface border border-c text-xs text-t-secondary hover:text-t-primary hover:border-accent-primary/30 transition-colors">
              <FolderPlus className="w-3.5 h-3.5" /> Create Project
            </button>
            <button onClick={() => handleNavigate('simulator')} className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-surface border border-c text-xs text-t-secondary hover:text-t-primary hover:border-accent-primary/30 transition-colors">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Simulate
            </button>
            <button onClick={() => handleNavigate('reports')} className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-surface border border-c text-xs text-t-secondary hover:text-t-primary hover:border-accent-primary/30 transition-colors">
              <FileText className="w-3.5 h-3.5" /> Report
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
