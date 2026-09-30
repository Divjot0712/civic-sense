'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/lib/app-context';
import { IndiaMap } from '@/components/india-map';
import { HotspotPanel } from '@/components/hotspot-panel';
import { KPICard, PageHeader, formatINR } from '@/components/shared';
import { DISTRICTS, CLUSTERS, PROJECTS, getTotalCitizenRequests, getTotalPopulation, getAvgInfrastructureIndex, getTotalInvestment, getAvgResolvedRate, getActiveHotspots, AI_INSIGHTS } from '@/lib/mock-data';
import type { PageId } from '@/lib/types';
import { Mic, MapPin, Building2, FolderKanban, Users, CheckCircle2, Play, Sparkles, ArrowRight, TrendingUp, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid } from 'recharts';

const guidedSteps: { title: string; page: PageId; icon: React.ElementType }[] = [
  { title: 'Citizen submits voice complaint', page: 'citizen-voice', icon: Mic },
  { title: 'AI analyzes and classifies the issue', page: 'ai-insights', icon: Sparkles },
  { title: 'Request appears on the national map', page: 'demand-map', icon: MapPin },
  { title: 'AI clusters similar requests', page: 'citizen-voice', icon: TrendingUp },
  { title: 'Demand hotspot emerges', page: 'demand-map', icon: AlertTriangle },
  { title: 'Government sees infrastructure gap', page: 'infrastructure', icon: Building2 },
  { title: 'Investment simulator predicts impact', page: 'simulator', icon: TrendingUp },
  { title: 'Impact dashboard measures results', page: 'impact', icon: CheckCircle2 },
];

export function OverviewPage() {
  const { t, setSelectedDistrict, setCurrentPage, setPresentationMode, settings, selectedDistrict } = useApp();
  const [panelOpen, setPanelOpen] = useState(false);
  const [guidedStep, setGuidedStep] = useState(0);

  const totalRequests = getTotalCitizenRequests();
  const totalPop = getTotalPopulation();
  const avgInfra = getAvgInfrastructureIndex();
  const totalInv = getTotalInvestment();
  const avgResolved = getAvgResolvedRate();
  const hotspots = getActiveHotspots();

  // Top demand districts
  const topDemand = [...DISTRICTS].sort((a, b) => b.citizenRequests - a.citizenRequests).slice(0, 6);
  const demandChart = topDemand.map((d) => ({ name: d.name.split(' ')[0], requests: d.citizenRequests }));

  // Demand trend (mock)
  const trendData = [
    { month: 'Apr', requests: 820000, resolved: 610000 },
    { month: 'May', requests: 910000, resolved: 680000 },
    { month: 'Jun', requests: 980000, resolved: 740000 },
    { month: 'Jul', requests: 1050000, resolved: 790000 },
    { month: 'Aug', requests: 1180000, resolved: 890000 },
    { month: 'Sep', requests: 1280000, resolved: 982000 },
  ];

  const handleDistrictClick = (d: typeof DISTRICTS[0]) => {
    setSelectedDistrict(d);
    setPanelOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader title={t('nationalInfrastructureIntelligence')} subtitle="Real-time understanding of citizen demand, infrastructure gaps and public investment.">
        <div className="flex items-center gap-2 mt-4">
          {settings.demoMode && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-warning/10 border border-accent-warning/30 text-xs font-medium accent-warning">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-warning animate-pulse" /> {t('demoData')}
            </span>
          )}
          <button
            onClick={() => setGuidedStep(guidedStep + 1)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-primary/20 accent-primary text-xs font-medium hover:bg-accent-primary/30 transition-colors"
          >
            <Play className="w-3.5 h-3.5" /> {t('startGuidedDemo')}
          </button>
          <button
            onClick={() => setPresentationMode(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-c text-xs font-medium text-t-secondary hover:text-t-primary hover:border-accent-primary/30 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" /> {t('presentationMode')}
          </button>
        </div>
      </PageHeader>

      {/* Guided demo flow */}
      {guidedStep > 0 && guidedStep <= guidedSteps.length && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="rounded-xl bg-accent-primary/5 border border-accent-primary/20 p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium accent-primary">Guided Demo — Step {guidedStep} of {guidedSteps.length}</p>
            <button onClick={() => setGuidedStep(0)} className="text-xs text-t-muted hover:text-t-primary">Close</button>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pb-2">
            {guidedSteps.map((step, i) => {
              const Icon = step.icon;
              const active = i === guidedStep - 1;
              const done = i < guidedStep - 1;
              return (
                <button
                  key={i}
                  onClick={() => { setGuidedStep(i + 1); setCurrentPage(step.page); }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg shrink-0 text-xs transition-colors ${
                    active ? 'bg-accent-primary/20 accent-primary' : done ? 'bg-accent-success/10 accent-success' : 'bg-surface text-t-muted'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="whitespace-nowrap">{step.title}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPICard label={t('citizenRequests')} value={totalRequests} change="+18.4%" changeType="up" icon={Mic} />
        <KPICard label={t('activeHotspots')} value={hotspots} change="+32 this week" changeType="up" icon={MapPin} />
        <KPICard label={t('infrastructureGap')} value={100 - avgInfra} suffix="%" icon={Building2} />
        <KPICard label={t('projectsTracked')} value={PROJECTS.length * 184} icon={FolderKanban} />
        <KPICard label={t('populationImpacted')} value={totalPop} icon={Users} />
        <KPICard label={t('resolvedIssues')} value={avgResolved} suffix="%" icon={CheckCircle2} />
      </div>

      {/* Map + side content */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-t-primary">National Demand Map</h3>
            <button onClick={() => setCurrentPage('demand-map')} className="text-xs text-t-muted hover:accent-primary flex items-center gap-1">
              Full map <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <IndiaMap compact />
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* AI Insight preview */}
          <div className="rounded-xl bg-surface border border-c p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-accent-primary/20 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 accent-primary" />
              </div>
              <span className="text-sm font-semibold text-t-primary">AI Insight</span>
            </div>
            <p className="text-xs text-t-secondary leading-relaxed mb-3">{AI_INSIGHTS[0].answer.slice(0, 180)}...</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-base overflow-hidden">
                <div className="h-full bg-accent-primary rounded-full" style={{ width: `${AI_INSIGHTS[0].confidence}%` }} />
              </div>
              <span className="text-[10px] text-t-muted">{AI_INSIGHTS[0].confidence}% confidence</span>
            </div>
            <button onClick={() => setCurrentPage('ai-insights')} className="text-xs accent-primary mt-3 flex items-center gap-1 hover:underline">
              View full analysis <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Demand trend */}
          <div className="rounded-xl bg-surface border border-c p-4">
            <p className="text-sm font-semibold text-t-primary mb-3">Demand Trend</p>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4285F4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4285F4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34A853" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#34A853" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0D1B2A', border: '1px solid #1E3050', borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="requests" stroke="#4285F4" strokeWidth={2} fill="url(#colorReq)" />
                <Area type="monotone" dataKey="resolved" stroke="#34A853" strokeWidth={2} fill="url(#colorRes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom: Top demand + recent projects */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl bg-surface border border-c p-4">
          <p className="text-sm font-semibold text-t-primary mb-3">Top Demand Districts</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={demandChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,48,73,0.3)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0D1B2A', border: '1px solid #1E3050', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="requests" fill="#4285F4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl bg-surface border border-c p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-t-primary">Recent Projects</p>
            <button onClick={() => setCurrentPage('projects')} className="text-xs text-t-muted hover:accent-primary">View all</button>
          </div>
          <div className="space-y-2">
            {PROJECTS.slice(0, 4).map((p) => (
              <button
                key={p.id}
                onClick={() => setCurrentPage('projects')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-base border border-c hover:border-accent-primary/30 transition-colors text-left"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-t-primary truncate">{p.name}</p>
                  <p className="text-[10px] text-t-muted">{p.districtName} · {formatINR(p.budget)}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  p.status === 'completed' ? 'bg-accent-success/15 accent-success' :
                  p.status === 'in-progress' ? 'bg-accent-primary/15 accent-primary' :
                  p.status === 'delayed' ? 'bg-accent-critical/15 accent-critical' :
                  'bg-t-muted/15 text-t-secondary'
                }`}>
                  {p.status.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ')}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {panelOpen && selectedDistrict && (
        <HotspotPanel district={selectedDistrict} onClose={() => setPanelOpen(false)} />
      )}
    </div>
  );
}
