'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/lib/app-context';
import { DISTRICTS, CLUSTERS, getDistrictById } from '@/lib/mock-data';
import type { District, Severity } from '@/lib/types';
import { ZoomIn, ZoomOut, Layers, Filter, X, MapPin } from 'lucide-react';

const severityColors: Record<Severity, string> = {
  low: '#34A853',
  medium: '#FBBC04',
  high: '#F97316',
  critical: '#EA4335',
};

type MapMode = 'demand' | 'infrastructure' | 'investment' | 'population' | 'projects' | 'impact';

const modeColors: Record<MapMode, (d: District) => string> = {
  demand: (d) => {
    if (d.citizenRequests > 30000) return '#EA4335';
    if (d.citizenRequests > 15000) return '#F97316';
    if (d.citizenRequests > 8000) return '#FBBC04';
    return '#34A853';
  },
  infrastructure: (d) => {
    if (d.infrastructureIndex < 45) return '#EA4335';
    if (d.infrastructureIndex < 55) return '#F97316';
    if (d.infrastructureIndex < 65) return '#FBBC04';
    return '#34A853';
  },
  investment: (d) => {
    if (d.investment > 500) return '#4285F4';
    if (d.investment > 300) return '#00C2FF';
    if (d.investment > 200) return '#FBBC04';
    return '#94A3B8';
  },
  population: (d) => {
    if (d.population > 5000000) return '#EA4335';
    if (d.population > 2000000) return '#F97316';
    if (d.population > 1000000) return '#FBBC04';
    return '#34A853';
  },
  projects: (d) => '#4285F4',
  impact: (d) => {
    if (d.resolvedRate > 75) return '#34A853';
    if (d.resolvedRate > 68) return '#FBBC04';
    return '#F97316';
  },
};

const modes: { id: MapMode; label: string }[] = [
  { id: 'demand', label: 'Demand' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'investment', label: 'Investment' },
  { id: 'population', label: 'Population' },
  { id: 'projects', label: 'Projects' },
  { id: 'impact', label: 'Impact' },
];

export function IndiaMap({ compact = false }: { compact?: boolean }) {
  const { setSelectedDistrict, setCurrentPage, selectedDistrict } = useApp();
  const [mode, setMode] = useState<MapMode>('demand');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState<District | null>(null);
  const [showClusters, setShowClusters] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const svgRef = useRef<SVGSVGElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleDistrictClick = useCallback((d: District) => {
    setSelectedDistrict(d);
  }, [setSelectedDistrict]);

  // Convert lat/lng to SVG coordinates (India roughly: 8-37N, 68-97E)
  const project = (lat: number, lng: number) => {
    const x = ((lng - 68) / 29) * 800 + 50;
    const y = ((37 - lat) / 29) * 600 + 50;
    return { x, y };
  };

  const getColor = (d: District) => modeColors[mode](d);
  const getRadius = (d: District) => {
    const base = 4 + (d.citizenRequests / 64200) * 12;
    return Math.max(4, Math.min(16, base));
  };

  const filteredDistricts = filterCategory === 'all'
    ? DISTRICTS
    : DISTRICTS.filter((d) => {
      const max = Object.entries(d.demandByCategory).reduce((a, [k, v]) => v > (a.v || 0) ? { k, v } : a, { k: '', v: 0 });
      return max.k === filterCategory;
    });

  return (
    <div className={`relative rounded-xl border border-c bg-surface overflow-hidden ${compact ? 'h-[400px]' : 'h-[560px]'}`}>
      {/* Map controls overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        <div className="flex items-center gap-1 rounded-lg bg-base/80 backdrop-blur-sm border border-c p-1">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                mode === m.id ? 'bg-accent-primary/20 accent-primary' : 'text-t-secondary hover:text-t-primary hover:bg-surface'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Zoom controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
        <button
          onClick={() => setZoom((z) => Math.min(z + 0.3, 3))}
          className="w-8 h-8 rounded-lg bg-base/80 backdrop-blur-sm border border-c flex items-center justify-center text-t-secondary hover:text-t-primary hover:bg-surface transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.3, 0.5))}
          className="w-8 h-8 rounded-lg bg-base/80 backdrop-blur-sm border border-c flex items-center justify-center text-t-secondary hover:text-t-primary hover:bg-surface transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
          className="w-8 h-8 rounded-lg bg-base/80 backdrop-blur-sm border border-c flex items-center justify-center text-t-secondary hover:text-t-primary hover:bg-surface transition-colors text-xs font-bold"
        >
          ⟲
        </button>
      </div>

      {/* Category filter */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5">
        <Filter className="w-3.5 h-3.5 text-t-muted" />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded-lg bg-base/80 backdrop-blur-sm border border-c px-2 py-1.5 text-xs text-t-secondary outline-none cursor-pointer"
        >
          <option value="all">All Categories</option>
          <option value="water">Water</option>
          <option value="roads">Roads</option>
          <option value="electricity">Electricity</option>
          <option value="waste">Waste</option>
          <option value="healthcare">Healthcare</option>
          <option value="education">Education</option>
        </select>
        <button
          onClick={() => setShowClusters(!showClusters)}
          className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-xs transition-colors ${
            showClusters ? 'bg-accent-primary/20 accent-primary border-accent-primary/30' : 'bg-base/80 text-t-secondary border-c'
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> Clusters
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 right-3 z-10 flex items-center gap-3 rounded-lg bg-base/80 backdrop-blur-sm border border-c px-3 py-2">
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: '#34A853' }} /><span className="text-[10px] text-t-muted">Low</span></div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: '#FBBC04' }} /><span className="text-[10px] text-t-muted">Medium</span></div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: '#F97316' }} /><span className="text-[10px] text-t-muted">High</span></div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: '#EA4335' }} /><span className="text-[10px] text-t-muted">Critical</span></div>
      </div>

      {/* SVG Map */}
      <div
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 900 700"
          className="w-full h-full"
          style={{ transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`, transformOrigin: 'center' }}
        >
          {/* Grid pattern */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(30,48,73,0.2)" strokeWidth="0.5" />
            </pattern>
            <radialGradient id="glow">
              <stop offset="0%" stopColor="rgba(66,133,244,0.15)" />
              <stop offset="100%" stopColor="rgba(66,133,244,0)" />
            </radialGradient>
          </defs>
          <rect width="900" height="700" fill="url(#grid)" />

          {/* India outline (simplified) */}
          <path
            d="M 150 80 L 250 60 L 350 70 L 450 50 L 550 80 L 650 120 L 700 200 L 720 300 L 680 400 L 620 480 L 550 520 L 480 540 L 400 530 L 320 510 L 250 480 L 200 420 L 170 350 L 140 280 L 130 200 L 150 80 Z"
            fill="rgba(13,27,42,0.5)"
            stroke="rgba(66,133,244,0.2)"
            strokeWidth="1"
            strokeDasharray="4 2"
          />

          {/* Connection lines between districts */}
          {filteredDistricts.map((d, i) => {
            const pos = project(d.lat, d.lng);
            const next = filteredDistricts[i + 1];
            if (!next) return null;
            const nextPos = project(next.lat, next.lng);
            const dist = Math.hypot(pos.x - nextPos.x, pos.y - nextPos.y);
            if (dist > 200) return null;
            return (
              <line
                key={`line-${d.id}`}
                x1={pos.x} y1={pos.y} x2={nextPos.x} y2={nextPos.y}
                stroke="rgba(66,133,244,0.08)"
                strokeWidth="0.5"
              />
            );
          })}

          {/* District markers */}
          {filteredDistricts.map((d) => {
            const pos = project(d.lat, d.lng);
            const color = getColor(d);
            const r = getRadius(d);
            const isSelected = selectedDistrict?.id === d.id;
            const isHovered = hovered?.id === d.id;
            return (
              <g key={d.id} onClick={(e) => { e.stopPropagation(); handleDistrictClick(d); }}>
                {/* Pulse ring for critical/high */}
                {(d.infrastructureIndex < 50 || d.citizenRequests > 20000) && (
                  <motion.circle
                    cx={pos.x} cy={pos.y} r={r}
                    fill="none"
                    stroke={color}
                    strokeWidth="1"
                    animate={{ r: [r, r + 8], opacity: [0.6, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                  />
                )}
                <circle
                  cx={pos.x} cy={pos.y} r={r}
                  fill={color}
                  fillOpacity={isHovered || isSelected ? 0.9 : 0.6}
                  stroke={color}
                  strokeWidth={isSelected ? 2 : 1}
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHovered(d)}
                  onMouseLeave={() => setHovered(null)}
                />
                {(isHovered || isSelected || zoom > 1.5) && (
                  <text
                    x={pos.x} y={pos.y - r - 4}
                    textAnchor="middle"
                    fill="rgba(248,250,252,0.8)"
                    fontSize="10"
                    className="pointer-events-none select-none"
                  >
                    {d.name}
                  </text>
                )}
              </g>
            );
          })}

          {/* Cluster markers */}
          {showClusters && CLUSTERS.map((c) => {
            const district = getDistrictById(c.districtId);
            if (!district) return null;
            if (filterCategory !== 'all' && c.category !== filterCategory) return null;
            const pos = project(district.lat, district.lng);
            const color = severityColors[c.severity];
            return (
              <g key={c.id}>
                <motion.circle
                  cx={pos.x} cy={pos.y} r={6}
                  fill="none"
                  stroke={color}
                  strokeWidth="1.5"
                  animate={{ r: [6, 14], opacity: [0.8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                />
                <circle cx={pos.x} cy={pos.y} r={3} fill={color} className="pointer-events-none" />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Hover tooltip */}
      {hovered && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className="flex items-center gap-3 rounded-lg bg-base/90 backdrop-blur-sm border border-c px-3 py-2 shadow-lg">
            <MapPin className="w-3.5 h-3.5 accent-primary" />
            <div className="flex items-center gap-4 text-xs">
              <span className="text-t-primary font-medium">{hovered.name}</span>
              <span className="text-t-muted">{hovered.stateName}</span>
              <span className="text-t-muted">{hovered.citizenRequests.toLocaleString()} requests</span>
              <span className="text-t-muted">Index: {hovered.infrastructureIndex}/100</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
