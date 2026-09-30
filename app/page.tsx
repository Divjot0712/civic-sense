'use client';

import { useApp } from '@/lib/app-context';
import LoginPage from '@/components/login-page';
import { Sidebar } from '@/components/sidebar';
import { TopBar, SearchModal } from '@/components/topbar';
import { AIAssistantPanel } from '@/components/ai-assistant';
import { OverviewPage } from '@/components/pages/overview';
import { CitizenVoicePage } from '@/components/pages/citizen-voice';
import { DemandMapPage } from '@/components/pages/demand-map';
import { InfrastructurePage } from '@/components/pages/infrastructure';
import { AIInsightsPage } from '@/components/pages/ai-insights';
import { ProjectsPage } from '@/components/pages/projects';
import { ImpactPage } from '@/components/pages/impact';
import { SimulatorPage } from '@/components/pages/simulator';
import { ReportsPage } from '@/components/pages/reports';
import { DataExplorerPage } from '@/components/pages/data-explorer';
import { SettingsPage } from '@/components/pages/settings';
import { PresentationMode } from '@/components/presentation-mode';
import { AnimatePresence, motion } from 'framer-motion';

export default function Home() {
  const { user, currentPage, presentationMode } = useApp();

  if (!user) return <LoginPage />;

  if (presentationMode) return <PresentationMode />;

  const pages: Record<string, React.ReactNode> = {
    'overview': <OverviewPage />,
    'citizen-voice': <CitizenVoicePage />,
    'demand-map': <DemandMapPage />,
    'infrastructure': <InfrastructurePage />,
    'ai-insights': <AIInsightsPage />,
    'projects': <ProjectsPage />,
    'impact': <ImpactPage />,
    'simulator': <SimulatorPage />,
    'reports': <ReportsPage />,
    'data-explorer': <DataExplorerPage />,
    'settings': <SettingsPage />,
  };

  return (
    <div className="flex min-h-screen bg-base">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto scrollbar-thin p-4 lg:p-6 pb-20 lg:pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {pages[currentPage] || <OverviewPage />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <SearchModal />
      <AIAssistantPanel />
    </div>
  );
}
