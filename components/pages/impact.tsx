'use client';

import { useApp } from '@/lib/app-context';
import { PageHeader, formatINR } from '@/components/shared';
import { PROJECTS } from '@/lib/mock-data';
import { IndianRupee, Building2, TrendingUp, Users, CheckCircle2, ArrowDown, Clock, Smile, Frown, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Cell } from 'recharts';

const flowSteps = [
  { icon: IndianRupee, label: 'Investment', color: 'accent-success' },
  { icon: Building2, label: 'Project', color: 'accent-primary' },
  { icon: TrendingUp, label: 'Infrastructure Improvement', color: 'accent-cyan' },
  { icon: Users, label: 'Citizen Experience', color: 'accent-warning' },
  { icon: CheckCircle2, label: 'Measured Impact', color: 'accent-success' },
];

export function ImpactPage() {
  const { t } = useApp();
  const completedProjects = PROJECTS.filter((p) => p.status === 'completed' || p.status === 'in-progress');

  const totalInvestment = PROJECTS.reduce((sum, p) => sum + p.budget, 0);
  const totalPop = PROJECTS.reduce((sum, p) => sum + p.affectedPopulation, 0);
  const avgImprovement = Math.round(PROJECTS.reduce((sum, p) => sum + (p.infraScoreAfter - p.infraScoreBefore), 0) / PROJECTS.length);
  const satisfactionGain = Math.round(PROJECTS.reduce((sum, p) => sum + (p.impact.satisfactionAfter - p.impact.satisfactionBefore), 0) / PROJECTS.length);

  const trendData = [
    { month: 'Jan', complaints: 42000, satisfaction: 52 },
    { month: 'Feb', complaints: 38000, satisfaction: 55 },
    { month: 'Mar', complaints: 34000, satisfaction: 58 },
    { month: 'Apr', complaints: 31000, satisfaction: 61 },
    { month: 'May', complaints: 28000, satisfaction: 64 },
    { month: 'Jun', complaints: 24000, satisfaction: 67 },
    { month: 'Jul', complaints: 21000, satisfaction: 70 },
    { month: 'Aug', complaints: 18000, satisfaction: 73 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={t('fromInvestmentToImpact')} subtitle="Tracking the full journey from government investment to measurable citizen impact." />

      {/* Flow visualization */}
      <div className="rounded-xl bg-surface border border-c p-6">
        <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-thin pb-2">
          {flowSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="flex items-center gap-2 shrink-0">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.15 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className={`w-12 h-12 rounded-xl bg-${step.color}/20 flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${step.color}`} />
                  </div>
                  <span className="text-[10px] text-t-secondary whitespace-nowrap">{step.label}</span>
                </motion.div>
                {i < flowSteps.length - 1 && (
                  <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: i * 0.15 + 0.1 }} className="w-8 h-px bg-border-c origin-left" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl bg-surface border border-c p-4">
          <div className="flex items-center gap-1.5 mb-1"><IndianRupee className="w-3.5 h-3.5 accent-success" /><span className="text-[10px] text-t-muted">Total Investment</span></div>
          <p className="text-xl font-bold text-t-primary">{formatINR(totalInvestment)}</p>
        </div>
        <div className="rounded-xl bg-surface border border-c p-4">
          <div className="flex items-center gap-1.5 mb-1"><Users className="w-3.5 h-3.5 accent-cyan" /><span className="text-[10px] text-t-muted">Population Reached</span></div>
          <p className="text-xl font-bold text-t-primary">{(totalPop / 1000000).toFixed(1)}M</p>
        </div>
        <div className="rounded-xl bg-surface border border-c p-4">
          <div className="flex items-center gap-1.5 mb-1"><TrendingUp className="w-3.5 h-3.5 accent-primary" /><span className="text-[10px] text-t-muted">Avg Infra Improvement</span></div>
          <p className="text-xl font-bold accent-success">+{avgImprovement}</p>
        </div>
        <div className="rounded-xl bg-surface border border-c p-4">
          <div className="flex items-center gap-1.5 mb-1"><Smile className="w-3.5 h-3.5 accent-warning" /><span className="text-[10px] text-t-muted">Satisfaction Gain</span></div>
          <p className="text-xl font-bold accent-success">+{satisfactionGain}%</p>
        </div>
      </div>

      {/* Trend charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl bg-surface border border-c p-4">
          <h3 className="text-sm font-semibold text-t-primary mb-3">Complaints Reduction Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="impactGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34A853" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#34A853" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,48,73,0.3)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0D1B2A', border: '1px solid #1E3050', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="complaints" stroke="#34A853" strokeWidth={2} fill="url(#impactGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl bg-surface border border-c p-4">
          <h3 className="text-sm font-semibold text-t-primary mb-3">Citizen Satisfaction Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="satGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4285F4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4285F4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,48,73,0.3)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: '#0D1B2A', border: '1px solid #1E3050', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="satisfaction" stroke="#4285F4" strokeWidth={2} fill="url(#satGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Project impact cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-t-primary">Project Impact Details</h3>
        {completedProjects.map((p) => (
          <div key={p.id} className="rounded-xl bg-surface border border-c p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-t-primary">{p.name}</p>
                <p className="text-xs text-t-muted">{p.districtName} · {formatINR(p.budget)}</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="text-center">
                  <p className="text-t-muted">Before</p>
                  <p className="text-t-primary font-medium">{p.impact.complaintsBefore.toLocaleString()}</p>
                </div>
                <ArrowDown className="w-4 h-4 accent-success" />
                <div className="text-center">
                  <p className="text-t-muted">After</p>
                  <p className="accent-success font-medium">{p.impact.complaintsAfter.toLocaleString()}</p>
                </div>
                <div className="text-center ml-4">
                  <p className="text-t-muted">Infra</p>
                  <p className="text-t-primary font-medium">{p.infraScoreBefore} → <span className="accent-success">{p.infraScoreAfter}</span></p>
                </div>
                <div className="text-center ml-4">
                  <p className="text-t-muted">Resolution</p>
                  <p className="text-t-primary font-medium">{p.impact.resolutionDaysBefore}d → <span className="accent-success">{p.impact.resolutionDaysAfter}d</span></p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex items-center gap-2 rounded-lg bg-base border border-c px-3 py-2">
                <Smile className="w-3.5 h-3.5 accent-success" />
                <div className="text-xs"><span className="text-t-muted">Satisfaction:</span> <span className="text-t-primary font-medium">{p.impact.satisfactionBefore}% → {p.impact.satisfactionAfter}%</span></div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-base border border-c px-3 py-2">
                <Clock className="w-3.5 h-3.5 accent-warning" />
                <div className="text-xs"><span className="text-t-muted">Resolution:</span> <span className="text-t-primary font-medium">{p.impact.resolutionDaysBefore}d → {p.impact.resolutionDaysAfter}d</span></div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-base border border-c px-3 py-2">
                <TrendingUp className="w-3.5 h-3.5 accent-primary" />
                <div className="text-xs"><span className="text-t-muted">Improvement:</span> <span className="accent-success font-medium">+{Math.round((1 - p.impact.complaintsAfter / p.impact.complaintsBefore) * 100)}%</span></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
