'use client';

import { useApp } from '@/lib/app-context';
import { PageHeader } from '@/components/shared';
import { BACKGROUND_PRESETS, ACCENT_COLORS } from '@/lib/mock-data';
import { LANGUAGES } from '@/lib/translations';
import type { ThemeMode, LanguageCode } from '@/lib/types';
import { Palette, BrainCircuit, Globe, Database, Accessibility, Check } from 'lucide-react';

export function SettingsPage() {
  const { t, settings, updateSettings } = useApp();

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader title={t('settings')} subtitle="Customize appearance, AI behavior, language, data, and accessibility." />

      {/* Appearance */}
      <Section icon={Palette} title={t('appearance')}>
        <Row label={t('theme')}>
          <div className="flex gap-2">
            {(['dark', 'light'] as ThemeMode[]).map((mode) => (
              <button key={mode} onClick={() => updateSettings({ theme: mode })} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors capitalize ${settings.theme === mode ? 'bg-accent-primary/20 accent-primary border-accent-primary/30' : 'bg-base text-t-secondary border-c hover:text-t-primary'}`}>
                {mode}
              </button>
            ))}
          </div>
        </Row>

        <Row label={t('background')}>
          <div className="grid grid-cols-5 gap-2">
            {BACKGROUND_PRESETS.map((bg) => (
              <button key={bg.id} onClick={() => updateSettings({ background: bg.id })} className={`relative rounded-lg border-2 transition-all ${settings.background === bg.id ? 'border-accent-primary' : 'border-c'}`} style={{ background: `linear-gradient(135deg, ${bg.colors[0]}, ${bg.colors[1]})` }}>
                <span className="block h-12" />
                {settings.background === bg.id && <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-accent-primary flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white" /></span>}
              </button>
            ))}
          </div>
        </Row>

        <Row label={t('accentColor')}>
          <div className="flex gap-2">
            {ACCENT_COLORS.map((c) => (
              <button key={c.id} onClick={() => updateSettings({ accentColor: c.id })} className={`w-8 h-8 rounded-full border-2 transition-all ${settings.accentColor === c.id ? 'border-white scale-110' : 'border-transparent'}`} style={{ background: `rgb(${c.value})` }} />
            ))}
          </div>
        </Row>

        <ToggleRow label={t('glassEffect')} checked={settings.glassEffect} onChange={(v) => updateSettings({ glassEffect: v })} />
        <ToggleRow label={t('animations')} checked={settings.animations} onChange={(v) => updateSettings({ animations: v })} />

        <Row label={t('mapStyle')}>
          <select value={settings.mapStyle} onChange={(e) => updateSettings({ mapStyle: e.target.value as 'dark' | 'light' | 'satellite' })} className="bg-base border border-c rounded-lg px-3 py-1.5 text-xs text-t-secondary outline-none cursor-pointer">
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="satellite">Satellite</option>
          </select>
        </Row>
      </Section>

      {/* AI */}
      <Section icon={BrainCircuit} title={t('ai')}>
        <Row label={t('aiResponseStyle')}>
          <select value={settings.aiResponseStyle} onChange={(e) => updateSettings({ aiResponseStyle: e.target.value as 'concise' | 'detailed' })} className="bg-base border border-c rounded-lg px-3 py-1.5 text-xs text-t-secondary outline-none cursor-pointer">
            <option value="concise">Concise</option>
            <option value="detailed">Detailed</option>
          </select>
        </Row>
        <Row label={`${t('confidenceThreshold')} (${settings.confidenceThreshold}%)`}>
          <input type="range" min="50" max="100" value={settings.confidenceThreshold} onChange={(e) => updateSettings({ confidenceThreshold: Number(e.target.value) })} className="flex-1 accent-primary" />
        </Row>
        <ToggleRow label={t('automaticClustering')} checked={settings.autoClustering} onChange={(v) => updateSettings({ autoClustering: v })} />
        <ToggleRow label={t('automaticTranslation')} checked={settings.autoTranslation} onChange={(v) => updateSettings({ autoTranslation: v })} />
      </Section>

      {/* Language */}
      <Section icon={Globe} title={t('languageSettings')}>
        <Row label={t('interfaceLanguage')}>
          <select value={settings.interfaceLanguage} onChange={(e) => updateSettings({ interfaceLanguage: e.target.value as LanguageCode })} className="bg-base border border-c rounded-lg px-3 py-1.5 text-xs text-t-secondary outline-none cursor-pointer">
            {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label} ({l.nativeLabel})</option>)}
          </select>
        </Row>
        <Row label={t('defaultCitizenLanguage')}>
          <select value={settings.citizenLanguage} onChange={(e) => updateSettings({ citizenLanguage: e.target.value as LanguageCode })} className="bg-base border border-c rounded-lg px-3 py-1.5 text-xs text-t-secondary outline-none cursor-pointer">
            {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label} ({l.nativeLabel})</option>)}
          </select>
        </Row>
      </Section>

      {/* Data */}
      <Section icon={Database} title={t('data')}>
        <Row label={t('refreshInterval')}>
          <select value={settings.refreshInterval} onChange={(e) => updateSettings({ refreshInterval: Number(e.target.value) })} className="bg-base border border-c rounded-lg px-3 py-1.5 text-xs text-t-secondary outline-none cursor-pointer">
            <option value={10}>Every 10 seconds</option>
            <option value={30}>Every 30 seconds</option>
            <option value={60}>Every minute</option>
            <option value={300}>Every 5 minutes</option>
          </select>
        </Row>
        <Row label={t('datasetManagement')}>
          <button className="px-3 py-1.5 rounded-lg bg-base border border-c text-xs text-t-secondary hover:text-t-primary transition-colors">Manage Datasets</button>
        </Row>
        <Row label={t('exportSettings')}>
          <button className="px-3 py-1.5 rounded-lg bg-base border border-c text-xs text-t-secondary hover:text-t-primary transition-colors">Export Settings</button>
        </Row>
        <ToggleRow label="Demo Mode" checked={settings.demoMode} onChange={(v) => updateSettings({ demoMode: v })} />
      </Section>

      {/* Accessibility */}
      <Section icon={Accessibility} title={t('accessibility')}>
        <Row label={t('fontSize')}>
          <div className="flex gap-2">
            {(['small', 'medium', 'large'] as const).map((size) => (
              <button key={size} onClick={() => updateSettings({ fontSize: size })} className={`px-3 py-1.5 rounded-lg text-xs font-medium border capitalize transition-colors ${settings.fontSize === size ? 'bg-accent-primary/20 accent-primary border-accent-primary/30' : 'bg-base text-t-secondary border-c hover:text-t-primary'}`}>
                {size}
              </button>
            ))}
          </div>
        </Row>
        <ToggleRow label={t('highContrast')} checked={settings.highContrast} onChange={(v) => updateSettings({ highContrast: v })} />
        <ToggleRow label={t('reducedMotion')} checked={settings.reducedMotion} onChange={(v) => updateSettings({ reducedMotion: v })} />
      </Section>
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-surface border border-c p-4">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 accent-primary" />
        <h3 className="text-sm font-semibold text-t-primary">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <span className="text-xs text-t-secondary">{label}</span>
      {children}
    </div>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-t-secondary">{label}</span>
      <button onClick={() => onChange(!checked)} className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-accent-primary' : 'bg-base border border-c'}`}>
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}
