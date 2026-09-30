'use client';

import { motion } from 'framer-motion';
import { useApp } from '@/lib/app-context';
import type { UserRole } from '@/lib/types';
import { Radio, ShieldCheck, MapPin, BarChart3, FileSearch, ArrowRight, Activity } from 'lucide-react';

const roles: { role: UserRole; label: string; icon: React.ElementType; description: string }[] = [
  { role: 'government-official', label: 'Government Official', icon: ShieldCheck, description: 'Full access to national infrastructure intelligence' },
  { role: 'administrator', label: 'Administrator', icon: Radio, description: 'Manage districts, projects, and user access' },
  { role: 'planning-officer', label: 'Planning Officer', icon: MapPin, description: 'Plan and allocate infrastructure investments' },
  { role: 'analyst', label: 'Analyst', icon: BarChart3, description: 'Analyze demand patterns and infrastructure gaps' },
  { role: 'auditor', label: 'Auditor', icon: FileSearch, description: 'Review project impact and investment outcomes' },
];

export default function LoginPage() {
  const { login, settings } = useApp();

  return (
    <div className="relative min-h-screen overflow-hidden bg-base flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute inset-0 radial-glow" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-accent-primary/5 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-accent-cyan/5 blur-[100px]" />

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-accent-primary/30"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 2 }}
        />
      ))}

      {/* India map dots network */}
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1000 600">
        {[
          [300, 200], [350, 180], [400, 220], [320, 250], [380, 280],
          [420, 300], [360, 320], [310, 340], [390, 360], [440, 340],
          [350, 400], [410, 420], [460, 380], [330, 380], [480, 400],
          [370, 450], [430, 460], [500, 440], [350, 480], [410, 500],
        ].map(([cx, cy], i) => (
          <motion.circle
            key={i}
            cx={cx} cy={cy} r="2"
            fill="rgb(var(--accent-primary))"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
        {[
          [300, 200, 350, 180], [350, 180, 400, 220], [300, 200, 320, 250],
          [320, 250, 380, 280], [380, 280, 420, 300], [360, 320, 310, 340],
          [310, 340, 390, 360], [390, 360, 440, 340], [350, 400, 410, 420],
          [410, 420, 460, 380], [330, 380, 350, 400], [460, 380, 480, 400],
          [370, 450, 430, 460], [430, 460, 500, 440], [350, 480, 410, 500],
        ].map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgb(var(--accent-primary))" strokeWidth="0.5" opacity="0.3" />
        ))}
      </svg>

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass rounded-2xl p-8 shadow-2xl"
        >
          {/* Logo */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-24 h-24 rounded-2xl bg-white p-2 flex items-center justify-center shadow-xl border border-white/20 mb-3 overflow-hidden">
              <img src="/logo.png" alt="CIVIC SENSE Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-xl font-bold text-t-primary tracking-tight">CIVIC SENSE</h1>
            <p className="text-xs font-semibold accent-primary mt-0.5 tracking-wide">ACTIVATING COMMUNITY | ENGAGING CHANGE</p>
            <p className="text-xs text-t-muted mt-1">AI Infrastructure Intelligence</p>
          </div>

          <p className="text-sm text-t-secondary text-center mb-1">
            Turning citizen voices into infrastructure intelligence.
          </p>
          <p className="text-xs text-t-muted text-center mb-6">
            Select a role to explore the platform with demo data.
          </p>

          {/* Demo badge */}
          {settings.demoMode && (
            <div className="flex items-center gap-2 mb-6 px-3 py-2 rounded-lg bg-accent-warning/10 border border-accent-warning/30">
              <span className="w-2 h-2 rounded-full bg-accent-warning animate-pulse" />
              <span className="text-xs font-medium accent-warning">DEMO DATA — Full access enabled</span>
            </div>
          )}

          {/* Role selection */}
          <div className="space-y-2">
            {roles.map(({ role, label, icon: Icon, description }, idx) => (
              <motion.button
                key={role}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
                onClick={() => login(role)}
                className="group w-full flex items-center gap-3 p-3 rounded-xl bg-surface border border-c hover:border-accent-primary/40 hover:bg-elevated transition-all text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-elevated flex items-center justify-center group-hover:bg-accent-primary/20 transition-colors">
                  <Icon className="w-4 h-4 text-t-secondary group-hover:accent-primary transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-t-primary">{label}</p>
                  <p className="text-xs text-t-muted truncate">{description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-t-muted group-hover:accent-primary group-hover:translate-x-0.5 transition-all" />
              </motion.button>
            ))}
          </div>

          <p className="text-xs text-t-muted text-center mt-6">
            No authentication required for this demo.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
