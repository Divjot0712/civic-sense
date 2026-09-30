'use client';

import { useApp } from '@/lib/app-context';
import { PageHeader } from '@/components/shared';
import { DISTRICTS, CATEGORY_LABELS } from '@/lib/mock-data';
import type { IssueCategory } from '@/lib/types';
import { Droplets, Route, Zap, HeartPulse, GraduationCap, Trash2 } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

const categoryIcons: Record<IssueCategory, React.ElementType> = {
  water: Droplets, roads: Route, electricity: Zap,
  healthcare: HeartPulse, education: GraduationCap, waste: Trash2,
};

function getHeatColor(score: number): string {
  if (score < 40) return 'bg-accent-critical/20 text-accent-critical border-accent-critical/30';
  if (score < 50) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
  if (score < 60) return 'bg-accent-warning/20 accent-warning border-accent-warning/30';
  if (score < 70) return 'bg-accent-info/20 text-sky-400 border-accent-info/30';
  return 'bg-accent-success/20 accent-success border-accent-success/30';
}

export function InfrastructurePage() {
  const { t } = useApp();

  const avgScores: Record<IssueCategory, number> = {
    water: 0, roads: 0, electricity: 0, healthcare: 0, education: 0, waste: 0,
  };
  DISTRICTS.forEach((d) => {
    (Object.keys(avgScores) as IssueCategory[]).forEach((cat) => {
      avgScores[cat] += d.scores[cat];
    });
  });
  (Object.keys(avgScores) as IssueCategory[]).forEach((cat) => {
    avgScores[cat] = Math.round(avgScores[cat] / DISTRICTS.length);
  });

  const categories = (Object.keys(CATEGORY_LABELS) as IssueCategory[]);

  return (
    <div className="space-y-6">
      <PageHeader title={t('infrastructureHealth')} subtitle="Infrastructure scores across water, roads, electricity, healthcare, education, and waste management." />

      {/* Category cards with radial charts */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {categories.map((cat) => {
          const Icon = categoryIcons[cat];
          const score = avgScores[cat];
          const data = [{ name: cat, value: score, fill: score < 45 ? '#EA4335' : score < 55 ? '#FBBC04' : score < 65 ? '#4285F4' : '#34A853' }];
          return (
            <div key={cat} className="rounded-xl bg-surface border border-c p-4 flex flex-col items-center">
              <div className="flex items-center gap-1.5 mb-2">
                <Icon className="w-3.5 h-3.5 text-t-muted" />
                <span className="text-xs text-t-secondary">{CATEGORY_LABELS[cat]}</span>
              </div>
              <ResponsiveContainer width="100%" height={100}>
                <RadialBarChart innerRadius="70%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar background={{ fill: 'rgba(30,48,73,0.3)' }} dataKey="value" cornerRadius={8} />
                </RadialBarChart>
              </ResponsiveContainer>
              <p className="text-xl font-bold text-t-primary -mt-12">{score}<span className="text-xs text-t-muted">/100</span></p>
              <p className={`text-[10px] mt-6 px-2 py-0.5 rounded-full border ${getHeatColor(score)}`}>
                {score < 45 ? 'Critical' : score < 55 ? 'Below Avg' : score < 65 ? 'Average' : 'Good'}
              </p>
            </div>
          );
        })}
      </div>

      {/* Infrastructure Gap Matrix */}
      <div className="rounded-xl bg-surface border border-c p-4">
        <h3 className="text-sm font-semibold text-t-primary mb-3">Infrastructure Gap Matrix</h3>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-c">
                <th className="text-left py-2 px-3 text-t-muted font-medium">District</th>
                {categories.map((cat) => (
                  <th key={cat} className="text-center py-2 px-2 text-t-muted font-medium">{CATEGORY_LABELS[cat].split(' ')[0]}</th>
                ))}
                <th className="text-center py-2 px-3 text-t-muted font-medium">Avg</th>
              </tr>
            </thead>
            <tbody>
              {DISTRICTS.map((d) => {
                const avg = Math.round(Object.values(d.scores).reduce((a, b) => a + b, 0) / 6);
                return (
                  <tr key={d.id} className="border-b border-c/50 hover:bg-base/50 transition-colors">
                    <td className="py-2 px-3 text-t-secondary font-medium">{d.name}</td>
                    {categories.map((cat) => (
                      <td key={cat} className="text-center py-2 px-2">
                        <span className={`inline-flex items-center justify-center w-10 h-7 rounded text-[10px] font-medium border ${getHeatColor(d.scores[cat])}`}>
                          {d.scores[cat]}
                        </span>
                      </td>
                    ))}
                    <td className="text-center py-2 px-3">
                      <span className={`inline-flex items-center justify-center w-10 h-7 rounded text-[10px] font-bold border ${getHeatColor(avg)}`}>{avg}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
