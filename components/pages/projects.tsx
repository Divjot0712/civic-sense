'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/app-context';
import { PageHeader, StatusBadge, formatINR } from '@/components/shared';
import { PROJECTS, DISTRICTS, CATEGORY_LABELS, PROJECT_STATUS_LABELS } from '@/lib/mock-data';
import type { Project, IssueCategory, ProjectStatus, PageId } from '@/lib/types';
import { Search, Calendar, Users, IndianRupee, TrendingUp, ArrowLeft, MapPin, CheckCircle2, Sparkles } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, LineChart, Line, CartesianGrid } from 'recharts';

export function ProjectsPage() {
  const { t, setSelectedDistrict, setCurrentPage } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Project | null>(null);

  const filtered = PROJECTS.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.districtName.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    return true;
  });

  if (selected) {
    return <ProjectDetail project={selected} onBack={() => setSelected(null)} onNavigate={(page: PageId) => { setSelectedDistrict(DISTRICTS.find((d) => d.id === selected.districtId) || null); setCurrentPage(page); }} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('projects')} subtitle="Government infrastructure projects tracked across districts with citizen demand and impact data." />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-t-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects…" className="flex-1 bg-surface border border-c rounded-lg px-3 py-2 text-sm text-t-primary placeholder:text-t-muted outline-none focus:border-accent-primary/40" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-surface border border-c rounded-lg px-3 py-2 text-sm text-t-secondary outline-none cursor-pointer">
          <option value="all">All Statuses</option>
          {(Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[]).map((s) => (
            <option key={s} value={s}>{PROJECT_STATUS_LABELS[s]}</option>
          ))}
        </select>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="bg-surface border border-c rounded-lg px-3 py-2 text-sm text-t-secondary outline-none cursor-pointer">
          <option value="all">All Categories</option>
          {(Object.keys(CATEGORY_LABELS) as IssueCategory[]).map((c) => (
            <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
          ))}
        </select>
      </div>

      {/* Projects table */}
      <div className="rounded-xl bg-surface border border-c overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-c bg-base/50">
                <th className="text-left py-3 px-4 text-t-muted font-medium">Project</th>
                <th className="text-left py-3 px-3 text-t-muted font-medium hidden md:table-cell">District</th>
                <th className="text-left py-3 px-3 text-t-muted font-medium hidden lg:table-cell">Category</th>
                <th className="text-right py-3 px-3 text-t-muted font-medium">Budget</th>
                <th className="text-center py-3 px-3 text-t-muted font-medium">Status</th>
                <th className="text-right py-3 px-3 text-t-muted font-medium hidden md:table-cell">Demand</th>
                <th className="text-center py-3 px-3 text-t-muted font-medium hidden lg:table-cell">Impact</th>
                <th className="text-left py-3 px-3 text-t-muted font-medium hidden lg:table-cell">Start</th>
                <th className="text-left py-3 px-3 text-t-muted font-medium hidden lg:table-cell">Completion</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} onClick={() => setSelected(p)} className="border-b border-c/50 hover:bg-base/50 transition-colors cursor-pointer">
                  <td className="py-3 px-4 text-t-primary font-medium">{p.name}</td>
                  <td className="py-3 px-3 text-t-secondary hidden md:table-cell">{p.districtName}</td>
                  <td className="py-3 px-3 text-t-secondary hidden lg:table-cell">{CATEGORY_LABELS[p.category]}</td>
                  <td className="py-3 px-3 text-right text-t-primary font-medium">{formatINR(p.budget)}</td>
                  <td className="py-3 px-3 text-center"><StatusBadge status={p.status} /></td>
                  <td className="py-3 px-3 text-right text-t-secondary hidden md:table-cell">{p.citizenDemand.toLocaleString()}</td>
                  <td className="py-3 px-3 text-center hidden lg:table-cell">
                    <span className="accent-success font-medium">+{p.infraScoreAfter - p.infraScoreBefore}</span>
                  </td>
                  <td className="py-3 px-3 text-t-muted hidden lg:table-cell">{p.startDate}</td>
                  <td className="py-3 px-3 text-t-muted hidden lg:table-cell">{p.expectedCompletion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ProjectDetail({ project, onBack, onNavigate }: { project: Project; onBack: () => void; onNavigate: (page: PageId) => void }) {
  const { t } = useApp();
  const district = DISTRICTS.find((d) => d.id === project.districtId);
  const impactData = [
    { label: 'Before', complaints: project.impact.complaintsBefore, satisfaction: project.impact.satisfactionBefore },
    { label: 'After', complaints: project.impact.complaintsAfter, satisfaction: project.impact.satisfactionAfter },
  ];
  const progress = project.milestones.filter((m) => m.done).length / project.milestones.length * 100;
  const aiSummary = `This ${project.name} project in ${project.districtName} addresses ${CATEGORY_LABELS[project.category].toLowerCase()} infrastructure with a budget of ${formatINR(project.budget)}. The project targets an affected population of ${(project.affectedPopulation / 1000000).toFixed(1)}M and is expected to improve the infrastructure score from ${project.infraScoreBefore} to ${project.infraScoreAfter}, a gain of +${project.infraScoreAfter - project.infraScoreBefore} points. Citizen demand of ${project.citizenDemand.toLocaleString()} requests strongly supports this investment.`;

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-t-secondary hover:text-t-primary transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Projects
      </button>

      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-t-primary tracking-tight">{project.name}</h1>
          <div className="flex items-center gap-3 mt-1 text-sm text-t-muted">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {project.districtName}</span>
            <span>·</span>
            <span>{CATEGORY_LABELS[project.category]}</span>
          </div>
        </div>
        <StatusBadge status={project.status} />
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl bg-surface border border-c p-4">
          <div className="flex items-center gap-1.5 mb-1"><IndianRupee className="w-3.5 h-3.5 accent-success" /><span className="text-[10px] text-t-muted">Budget</span></div>
          <p className="text-lg font-bold text-t-primary">{formatINR(project.budget)}</p>
        </div>
        <div className="rounded-xl bg-surface border border-c p-4">
          <div className="flex items-center gap-1.5 mb-1"><Users className="w-3.5 h-3.5 accent-cyan" /><span className="text-[10px] text-t-muted">Affected Pop.</span></div>
          <p className="text-lg font-bold text-t-primary">{(project.affectedPopulation / 1000000).toFixed(1)}M</p>
        </div>
        <div className="rounded-xl bg-surface border border-c p-4">
          <div className="flex items-center gap-1.5 mb-1"><TrendingUp className="w-3.5 h-3.5 accent-primary" /><span className="text-[10px] text-t-muted">Infra Impact</span></div>
          <p className="text-lg font-bold text-t-primary">{project.infraScoreBefore} → <span className="accent-success">{project.infraScoreAfter}</span></p>
        </div>
        <div className="rounded-xl bg-surface border border-c p-4">
          <div className="flex items-center gap-1.5 mb-1"><Calendar className="w-3.5 h-3.5 accent-warning" /><span className="text-[10px] text-t-muted">Timeline</span></div>
          <p className="text-sm font-bold text-t-primary">{project.startDate}</p>
          <p className="text-[10px] text-t-muted">→ {project.expectedCompletion}</p>
        </div>
      </div>

      {/* Milestones */}
      <div className="rounded-xl bg-surface border border-c p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-t-primary">Project Milestones</h3>
          <span className="text-xs text-t-muted">{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2 rounded-full bg-base overflow-hidden mb-4">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-gradient-to-r from-accent-primary to-accent-cyan" />
        </div>
        <div className="space-y-2">
          {project.milestones.map((m, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${m.done ? 'bg-accent-success/20' : 'bg-base border border-c'}`}>
                {m.done ? <CheckCircle2 className="w-3.5 h-3.5 accent-success" /> : <span className="text-[10px] text-t-muted">{i + 1}</span>}
              </div>
              <div className="flex-1 flex items-center justify-between">
                <span className={`text-sm ${m.done ? 'text-t-primary' : 'text-t-muted'}`}>{m.label}</span>
                <span className="text-xs text-t-muted">{m.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Impact chart */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl bg-surface border border-c p-4">
          <h3 className="text-sm font-semibold text-t-primary mb-3">Complaints Before / After</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={impactData}>
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0D1B2A', border: '1px solid #1E3050', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="complaints" radius={[4, 4, 0, 0]}>
                <Cell fill="#EA4335" />
                <Cell fill="#34A853" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl bg-surface border border-c p-4">
          <h3 className="text-sm font-semibold text-t-primary mb-3">Satisfaction Trend</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={[
              { month: 'Before', satisfaction: project.impact.satisfactionBefore },
              { month: 'During', satisfaction: Math.round((project.impact.satisfactionBefore + project.impact.satisfactionAfter) / 2) },
              { month: 'After', satisfaction: project.impact.satisfactionAfter },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,48,73,0.3)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: '#0D1B2A', border: '1px solid #1E3050', borderRadius: '8px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="satisfaction" stroke="#4285F4" strokeWidth={2} dot={{ fill: '#4285F4', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Summary */}
      <div className="rounded-xl bg-accent-primary/5 border border-accent-primary/20 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 accent-primary" />
          <span className="text-sm font-semibold accent-primary">AI Project Summary</span>
        </div>
        <p className="text-sm text-t-secondary leading-relaxed">{aiSummary}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => onNavigate('demand-map')} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface border border-c text-xs text-t-secondary hover:text-t-primary hover:border-accent-primary/30 transition-colors">
          <MapPin className="w-3.5 h-3.5" /> View on Map
        </button>
        <button onClick={() => onNavigate('simulator')} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface border border-c text-xs text-t-secondary hover:text-t-primary hover:border-accent-primary/30 transition-colors">
          <TrendingUp className="w-3.5 h-3.5" /> Run Simulation
        </button>
        <button onClick={() => onNavigate('reports')} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface border border-c text-xs text-t-secondary hover:text-t-primary hover:border-accent-primary/30 transition-colors">
          <Sparkles className="w-3.5 h-3.5" /> Generate Report
        </button>
      </div>
    </div>
  );
}
