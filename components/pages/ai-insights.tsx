'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/lib/app-context';
import { PageHeader, SeverityBadge } from '@/components/shared';
import { AI_INSIGHTS, DISTRICTS, getUnderReportedDistricts } from '@/lib/mock-data';
import type { AIInsight } from '@/lib/types';
import { Sparkles, Send, AlertTriangle, Search, Users, Wifi, Building2, TrendingUp, Database } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const suggestedQuestions = [
  'Which districts have the largest infrastructure gaps?',
  'Where is citizen demand increasing fastest?',
  'Which areas are under-reported?',
  'Compare infrastructure investment with citizen demand.',
  'What infrastructure problem affects the most people?',
];

export function AIInsightsPage() {
  const { t, setCurrentPage, setSelectedDistrict } = useApp();
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string; insight?: AIInsight }[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const underReported = getUnderReportedDistricts();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  const handleSend = (q?: string) => {
    const question = q || input;
    if (!question.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', content: question }]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const insight = AI_INSIGHTS.find((a) =>
        question.toLowerCase().includes('gap') && a.id === 'AI-1' ||
        question.toLowerCase().includes('fast') && a.id === 'AI-2' ||
        question.toLowerCase().includes('under') && a.id === 'AI-3'
      ) || AI_INSIGHTS[0];
      setTyping(false);
      setMessages((prev) => [...prev, { role: 'ai', content: insight.answer, insight }]);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <PageHeader title={t('aiInfrastructureAnalyst')} subtitle="Ask questions about infrastructure gaps, demand patterns, investment alignment, and under-reported areas." />

      {/* Under-reported areas */}
      <div className="rounded-xl bg-accent-warning/5 border border-accent-warning/20 p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 accent-warning" />
          <h3 className="text-sm font-semibold text-t-primary">{t('hiddenInfrastructureGaps')}</h3>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {underReported.map((d) => (
            <div key={d.id} className="rounded-lg bg-surface border border-c p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-t-primary">{d.name}</span>
                <span className="text-[10px] accent-warning font-medium">⚠️ {t('underReported')}</span>
              </div>
              <div className="space-y-1 text-[10px] text-t-muted">
                <div className="flex items-center gap-1.5"><Users className="w-3 h-3" /> Population: {d.population.toLocaleString()}</div>
                <div className="flex items-center gap-1.5"><Sparkles className="w-3 h-3" /> Reports: {d.citizenRequests.toLocaleString()}</div>
                <div className="flex items-center gap-1.5"><Building2 className="w-3 h-3" /> Infra Score: {d.infrastructureIndex}/100</div>
                <div className="flex items-center gap-1.5"><Wifi className="w-3 h-3" /> Connectivity: <span className="capitalize accent-warning">{d.digitalConnectivity}</span></div>
              </div>
              <p className="text-[10px] text-t-secondary mt-2 italic leading-relaxed">"Low complaint volume may not indicate low infrastructure demand because digital access is limited and nearby regions show significantly higher demand."</p>
              <button
                onClick={() => { setSelectedDistrict(d); setCurrentPage('demand-map'); }}
                className="text-[10px] accent-primary mt-2 hover:underline"
              >
                {t('investigate')} →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* AI Chat */}
      <div className="rounded-2xl bg-surface border border-c flex flex-col h-[500px]">
        <div className="flex items-center gap-2 px-4 h-12 border-b border-c shrink-0">
          <div className="w-7 h-7 rounded-lg bg-accent-primary/20 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 accent-primary" />
          </div>
          <span className="text-sm font-semibold text-t-primary">Infrastructure Analyst</span>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-xl bg-accent-primary/20 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 accent-primary" />
              </div>
              <p className="text-sm font-medium text-t-primary mb-1">AI Infrastructure Analyst</p>
              <p className="text-xs text-t-muted mb-4">Ask me about infrastructure gaps, demand patterns, or investment alignment.</p>
              <div className="grid sm:grid-cols-2 gap-2 max-w-lg mx-auto text-left">
                {suggestedQuestions.map((q, i) => (
                  <button key={i} onClick={() => handleSend(q)} className="text-xs text-t-secondary px-3 py-2.5 rounded-lg bg-base border border-c hover:border-accent-primary/30 hover:text-t-primary transition-colors">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={msg.role === 'user' ? 'flex justify-end' : ''}>
              {msg.role === 'user' ? (
                <div className="bg-accent-primary/20 rounded-xl rounded-br-sm px-3 py-2 max-w-[80%]">
                  <p className="text-sm text-t-primary">{msg.content}</p>
                </div>
              ) : (
                <div className="space-y-3 w-full">
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-lg bg-accent-primary/20 flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5 accent-primary" />
                    </div>
                    <p className="text-sm text-t-primary leading-relaxed flex-1">{msg.content}</p>
                  </div>
                  {msg.insight && (
                    <div className="ml-9 space-y-3">
                      {msg.insight.chartData && (
                        <div className="rounded-lg bg-base border border-c p-3">
                          <ResponsiveContainer width="100%" height={160}>
                            <BarChart data={msg.insight.chartData} layout="vertical">
                              <XAxis type="number" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                              <YAxis type="category" dataKey="label" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={70} />
                              <Tooltip contentStyle={{ background: '#0D1B2A', border: '1px solid #1E3050', borderRadius: '8px', fontSize: '12px' }} />
                              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                {msg.insight.chartData.map((_, j) => (
                                  <Cell key={j} fill={j === 0 ? '#EA4335' : j === 1 ? '#F97316' : j === 2 ? '#FBBC04' : '#4285F4'} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                      {msg.insight.metrics && (
                        <div className="grid grid-cols-3 gap-2">
                          {msg.insight.metrics.map((m, j) => (
                            <div key={j} className="rounded-lg bg-base border border-c px-2 py-2">
                              <p className="text-[10px] text-t-muted">{m.label}</p>
                              <p className="text-sm font-semibold text-t-primary">{m.value}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {msg.insight.districts && (
                        <div className="flex flex-wrap gap-1.5">
                          {msg.insight.districts.map((d, j) => (
                            <button key={j} onClick={() => { const dist = DISTRICTS.find((dd) => dd.name === d); if (dist) { setSelectedDistrict(dist); setCurrentPage('demand-map'); } }} className="text-xs px-2 py-0.5 rounded-full bg-accent-primary/10 accent-primary hover:bg-accent-primary/20 transition-colors">
                              {d}
                            </button>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 rounded-full bg-base overflow-hidden">
                          <div className="h-full bg-accent-primary rounded-full" style={{ width: `${msg.insight.confidence}%` }} />
                        </div>
                        <span className="text-[10px] text-t-muted">Confidence {msg.insight.confidence}%</span>
                      </div>
                      {msg.insight.sources && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <Database className="w-3 h-3 text-t-muted" />
                          {msg.insight.sources.map((s, j) => (
                            <span key={j} className="text-[10px] text-t-muted px-1.5 py-0.5 rounded bg-base border border-c">{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {typing && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-accent-primary/20 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 accent-primary" />
              </div>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-t-muted" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-c p-3">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question…"
              className="flex-1 bg-base border border-c rounded-lg px-3 py-2 text-sm text-t-primary placeholder:text-t-muted outline-none focus:border-accent-primary/40"
            />
            <button onClick={() => handleSend()} className="w-9 h-9 rounded-lg bg-accent-primary text-white flex items-center justify-center hover:bg-accent-primary/90 transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
