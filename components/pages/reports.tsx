'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/app-context';
import { PageHeader, formatINR } from '@/components/shared';
import { DISTRICTS, PROJECTS, CITIZEN_REQUESTS, CATEGORY_LABELS, AI_INSIGHTS, getTotalCitizenRequests, getTotalPopulation, getAvgInfrastructureIndex, getTotalInvestment } from '@/lib/mock-data';
import type { IssueCategory } from '@/lib/types';
import { FileText, Sparkles, Download, Calendar, MapPin, Building2, TrendingUp, CheckCircle2, AlertTriangle, Database } from 'lucide-react';

export function ReportsPage() {
  const { t } = useApp();
  const [districtId, setDistrictId] = useState('all');
  const [category, setCategory] = useState<string>('all');
  const [dateRange, setDateRange] = useState('last-30');
  const [includeProjects, setIncludeProjects] = useState(true);
  const [includeRequests, setIncludeRequests] = useState(true);
  const [includeInvestment, setIncludeInvestment] = useState(true);
  const [includeImpact, setIncludeImpact] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setReport(false);
    setTimeout(() => { setGenerating(false); setReport(true); }, 2000);
  };

  const totalReq = getTotalCitizenRequests();
  const totalPop = getTotalPopulation();
  const avgInfra = getAvgInfrastructureIndex();
  const totalInv = getTotalInvestment();

  return (
    <div className="space-y-6">
      <PageHeader title={t('reportGenerator')} subtitle="Generate professional AI-powered infrastructure reports for any district, category, or time period." />

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Configuration */}
        <div className="lg:col-span-1 rounded-xl bg-surface border border-c p-4 space-y-4">
          <h3 className="text-sm font-semibold text-t-primary">Report Configuration</h3>

          <div>
            <label className="text-xs text-t-muted mb-1.5 block flex items-center gap-1.5"><MapPin className="w-3 h-3" /> District</label>
            <select value={districtId} onChange={(e) => setDistrictId(e.target.value)} className="w-full bg-base border border-c rounded-lg px-3 py-2 text-sm text-t-secondary outline-none cursor-pointer">
              <option value="all">All Districts</option>
              {DISTRICTS.map((d) => <option key={d.id} value={d.id}>{d.name}, {d.stateName}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-t-muted mb-1.5 block flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Date Range</label>
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="w-full bg-base border border-c rounded-lg px-3 py-2 text-sm text-t-secondary outline-none cursor-pointer">
              <option value="last-7">Last 7 days</option>
              <option value="last-30">Last 30 days</option>
              <option value="last-90">Last 90 days</option>
              <option value="last-180">Last 6 months</option>
              <option value="last-365">Last year</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-t-muted mb-1.5 block flex items-center gap-1.5"><Building2 className="w-3 h-3" /> Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-base border border-c rounded-lg px-3 py-2 text-sm text-t-secondary outline-none cursor-pointer">
              <option value="all">All Categories</option>
              {(Object.keys(CATEGORY_LABELS) as IssueCategory[]).map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
            </select>
          </div>

          <div className="space-y-2 pt-2 border-t border-c">
            <p className="text-xs text-t-muted">Include Sections:</p>
            {[{ label: 'Citizen Requests', val: includeRequests, set: setIncludeRequests }, { label: 'Projects', val: includeProjects, set: setIncludeProjects }, { label: 'Investment', val: includeInvestment, set: setIncludeInvestment }, { label: 'Impact', val: includeImpact, set: setIncludeImpact }].map((item) => (
              <label key={item.label} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={item.val} onChange={(e) => item.set(e.target.checked)} className="accent-primary w-4 h-4 rounded" />
                <span className="text-xs text-t-secondary">{item.label}</span>
              </label>
            ))}
          </div>

          <button onClick={handleGenerate} disabled={generating} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent-primary text-white text-sm font-medium hover:bg-accent-primary/90 transition-colors disabled:opacity-50">
            {generating ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {generating ? 'Generating...' : 'Generate AI Report'}
          </button>
        </div>

        {/* Report preview */}
        <div className="lg:col-span-2">
          {generating && (
            <div className="rounded-xl bg-surface border border-c p-8 flex flex-col items-center justify-center min-h-[400px]">
              <Sparkles className="w-8 h-8 accent-primary animate-pulse mb-3" />
              <p className="text-sm text-t-secondary">AI is analyzing data and generating your report...</p>
              <div className="flex gap-1 mt-3">
                {[0, 1, 2].map((i) => <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-t-muted" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />)}
              </div>
            </div>
          )}

          {!generating && !report && (
            <div className="rounded-xl bg-surface border border-c p-8 flex flex-col items-center justify-center min-h-[400px]">
              <FileText className="w-8 h-8 text-t-muted mb-3" />
              <p className="text-sm text-t-secondary">Configure your report and click Generate AI Report</p>
            </div>
          )}

          {report && !generating && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-surface border border-c p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-c pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-sm border border-white/20 shrink-0 overflow-hidden">
                    <img src="/logo.png" alt="CIVIC SENSE Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-t-primary">Infrastructure Intelligence Report</h2>
                    <p className="text-xs text-t-muted">Generated by CIVIC-SENSE AI · {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-base border border-c text-xs text-t-secondary hover:text-t-primary hover:border-accent-primary/30 transition-colors">
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </button>
              </div>

              <div>
                <h3 className="text-sm font-semibold accent-primary mb-1.5">Executive Summary</h3>
                <p className="text-xs text-t-secondary leading-relaxed">This report covers infrastructure intelligence across {districtId === 'all' ? 'all districts' : DISTRICTS.find((d) => d.id === districtId)?.name} for the {dateRange.replace('-', ' ')} period. The analysis combines {totalReq.toLocaleString()} citizen requests, {PROJECTS.length} tracked projects, and ₹{totalInv} Cr in public investment. The national infrastructure index averages {avgInfra}/100, with {Math.round((100 - avgInfra) * 10) / 10}% infrastructure gap.</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold accent-primary mb-1.5">Key Findings</h3>
                <ul className="space-y-1.5">
                  {AI_INSIGHTS.slice(0, 3).map((insight, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-t-secondary">
                      <CheckCircle2 className="w-3.5 h-3.5 accent-success shrink-0 mt-0.5" />
                      <span>{insight.answer.slice(0, 120)}...</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-lg bg-base border border-c p-3"><p className="text-[10px] text-t-muted">Total Requests</p><p className="text-sm font-bold text-t-primary">{totalReq.toLocaleString()}</p></div>
                <div className="rounded-lg bg-base border border-c p-3"><p className="text-[10px] text-t-muted">Population</p><p className="text-sm font-bold text-t-primary">{(totalPop / 1000000).toFixed(1)}M</p></div>
                <div className="rounded-lg bg-base border border-c p-3"><p className="text-[10px] text-t-muted">Investment</p><p className="text-sm font-bold text-t-primary">{formatINR(totalInv)}</p></div>
                <div className="rounded-lg bg-base border border-c p-3"><p className="text-[10px] text-t-muted">Infra Index</p><p className="text-sm font-bold text-t-primary">{avgInfra}/100</p></div>
              </div>

              <div>
                <h3 className="text-sm font-semibold accent-primary mb-1.5">Demand Hotspots</h3>
                <div className="space-y-1.5">
                  {[...DISTRICTS].sort((a, b) => b.citizenRequests - a.citizenRequests).slice(0, 5).map((d) => (
                    <div key={d.id} className="flex items-center justify-between rounded-lg bg-base border border-c px-3 py-2">
                      <span className="text-xs text-t-primary">{d.name}</span>
                      <span className="text-xs text-t-muted">{d.citizenRequests.toLocaleString()} requests · Index {d.infrastructureIndex}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold accent-primary mb-1.5">Infrastructure Gaps</h3>
                <div className="space-y-1.5">
                  {[...DISTRICTS].sort((a, b) => a.infrastructureIndex - b.infrastructureIndex).slice(0, 5).map((d) => (
                    <div key={d.id} className="flex items-center justify-between rounded-lg bg-base border border-c px-3 py-2">
                      <span className="text-xs text-t-primary">{d.name}</span>
                      <span className="text-xs accent-critical">Index {d.infrastructureIndex}/100</span>
                    </div>
                  ))}
                </div>
              </div>

              {includeProjects && (
                <div>
                  <h3 className="text-sm font-semibold accent-primary mb-1.5">Active Projects</h3>
                  <div className="space-y-1.5">
                    {PROJECTS.slice(0, 5).map((p) => (
                      <div key={p.id} className="flex items-center justify-between rounded-lg bg-base border border-c px-3 py-2">
                        <span className="text-xs text-t-primary">{p.name}</span>
                        <span className="text-xs text-t-muted">{formatINR(p.budget)} · {p.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold accent-primary mb-1.5">AI Insights</h3>
                <div className="rounded-lg bg-accent-primary/5 border border-accent-primary/20 p-3">
                  <p className="text-xs text-t-secondary leading-relaxed">{AI_INSIGHTS[0].answer}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Database className="w-3 h-3 text-t-muted" />
                    <span className="text-[10px] text-t-muted">Confidence: {AI_INSIGHTS[0].confidence}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
