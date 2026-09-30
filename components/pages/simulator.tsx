'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/lib/app-context';
import { PageHeader, formatINR } from '@/components/shared';
import { DISTRICTS, CATEGORY_LABELS } from '@/lib/mock-data';
import type { IssueCategory } from '@/lib/types';
import { SlidersHorizontal, TrendingUp, Users, Building2, AlertCircle, Sparkles } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

export function SimulatorPage() {
  const { t } = useApp();
  const [districtId, setDistrictId] = useState(DISTRICTS[3].id);
  const [category, setCategory] = useState<IssueCategory>('water');
  const [investment, setInvestment] = useState(100);

  const district = DISTRICTS.find((d) => d.id === districtId)!;
  const currentScore = district.scores[category];
  const currentRequests = Math.round(district.citizenRequests * (district.demandByCategory[category] / 100));
  const currentPop = Math.round(district.population * 0.4);

  // Simulation model: each ₹10Cr improves score by ~2 points, reduces requests proportionally
  const scoreImprovement = Math.min(Math.round(investment / 10 * 2), 30);
  const simulatedScore = Math.min(currentScore + scoreImprovement, 95);
  const requestReduction = Math.round(currentRequests * (scoreImprovement / 100) * 1.5);
  const simulatedRequests = Math.max(currentRequests - requestReduction, 0);
  const popImprovement = Math.round(currentPop * (scoreImprovement / 100) * 0.8);
  const simulatedPop = currentPop - popImprovement;
  const improvementPct = Math.round((scoreImprovement / currentScore) * 100);

  const beforeAfterData = [
    { name: 'Before', score: currentScore, fill: '#EA4335' },
    { name: 'After', score: simulatedScore, fill: '#34A853' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={t('investmentSimulator')} subtitle="Simulate the impact of infrastructure investment on citizen demand and infrastructure scores." />

      {/* Controls */}
      <div className="rounded-xl bg-surface border border-c p-6">
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-xs text-t-muted mb-1.5 block">District</label>
            <select value={districtId} onChange={(e) => setDistrictId(e.target.value)} className="w-full bg-base border border-c rounded-lg px-3 py-2.5 text-sm text-t-secondary outline-none cursor-pointer">
              {DISTRICTS.map((d) => (
                <option key={d.id} value={d.id}>{d.name}, {d.stateName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-t-muted mb-1.5 block">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as IssueCategory)} className="w-full bg-base border border-c rounded-lg px-3 py-2.5 text-sm text-t-secondary outline-none cursor-pointer">
              {(Object.keys(CATEGORY_LABELS) as IssueCategory[]).map((c) => (
                <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-t-muted mb-1.5 block">Investment Amount</label>
            <div className="flex items-center gap-2">
              <input type="range" min="10" max="300" step="10" value={investment} onChange={(e) => setInvestment(Number(e.target.value))} className="flex-1 accent-primary" />
              <span className="text-sm font-bold text-t-primary w-16 text-right">{formatINR(investment)}</span>
            </div>
          </div>
        </div>

        {/* Before / After comparison */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Current state */}
          <div className="rounded-xl bg-base border border-c p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-t-muted/20 flex items-center justify-center">
                <Building2 className="w-3.5 h-3.5 text-t-muted" />
              </div>
              <span className="text-sm font-semibold text-t-secondary">Current State</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-t-muted">Infrastructure Score</span>
                <span className="text-lg font-bold text-t-primary">{currentScore}<span className="text-xs text-t-muted">/100</span></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-t-muted">Citizen Requests</span>
                <span className="text-lg font-bold text-t-primary">{currentRequests.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-t-muted">Affected Population</span>
                <span className="text-lg font-bold text-t-primary">{(currentPop / 1000).toFixed(0)}K</span>
              </div>
            </div>
          </div>

          {/* Simulated state */}
          <motion.div key={`${districtId}-${category}-${investment}`} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl bg-accent-success/5 border border-accent-success/30 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-accent-success/20 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 accent-success" />
              </div>
              <span className="text-sm font-semibold accent-success">Simulated Outcome</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-t-muted">Infrastructure Score</span>
                <span className="text-lg font-bold accent-success">{simulatedScore}<span className="text-xs text-t-muted">/100</span></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-t-muted">Estimated Requests</span>
                <span className="text-lg font-bold accent-success">{simulatedRequests.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-t-muted">Affected Population</span>
                <span className="text-lg font-bold accent-success">{(simulatedPop / 1000).toFixed(0)}K</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Improvement indicator */}
        <div className="mt-4 flex items-center justify-center">
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-accent-success/10 border border-accent-success/30">
            <TrendingUp className="w-4 h-4 accent-success" />
            <span className="text-sm font-medium accent-success">Estimated Improvement: +{improvementPct}%</span>
          </div>
        </div>

        {/* Radial comparison */}
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-base border border-c p-4">
            <p className="text-xs text-t-muted mb-2 text-center">Score Comparison</p>
            <ResponsiveContainer width="100%" height={160}>
              <RadialBarChart innerRadius="40%" outerRadius="100%" data={beforeAfterData} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar background={{ fill: 'rgba(30,48,73,0.3)' }} dataKey="score" cornerRadius={8} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-xl bg-base border border-c p-4">
            <p className="text-xs text-t-muted mb-2 text-center">Request Reduction</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={beforeAfterData}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0D1B2A', border: '1px solid #1E3050', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  <Cell fill="#EA4335" />
                  <Cell fill="#34A853" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-accent-warning/5 border border-accent-warning/20 p-3">
          <AlertCircle className="w-3.5 h-3.5 accent-warning shrink-0 mt-0.5" />
          <p className="text-xs text-t-secondary leading-relaxed">Simulation outputs are model estimates based on available data and should not be treated as guaranteed outcomes.</p>
        </div>
      </div>
    </div>
  );
}
