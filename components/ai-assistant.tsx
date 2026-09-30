'use client';

import { motion } from 'framer-motion';
import { useApp } from '@/lib/app-context';
import { X, Sparkles, Send, TrendingUp, AlertTriangle, MapPin, BarChart3 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { AI_INSIGHTS } from '@/lib/mock-data';
import type { AIInsight } from '@/lib/types';

const suggestedQuestions = [
  'Which districts have the largest infrastructure gaps?',
  'Where is citizen demand increasing fastest?',
  'Which areas are under-reported?',
  'Compare infrastructure investment with citizen demand.',
  'What infrastructure problem affects the most people?',
];

export function AIAssistantPanel() {
  const { aiAssistantOpen, setAiAssistantOpen, settings } = useApp();
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string; insight?: AIInsight }[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const handleSend = (q?: string) => {
    const question = q || input;
    if (!question.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', content: question }]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const insight = AI_INSIGHTS.find((a) =>
        question.toLowerCase().includes(a.question.toLowerCase().split(' ')[1].toLowerCase()) ||
        a.question.toLowerCase().includes(question.toLowerCase().split(' ')[0].toLowerCase())
      ) || AI_INSIGHTS[0];

      setTyping(false);
      setMessages((prev) => [...prev, {
        role: 'ai',
        content: insight.answer,
        insight,
      }]);
    }, 1200);
  };

  if (!aiAssistantOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setAiAssistantOpen(false)} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-md bg-secondary border-l border-c flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-c shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent-primary/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 accent-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-t-primary">AI Analyst</p>
              <p className="text-[10px] text-t-muted">Infrastructure Intelligence</p>
            </div>
          </div>
          <button onClick={() => setAiAssistantOpen(false)} className="text-t-muted hover:text-t-primary">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-xl bg-accent-primary/20 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 accent-primary" />
              </div>
              <p className="text-sm font-medium text-t-primary mb-1">AI Infrastructure Analyst</p>
              <p className="text-xs text-t-muted mb-6">Ask me about infrastructure gaps, demand patterns, or investment alignment.</p>
              <div className="space-y-2 text-left">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(q)}
                    className="w-full text-xs text-t-secondary px-3 py-2.5 rounded-lg bg-surface border border-c hover:border-accent-primary/30 hover:text-t-primary transition-colors text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={msg.role === 'user' ? 'flex justify-end' : ''}>
              {msg.role === 'user' ? (
                <div className="bg-accent-primary/20 rounded-xl rounded-br-sm px-3 py-2 max-w-[85%]">
                  <p className="text-sm text-t-primary">{msg.content}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-lg bg-accent-primary/20 flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5 accent-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-t-primary leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                  {msg.insight && (
                    <div className="ml-9 space-y-2">
                      {msg.insight.metrics && (
                        <div className="grid grid-cols-3 gap-2">
                          {msg.insight.metrics.map((m, j) => (
                            <div key={j} className="rounded-lg bg-surface border border-c px-2 py-1.5">
                              <p className="text-[10px] text-t-muted">{m.label}</p>
                              <p className="text-sm font-semibold text-t-primary">{m.value}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {msg.insight.districts && (
                        <div className="flex flex-wrap gap-1.5">
                          {msg.insight.districts.map((d, j) => (
                            <span key={j} className="text-xs px-2 py-0.5 rounded-full bg-accent-primary/10 accent-primary">
                              {d}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-surface overflow-hidden">
                          <div className="h-full bg-accent-primary rounded-full" style={{ width: `${msg.insight.confidence}%` }} />
                        </div>
                        <span className="text-[10px] text-t-muted">Confidence {msg.insight.confidence}%</span>
                      </div>
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
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-t-muted"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-c p-3">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question…"
              className="flex-1 bg-surface border border-c rounded-lg px-3 py-2 text-sm text-t-primary placeholder:text-t-muted outline-none focus:border-accent-primary/40"
            />
            <button
              onClick={() => handleSend()}
              className="w-9 h-9 rounded-lg bg-accent-primary text-white flex items-center justify-center hover:bg-accent-primary/90 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
