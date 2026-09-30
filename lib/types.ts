export type PageId =
  | 'overview'
  | 'citizen-voice'
  | 'demand-map'
  | 'infrastructure'
  | 'ai-insights'
  | 'projects'
  | 'impact'
  | 'simulator'
  | 'reports'
  | 'data-explorer'
  | 'settings';

export type UserRole =
  | 'government-official'
  | 'administrator'
  | 'planning-officer'
  | 'analyst'
  | 'auditor';

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export type IssueCategory =
  | 'water'
  | 'roads'
  | 'electricity'
  | 'waste'
  | 'healthcare'
  | 'education';

export type ProjectStatus =
  | 'planning'
  | 'approved'
  | 'in-progress'
  | 'completed'
  | 'delayed';

export type LanguageCode =
  | 'en'
  | 'hi'
  | 'pa'
  | 'bn'
  | 'ta'
  | 'te'
  | 'mr'
  | 'gu'
  | 'kn'
  | 'ml'
  | 'ur';

export interface State {
  id: string;
  name: string;
  districts: string[];
}

export interface District {
  id: string;
  name: string;
  stateId: string;
  stateName: string;
  lat: number;
  lng: number;
  population: number;
  citizenRequests: number;
  infrastructureIndex: number;
  investment: number;
  resolvedRate: number;
  scores: Record<IssueCategory, number>;
  demandByCategory: Record<IssueCategory, number>;
  digitalConnectivity: 'low' | 'medium' | 'high';
  underReported: boolean;
}

export interface CitizenRequest {
  id: string;
  districtId: string;
  category: IssueCategory;
  severity: Severity;
  language: LanguageCode;
  location: string;
  status: 'verified' | 'pending' | 'resolved';
  summary: string;
  createdAt: string;
  affectedPopulation: number;
  relatedRequests: number;
  clusterId?: string;
}

export interface Cluster {
  id: string;
  category: IssueCategory;
  districtId: string;
  reportCount: number;
  similarity: number;
  radiusKm: number;
  location: string;
  severity: Severity;
}

export interface Project {
  id: string;
  name: string;
  districtId: string;
  districtName: string;
  category: IssueCategory;
  budget: number;
  status: ProjectStatus;
  citizenDemand: number;
  infraScoreBefore: number;
  infraScoreAfter: number;
  startDate: string;
  expectedCompletion: string;
  affectedPopulation: number;
  milestones: { label: string; date: string; done: boolean }[];
  impact: {
    complaintsBefore: number;
    complaintsAfter: number;
    satisfactionBefore: number;
    satisfactionAfter: number;
    resolutionDaysBefore: number;
    resolutionDaysAfter: number;
  };
}

export interface Notification {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  page: PageId;
  time: string;
  read: boolean;
}

export interface AIInsight {
  id: string;
  question: string;
  answer: string;
  confidence: number;
  districts: string[];
  metrics: { label: string; value: string }[];
  chartData?: { label: string; value: number }[];
  sources: string[];
}

export interface BackgroundPreset {
  id: string;
  name: string;
  colors: string[];
  type: 'gradient' | 'solid' | 'image';
}

export type ThemeMode = 'dark' | 'light';

export interface AppSettings {
  theme: ThemeMode;
  background: string;
  accentColor: string;
  glassEffect: boolean;
  animations: boolean;
  mapStyle: 'dark' | 'light' | 'satellite';
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  aiResponseStyle: 'concise' | 'detailed';
  confidenceThreshold: number;
  autoClustering: boolean;
  autoTranslation: boolean;
  interfaceLanguage: LanguageCode;
  citizenLanguage: LanguageCode;
  refreshInterval: number;
  demoMode: boolean;
}
