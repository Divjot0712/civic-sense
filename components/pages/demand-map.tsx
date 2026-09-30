'use client';

import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { IndiaMap } from '@/components/india-map';
import { HotspotPanel } from '@/components/hotspot-panel';
import { PageHeader, SeverityBadge, formatINR } from '@/components/shared';
import { DISTRICTS, CLUSTERS, CATEGORY_LABELS } from '@/lib/mock-data';
import type { IssueCategory } from '@/lib/types';
import { Layers, AlertTriangle, MapPin } from 'lucide-react';

export function DemandMapPage() {
  const { t, selectedDistrict, setSelectedDistrict } = useApp();
  const [panelOpen, setPanelOpen] = useState(false);

  const handleDistrictClick = (d: typeof DISTRICTS[0]) => {
    setSelectedDistrict(d);
    setPanelOpen(true);
  };

  return (
    <div className="space-y-4">
      <PageHeader title={t('demandMap')} subtitle="Interactive map of citizen demand hotspots, infrastructure scores, and investment patterns across India." />

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <IndiaMap />
        </div>

        {/* Side panel: hotspot list */}
        <div className="space-y-3">
          <div className="rounded-xl bg-surface border border-c p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 accent-critical" />
              <span className="text-sm font-semibold text-t-primary">Active Hotspots</span>
            </div>
            <div className="space-y-2 max-h-[480px] overflow-y-auto scrollbar-thin">
              {CLUSTERS.map((c) => {
                const district = DISTRICTS.find((d) => d.id === c.districtId);
                return (
                  <button
                    key={c.id}
                    onClick={() => { if (district) { setSelectedDistrict(district); setPanelOpen(true); } }}
                    className="w-full text-left p-3 rounded-lg bg-base border border-c hover:border-accent-primary/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-t-primary">{CATEGORY_LABELS[c.category]} Cluster {c.id}</span>
                      <SeverityBadge severity={c.severity} />
                    </div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <MapPin className="w-3 h-3 text-t-muted" />
                      <span className="text-xs text-t-muted">{c.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-t-muted">
                      <span>{c.reportCount.toLocaleString()} reports</span>
                      <span>{c.similarity}% similarity</span>
                      <span>{c.radiusKm} km radius</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category breakdown */}
          <div className="rounded-xl bg-surface border border-c p-4">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 accent-primary" />
              <span className="text-sm font-semibold text-t-primary">Demand by Category</span>
            </div>
            <div className="space-y-2">
              {(Object.keys(CATEGORY_LABELS) as IssueCategory[]).map((cat) => {
                const total = DISTRICTS.reduce((sum, d) => sum + d.demandByCategory[cat], 0);
                const avg = Math.round(total / DISTRICTS.length);
                return (
                  <div key={cat} className="flex items-center gap-3">
                    <span className="text-xs text-t-secondary w-24 truncate">{CATEGORY_LABELS[cat]}</span>
                    <div className="flex-1 h-2 rounded-full bg-base overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-accent-primary to-accent-cyan" style={{ width: `${avg}%` }} />
                    </div>
                    <span className="text-xs text-t-muted w-8 text-right">{avg}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {panelOpen && selectedDistrict && (
        <HotspotPanel district={selectedDistrict} onClose={() => setPanelOpen(false)} />
      )}
    </div>
  );
}
