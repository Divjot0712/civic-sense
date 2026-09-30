'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/app-context';
import { PageHeader, SeverityBadge, StatusBadge } from '@/components/shared';
import { LANGUAGES } from '@/lib/translations';
import { DISTRICTS, CLUSTERS, CITIZEN_REQUESTS, CATEGORY_LABELS } from '@/lib/mock-data';
import type { IssueCategory, LanguageCode, Severity } from '@/lib/types';
import { Mic, Type, Image, MapPin, Send, Sparkles, CheckCircle2, ArrowRight, Users, Layers, Volume2 } from 'lucide-react';

const pipelineSteps = [
  'Language Detection', 'Speech / Text Processing', 'Translation',
  'Issue Classification', 'Location Extraction', 'Duplicate Detection',
  'Severity Assessment', 'Infrastructure Matching', 'Priority Analysis',
];

const categories: IssueCategory[] = ['water', 'roads', 'electricity', 'waste', 'healthcare', 'education'];

export function CitizenVoicePage() {
  const { t, settings, setSelectedDistrict, setCurrentPage } = useApp();
  const [mode, setMode] = useState<'voice' | 'text' | 'image'>('voice');
  const [language, setLanguage] = useState<LanguageCode>('hi');
  const [text, setText] = useState('');
  const [location, setLocation] = useState('');
  const [selectedDistrict, setSelDistrict] = useState(DISTRICTS[3].id);
  const [isRecording, setIsRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(-1);
  const [result, setResult] = useState<typeof CITIZEN_REQUESTS[0] | null>(null);
  const [showCluster, setShowCluster] = useState(false);

  const handleSubmit = () => {
    setProcessing(true);
    setProcessStep(0);
    setResult(null);
    setShowCluster(false);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setProcessStep(step);
      if (step >= pipelineSteps.length) {
        clearInterval(interval);
        setTimeout(() => {
          const district = DISTRICTS.find((d) => d.id === selectedDistrict)!;
          const mockResult = {
            ...CITIZEN_REQUESTS[0],
            id: `CP-${10428}`,
            districtId: selectedDistrict,
            category: 'water' as IssueCategory,
            severity: 'high' as Severity,
            language,
            location: location || 'Sector 17, ' + district.name,
            status: 'verified' as const,
            summary: 'Multiple citizens in this area have reported irregular water supply during the past 14 days.',
            affectedPopulation: 18400,
            relatedRequests: 1284,
            clusterId: 'C-82',
          };
          setResult(mockResult);
          setProcessing(false);
          setShowCluster(true);
        }, 500);
      }
    }, 350);
  };

  const reset = () => {
    setResult(null);
    setShowCluster(false);
    setProcessStep(-1);
    setText('');
    setLocation('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader title={t('tellUsWhatYourCommunityNeeds')} subtitle="Submit infrastructure feedback through voice, text, or image. AI will analyze and route it automatically." />

      {/* Input mode tabs */}
      <div className="flex items-center gap-2">
        {[
          { id: 'voice' as const, label: t('voice'), icon: Mic },
          { id: 'text' as const, label: t('text'), icon: Type },
          { id: 'image' as const, label: t('image'), icon: Image },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              mode === m.id ? 'bg-accent-primary/20 accent-primary border border-accent-primary/30' : 'bg-surface border border-c text-t-secondary hover:text-t-primary'
            }`}
          >
            <m.icon className="w-4 h-4" /> {m.label}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="rounded-2xl bg-surface border border-c p-6">
        {/* Language selector */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs text-t-muted">{t('language')}:</span>
          <div className="flex flex-wrap gap-1.5">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                  language === lang.code ? 'bg-accent-primary/20 accent-primary' : 'bg-base text-t-secondary hover:text-t-primary'
                }`}
              >
                {lang.nativeLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Voice mode */}
        {mode === 'voice' && (
          <div className="flex flex-col items-center justify-center py-8">
            <motion.button
              onClick={() => setIsRecording(!isRecording)}
              whileTap={{ scale: 0.95 }}
              className="relative w-20 h-20 rounded-full flex items-center justify-center transition-colors"
            >
              {isRecording && (
                <>
                  <motion.div className="absolute inset-0 rounded-full bg-accent-critical/30" animate={{ scale: [1, 1.5], opacity: [0.6, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
                  <motion.div className="absolute inset-0 rounded-full bg-accent-critical/20" animate={{ scale: [1, 1.8], opacity: [0.4, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }} />
                </>
              )}
              <div className={`relative w-20 h-20 rounded-full flex items-center justify-center ${isRecording ? 'bg-accent-critical' : 'bg-accent-primary/20'}`}>
                <Mic className={`w-8 h-8 ${isRecording ? 'text-white' : 'accent-primary'}`} />
              </div>
            </motion.button>
            <p className="text-sm text-t-secondary mt-4">
              {isRecording ? 'Recording... Click to stop' : 'Speak in your preferred language'}
            </p>
            {isRecording && (
              <div className="flex items-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <motion.div key={i} className="w-1 rounded-full bg-accent-critical" animate={{ height: [8, 24, 8] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }} />
                ))}
              </div>
            )}
            {isRecording && (
              <p className="text-xs text-t-muted mt-3 italic">"पानी की सप्लाई पिछले दो हफ्ते से बहुत कम है..."</p>
            )}
          </div>
        )}

        {/* Text mode */}
        {mode === 'text' && (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Describe the infrastructure issue in your area..."
            className="w-full h-40 rounded-xl bg-base border border-c px-4 py-3 text-sm text-t-primary placeholder:text-t-muted outline-none focus:border-accent-primary/40 resize-none"
          />
        )}

        {/* Image mode */}
        {mode === 'image' && (
          <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-c rounded-xl">
            <div className="w-14 h-14 rounded-xl bg-base flex items-center justify-center mb-3">
              <Image className="w-6 h-6 text-t-muted" />
            </div>
            <p className="text-sm text-t-secondary">Upload an infrastructure problem photo</p>
            <p className="text-xs text-t-muted mt-1">JPG, PNG up to 10MB</p>
            <button className="mt-4 px-4 py-2 rounded-lg bg-accent-primary/20 accent-primary text-sm font-medium hover:bg-accent-primary/30 transition-colors">
              Choose File
            </button>
          </div>
        )}

        {/* Location */}
        <div className="flex items-center gap-2 mt-4">
          <MapPin className="w-4 h-4 text-t-muted" />
          <select
            value={selectedDistrict}
            onChange={(e) => setSelDistrict(e.target.value)}
            className="flex-1 bg-base border border-c rounded-lg px-3 py-2 text-sm text-t-secondary outline-none cursor-pointer"
          >
            {DISTRICTS.map((d) => (
              <option key={d.id} value={d.id}>{d.name}, {d.stateName}</option>
            ))}
          </select>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Specific area (optional)"
            className="flex-1 bg-base border border-c rounded-lg px-3 py-2 text-sm text-t-primary placeholder:text-t-muted outline-none"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={processing}
          className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent-primary text-white text-sm font-medium hover:bg-accent-primary/90 transition-colors disabled:opacity-50"
        >
          {processing ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {processing ? 'AI Processing...' : t('submit')}
        </button>
      </div>

      {/* AI Processing Pipeline */}
      <AnimatePresence>
        {processing && processStep >= 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl bg-surface border border-c p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 accent-primary animate-pulse" />
              <span className="text-sm font-semibold text-t-primary">AI Processing Pipeline</span>
            </div>
            <div className="space-y-1">
              {pipelineSteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: i <= processStep ? 1 : 0.2 }}
                  className={`flex items-center gap-3 py-1.5 ${i <= processStep ? 'accent-primary' : 'text-t-muted'}`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${i < processStep ? 'bg-accent-success text-white' : i === processStep ? 'bg-accent-primary text-white' : 'bg-base border border-c'}`}>
                    {i < processStep ? '✓' : i + 1}
                  </div>
                  <span className="text-xs">{step}</span>
                  {i === processStep && <Volume2 className="w-3 h-3 animate-pulse" />}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Understanding + Result */}
      <AnimatePresence>
        {result && !processing && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* AI Understanding */}
            <div className="rounded-2xl bg-surface border border-c p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-accent-primary/20 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 accent-primary" />
                </div>
                <span className="text-sm font-semibold text-t-primary">AI Understanding</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { label: t('language'), value: LANGUAGES.find((l) => l.code === result.language)?.label || 'Hindi' },
                  { label: t('issue'), value: 'Water Supply' },
                  { label: t('location'), value: result.location },
                  { label: t('category'), value: 'Water Infrastructure' },
                  { label: t('severity'), value: <SeverityBadge severity={result.severity} /> },
                  { label: t('confidence'), value: '92%' },
                ].map((item, i) => (
                  <div key={i} className="rounded-lg bg-base border border-c p-3">
                    <p className="text-[10px] text-t-muted mb-1">{item.label}</p>
                    <div className="text-sm text-t-primary font-medium">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Request Result */}
            <div className="rounded-2xl bg-surface border border-c p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-t-muted">Request #{result.id}</p>
                  <h3 className="text-sm font-bold text-t-primary">Water supply disruption</h3>
                </div>
                <StatusBadge status={result.status} />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-lg bg-base border border-c p-3">
                  <p className="text-[10px] text-t-muted">Affected Population</p>
                  <p className="text-sm font-semibold text-t-primary">~{result.affectedPopulation.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-base border border-c p-3">
                  <p className="text-[10px] text-t-muted">Related Requests</p>
                  <p className="text-sm font-semibold text-t-primary">{result.relatedRequests.toLocaleString()}</p>
                </div>
              </div>
              <div className="rounded-lg bg-accent-primary/5 border border-accent-primary/20 p-3 mb-4">
                <p className="text-xs text-t-secondary leading-relaxed">{result.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => { setSelectedDistrict(DISTRICTS.find((d) => d.id === result.districtId)!); setCurrentPage('demand-map'); }} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-base border border-c text-xs text-t-secondary hover:text-t-primary hover:border-accent-primary/30 transition-colors">
                  <MapPin className="w-3.5 h-3.5" /> {t('viewOnMap')}
                </button>
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-base border border-c text-xs text-t-secondary hover:text-t-primary hover:border-accent-primary/30 transition-colors">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {t('trackStatus')}
                </button>
                <button onClick={reset} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-base border border-c text-xs text-t-secondary hover:text-t-primary hover:border-accent-primary/30 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" /> {t('reportAnotherIssue')}
                </button>
              </div>
            </div>

            {/* Cluster Detection */}
            {showCluster && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-surface border border-c p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Layers className="w-4 h-4 accent-cyan" />
                  <span className="text-sm font-semibold text-t-primary">Duplicate / Cluster Detection</span>
                </div>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-t-primary">{result.relatedRequests.toLocaleString()}</p>
                    <p className="text-xs text-t-muted">citizen reports</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-t-muted" />
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-accent-cyan/20 flex items-center justify-center mx-auto mb-1">
                      <Sparkles className="w-5 h-5 accent-cyan" />
                    </div>
                    <p className="text-xs text-t-muted">AI clustering</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-t-muted" />
                  <div className="text-center">
                    <p className="text-2xl font-bold accent-cyan">1</p>
                    <p className="text-xs text-t-muted">infrastructure problem</p>
                  </div>
                </div>
                <div className="rounded-lg bg-base border border-c p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-t-primary">Water Supply Cluster #82</span>
                    <SeverityBadge severity="high" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div><span className="text-t-muted">Reports:</span> <span className="text-t-primary font-medium">1,284</span></div>
                    <div><span className="text-t-muted">Similarity:</span> <span className="text-t-primary font-medium">87%</span></div>
                    <div><span className="text-t-muted">Radius:</span> <span className="text-t-primary font-medium">2.8 km</span></div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
