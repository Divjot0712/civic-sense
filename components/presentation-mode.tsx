'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/app-context';
import { IndiaMap } from '@/components/india-map';
import { KPICard, formatINR } from '@/components/shared';
import { DISTRICTS, PROJECTS, AI_INSIGHTS, getTotalCitizenRequests, getTotalPopulation, getAvgInfrastructureIndex, getTotalInvestment, getAvgResolvedRate, getActiveHotspots, getUnderReportedDistricts, CATEGORY_LABELS } from '@/lib/mock-data';
import type { IssueCategory } from '@/lib/types';
import { Sparkles, X, ChevronRight, MapPin, Building2, TrendingUp, Users, CheckCircle2, Mic, FolderKanban, AlertTriangle, ArrowRight } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, AreaChart, Area, CartesianGrid, ScatterChart, Scatter, ZAxis } from 'recharts';

const slides = [
  { id: 'overview', title: 'National Overview', subtitle: 'Real-time infrastructure intelligence command center' },
  { id: 'hotspots', title: 'Demand Hotspots', subtitle: 'Where citizens need infrastructure the most' },
  { id: 'gaps', title: 'Infrastructure Gaps', subtitle: 'Districts with the largest infrastructure deficits' },
  { id: 'ai', title: 'AI Analysis', subtitle: 'AI-powered infrastructure gap detection' },
  { id: 'simulation', title: 'Investment Simulation', subtitle: 'Predicting impact of infrastructure investment' },
  { id: 'impact', title: 'Impact Measurement', subtitle: 'From investment to measurable citizen impact' },
];

export function PresentationMode() {
  const { setPresentationMode } = useApp();
  const [slide, setSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setSlide((s) => (s + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [autoPlay]);

  const current = slides[slide];

  return (
    <div className="min-h-screen bg-base flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between h-14 px-6 border-b border-c bg-secondary/50 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white p-0.5 flex items-center justify-center shadow-sm border border-white/20 shrink-0 overflow-hidden">
            <img src="/logo.png" alt="CIVIC SENSE" className="w-full h-full object-contain" />
          </div>
          <span className="text-sm font-bold text-t-primary">CIVIC-SENSE — Presentation Mode</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setAutoPlay(!autoPlay)} className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${autoPlay ? 'bg-accent-primary/20 accent-primary border-accent-primary/30' : 'text-t-secondary border-c'}`}>
            {autoPlay ? 'Auto: ON' : 'Auto: OFF'}
          </button>
          <div className="flex items-center gap-1">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)} className={`w-2 h-2 rounded-full transition-colors ${i === slide ? 'bg-accent-primary' : 'bg-t-muted/30'}`} />
            ))}
          </div>
          <button onClick={() => setPresentationMode(false)} className="text-xs text-t-secondary hover:text-t-primary px-3 py-1.5 rounded-lg border border-c hover:bg-surface transition-colors">
            Exit
          </button>
        </div>
      </div>

      {/* Slide content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-6 lg:p-10">
        <AnimatePresence mode="wait">
          <motion.div key={slide} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }}>
            <div className="max-w-6xl mx-auto">
              <h1 className="text-2xl lg:text-4xl font-bold text-t-primary tracking-tight mb-1">{current.title}</h1>
              <p className="text-sm lg:text-base text-t-muted mb-6">{current.subtitle}</p>

              {slide === 0 && <OverviewSlide />}
              {slide === 1 && <HotspotsSlide />}
              {slide === 2 && <GapsSlide />}
              {slide === 3 && <AISlide />}
              {slide === 4 && <SimulationSlide />}
              {slide === 5 && <ImpactSlide />}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      <div className="flex items-center justify-between h-14 px-6 border-t border-c bg-secondary/50 backdrop-blur-sm shrink-0">
        <button onClick={() => setSlide((s) => (s - 1 + slides.length) % slides.length)} className="text-xs text-t-secondary hover:text-t-primary transition-colors">
          ← Previous
        </button>
        <span className="text-xs text-t-muted">{slide + 1} / {slides.length}</span>
        <button onClick={() => setSlide((s) => (s + 1) % slides.length)} className="text-xs text-t-secondary hover:text-t-primary transition-colors flex items-center gap-1">
          Next <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

function OverviewSlide() {
  const totalReq = getTotalCitizenRequests();
  const totalPop = getTotalPopulation();
  const avgInfra = getAvgInfrastructureIndex();
  const totalInv = getTotalInvestment();
  const avgResolved = getAvgResolvedRate();
  const hotspots = getActiveHotspots();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPICard label="Citizen Requests" value={totalReq} change="+18.4%" changeType="up" icon={Mic} />
        <KPICard label="Active Hotspots" value={hotspots} change="+32 this week" changeType="up" icon={MapPin} />
        <KPICard label="Infrastructure Gap" value={100 - avgInfra} suffix="%" icon={Building2} />
        <KPICard label="Projects Tracked" value={PROJECTS.length * 184} icon={FolderKanban} />
        <KPICard label="Population Impacted" value={totalPop} icon={Users} />
        <KPICard label="Resolved Issues" value={avgResolved} suffix="%" icon={CheckCircle2} />
      </div>
      <IndiaMap compact />
      <div className="flex items-center justify-center gap-2.5 pt-2">
        <div className="w-6 h-6 rounded-md bg-white p-0.5 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
          <img src="/logo.png" alt="CIVIC SENSE" className="w-full h-full object-contain" />
        </div>
        <p className="text-center text-sm text-t-muted">CIVIC-SENSE transforms millions of citizen voices into measurable infrastructure intelligence.</p>
      </div>
    </div>
  );
}

function HotspotsSlide() {
  const topDemand = [...DISTRICTS].sort((a, b) => b.citizenRequests - a.citizenRequests).slice(0, 8);
  const chartData = topDemand.map((d) => ({ name: d.name.split(' ')[0], requests: d.citizenRequests, fill: d.citizenRequests > 30000 ? '#EA4335' : d.citizenRequests > 15000 ? '#F97316' : '#FBBC04' }));
  return (
    <div className="space-y-6">
      <IndiaMap />
      <div className="rounded-xl bg-surface border border-c p-4">
        <h3 className="text-sm font-semibold text-t-primary mb-3">Top Demand Districts</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,48,73,0.3)" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#0D1B2A', border: '1px solid #1E3050', borderRadius: '8px', fontSize: '12px' }} />
            <Bar dataKey="requests" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function GapsSlide() {
  const gaps = [...DISTRICTS].sort((a, b) => a.infrastructureIndex - b.infrastructureIndex).slice(0, 8);
  const chartData = gaps.map((d) => ({ name: d.name.split(' ')[0], index: d.infrastructureIndex, fill: d.infrastructureIndex < 45 ? '#EA4335' : d.infrastructureIndex < 55 ? '#F97316' : '#FBBC04' }));
  const underReported = getUnderReportedDistricts();
  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl bg-surface border border-c p-4">
          <h3 className="text-sm font-semibold text-t-primary mb-3">Lowest Infrastructure Scores</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} layout="vertical">
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={{ background: '#0D1B2A', border: '1px solid #1E3050', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="index" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl bg-accent-warning/5 border border-accent-warning/20 p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 accent-warning" />
            <h3 className="text-sm font-semibold text-t-primary">Hidden Infrastructure Gaps</h3>
          </div>
          <div className="space-y-2">
            {underReported.map((d) => (
              <div key={d.id} className="rounded-lg bg-surface border border-c p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-t-primary">{d.name}</span>
                  <span className="text-xs accent-warning">⚠️ Under-Reported</span>
                </div>
                <div className="text-xs text-t-muted">Pop: {d.population.toLocaleString()} · Reports: {d.citizenRequests.toLocaleString()} · Score: {d.infrastructureIndex}/100 · Connectivity: {d.digitalConnectivity}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AISlide() {
  const insight = AI_INSIGHTS[0];
  const chartData = insight.chartData || [];
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-surface border border-c p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-accent-primary/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 accent-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-t-primary">AI Infrastructure Analyst</h3>
            <p className="text-xs text-t-muted">Question: {insight.question}</p>
          </div>
        </div>
        <p className="text-sm text-t-secondary leading-relaxed mb-4">{insight.answer}</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-lg bg-base border border-c p-3">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="label" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={70} />
                <Tooltip contentStyle={{ background: '#0D1B2A', border: '1px solid #1E3050', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {chartData.map((_, i) => <Cell key={i} fill={i === 0 ? '#EA4335' : i === 1 ? '#F97316' : '#4285F4'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {insight.metrics.map((m, i) => (
                <div key={i} className="rounded-lg bg-base border border-c p-2">
                  <p className="text-[10px] text-t-muted">{m.label}</p>
                  <p className="text-sm font-semibold text-t-primary">{m.value}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {insight.districts.map((d, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-accent-primary/10 accent-primary">{d}</span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-base overflow-hidden">
                <div className="h-full bg-accent-primary rounded-full" style={{ width: `${insight.confidence}%` }} />
              </div>
              <span className="text-[10px] text-t-muted">Confidence {insight.confidence}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SimulationSlide() {
  const scatterData = DISTRICTS.map((d) => ({ name: d.name, demand: d.citizenRequests, investment: d.investment, fill: d.infrastructureIndex < 50 ? '#EA4335' : d.infrastructureIndex < 60 ? '#FBBC04' : '#34A853' }));
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-surface border border-c p-4">
        <h3 className="text-sm font-semibold text-t-primary mb-1">Citizen Demand vs Public Investment</h3>
        <p className="text-xs text-t-muted mb-4">Investment-Demand Mismatch Analysis</p>
        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,48,73,0.3)" />
            <XAxis type="number" dataKey="demand" name="Demand" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} label={{ value: 'Citizen Demand', position: 'bottom', fill: '#94A3B8', fontSize: 11 }} />
            <YAxis type="number" dataKey="investment" name="Investment" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} label={{ value: 'Investment (Cr)', angle: -90, position: 'insideLeft', fill: '#94A3B8', fontSize: 11 }} />
            <ZAxis range={[40, 200]} />
            <Tooltip contentStyle={{ background: '#0D1B2A', border: '1px solid #1E3050', borderRadius: '8px', fontSize: '12px' }} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter data={scatterData}>
              {scatterData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ImpactSlide() {
  const trendData = [
    { month: 'Jan', complaints: 42000, satisfaction: 52 }, { month: 'Feb', complaints: 38000, satisfaction: 55 },
    { month: 'Mar', complaints: 34000, satisfaction: 58 }, { month: 'Apr', complaints: 31000, satisfaction: 61 },
    { month: 'May', complaints: 28000, satisfaction: 64 }, { month: 'Jun', complaints: 24000, satisfaction: 67 },
    { month: 'Jul', complaints: 21000, satisfaction: 70 }, { month: 'Aug', complaints: 18000, satisfaction: 73 },
  ];
  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl bg-surface border border-c p-4">
          <h3 className="text-sm font-semibold text-t-primary mb-3">Complaints Reduction</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={trendData}>
              <defs><linearGradient id="presImpact" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#34A853" stopOpacity={0.3} /><stop offset="95%" stopColor="#34A853" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,48,73,0.3)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0D1B2A', border: '1px solid #1E3050', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="complaints" stroke="#34A853" strokeWidth={2} fill="url(#presImpact)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl bg-surface border border-c p-4">
          <h3 className="text-sm font-semibold text-t-primary mb-3">Citizen Satisfaction</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={trendData}>
              <defs><linearGradient id="presSat" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4285F4" stopOpacity={0.3} /><stop offset="95%" stopColor="#4285F4" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,48,73,0.3)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: '#0D1B2A', border: '1px solid #1E3050', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="satisfaction" stroke="#4285F4" strokeWidth={2} fill="url(#presSat)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <p className="text-center text-sm text-t-muted">CIVIC-SENSE transforms millions of citizen voices into measurable infrastructure intelligence.</p>
    </div>
  );
}
