'use client';

import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function AnimatedCounter({ value, duration = 1.5, suffix = '', prefix = '' }: { value: number; duration?: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => {
    if (value >= 1000000) return `${prefix}${(v / 1000000).toFixed(1)}M${suffix}`;
    if (value >= 1000) return `${prefix}${(v / 1000).toFixed(1)}K${suffix}`;
    return `${prefix}${Math.round(v)}${suffix}`;
  });

  useEffect(() => {
    if (inView) {
      const controls = animate(count, value, { duration, ease: 'easeOut' });
      return controls.stop;
    }
  }, [inView, value, count, duration]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export function KPICard({
  label, value, change, changeType, icon: Icon, suffix = '', prefix = '',
}: {
  label: string;
  value: number;
  change?: string;
  changeType?: 'up' | 'down';
  icon?: React.ElementType;
  suffix?: string;
  prefix?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-xl bg-surface border border-c p-4 hover:border-accent-primary/30 transition-colors group overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <p className="text-xs text-t-muted font-medium">{label}</p>
          {Icon && <Icon className="w-4 h-4 text-t-muted group-hover:accent-primary transition-colors" />}
        </div>
        <p className="text-2xl font-bold text-t-primary tracking-tight">
          <AnimatedCounter value={value} suffix={suffix} prefix={prefix} />
        </p>
        {change && (
          <div className="flex items-center gap-1 mt-2">
            {changeType === 'up' ? (
              <TrendingUp className="w-3 h-3 accent-success" />
            ) : (
              <TrendingDown className="w-3 h-3 accent-critical" />
            )}
            <span className={`text-xs font-medium ${changeType === 'up' ? 'accent-success' : 'accent-critical'}`}>
              {change}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    low: 'bg-accent-success/15 accent-success border-accent-success/30',
    medium: 'bg-accent-warning/15 accent-warning border-accent-warning/30',
    high: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    critical: 'bg-accent-critical/15 accent-critical border-accent-critical/30',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${colors[severity] || colors.low}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        severity === 'critical' ? 'bg-accent-critical' :
        severity === 'high' ? 'bg-orange-500' :
        severity === 'medium' ? 'bg-accent-warning' : 'bg-accent-success'
      }`} />
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    planning: 'bg-t-muted/15 text-t-secondary border-c',
    approved: 'bg-accent-info/15 text-sky-400 border-accent-info/30',
    'in-progress': 'bg-accent-primary/15 accent-primary border-accent-primary/30',
    completed: 'bg-accent-success/15 accent-success border-accent-success/30',
    delayed: 'bg-accent-critical/15 accent-critical border-accent-critical/30',
    verified: 'bg-accent-success/15 accent-success border-accent-success/30',
    pending: 'bg-accent-warning/15 accent-warning border-accent-warning/30',
    resolved: 'bg-accent-success/15 accent-success border-accent-success/30',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colors[status] || colors.planning}`}>
      {status.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
    </span>
  );
}

export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6">
      <motion.h1
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl lg:text-2xl font-bold text-t-primary tracking-tight"
      >
        {title}
      </motion.h1>
      {subtitle && <p className="text-sm text-t-muted mt-1">{subtitle}</p>}
      {children}
    </div>
  );
}

export function EmptyState({ title, description, icon: Icon }: { title: string; description: string; icon: React.ElementType }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-xl bg-surface border border-c flex items-center justify-center mb-3">
        <Icon className="w-6 h-6 text-t-muted" />
      </div>
      <p className="text-sm font-medium text-t-primary">{title}</p>
      <p className="text-xs text-t-muted mt-1 max-w-xs">{description}</p>
    </div>
  );
}

export function formatINR(crores: number): string {
  return `₹${crores} Cr`;
}
