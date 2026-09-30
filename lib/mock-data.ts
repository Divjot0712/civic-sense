import type {
  State, District, CitizenRequest, Cluster, Project, Notification,
  AIInsight, IssueCategory, Severity, LanguageCode,
} from './types';

export const STATES: State[] = [
  { id: 'dl', name: 'Delhi', districts: ['central-delhi', 'south-delhi', 'north-delhi', 'east-delhi'] },
  { id: 'up', name: 'Uttar Pradesh', districts: ['lucknow', 'kanpur', 'agra', 'varanasi', 'meerut'] },
  { id: 'pb', name: 'Punjab', districts: ['ludhiana', 'amritsar', 'jalandhar'] },
  { id: 'hr', name: 'Haryana', districts: ['gurugram', 'faridabad', 'panipat'] },
  { id: 'mh', name: 'Maharashtra', districts: ['mumbai-suburban', 'pune', 'nagpur', 'nashik'] },
  { id: 'ka', name: 'Karnataka', districts: ['bengaluru-urban', 'mysuru', 'hubli-dharwad'] },
  { id: 'tn', name: 'Tamil Nadu', districts: ['chennai', 'coimbatore', 'madurai'] },
  { id: 'wb', name: 'West Bengal', districts: ['kolkata', 'howrah', 'darjeeling'] },
  { id: 'gj', name: 'Gujarat', districts: ['ahmedabad', 'surat', 'vadodara'] },
  { id: 'rj', name: 'Rajasthan', districts: ['jaipur', 'jodhpur', 'udaipur'] },
];

const categoryNames: Record<IssueCategory, string> = {
  water: 'Water', roads: 'Roads', electricity: 'Electricity',
  healthcare: 'Healthcare', education: 'Education', waste: 'Waste Management',
};

function makeScores(water: number, roads: number, electricity: number, healthcare: number, education: number, waste: number): Record<IssueCategory, number> {
  return { water, roads, electricity, healthcare, education, waste };
}

function makeDemand(water: number, roads: number, electricity: number, healthcare: number, education: number, waste: number): Record<IssueCategory, number> {
  return { water, roads, electricity, healthcare, education, waste };
}

export const DISTRICTS: District[] = [
  { id: 'central-delhi', name: 'Central Delhi', stateId: 'dl', stateName: 'Delhi', lat: 28.6517, lng: 77.2219, population: 582000, citizenRequests: 18420, infrastructureIndex: 72, investment: 420, resolvedRate: 81, scores: makeScores(68, 74, 89, 71, 76, 54), demandByCategory: makeDemand(41, 27, 18, 8, 6, 14), digitalConnectivity: 'high', underReported: false },
  { id: 'south-delhi', name: 'South Delhi', stateId: 'dl', stateName: 'Delhi', lat: 28.5355, lng: 77.2502, population: 273000, citizenRequests: 12480, infrastructureIndex: 78, investment: 380, resolvedRate: 85, scores: makeScores(75, 80, 92, 78, 82, 61), demandByCategory: makeDemand(35, 22, 15, 12, 8, 18), digitalConnectivity: 'high', underReported: false },
  { id: 'north-delhi', name: 'North Delhi', stateId: 'dl', stateName: 'Delhi', lat: 28.7000, lng: 77.2000, population: 620000, citizenRequests: 22100, infrastructureIndex: 51, investment: 290, resolvedRate: 68, scores: makeScores(42, 55, 79, 48, 62, 38), demandByCategory: makeDemand(44, 25, 12, 9, 5, 16), digitalConnectivity: 'medium', underReported: false },
  { id: 'east-delhi', name: 'East Delhi', stateId: 'dl', stateName: 'Delhi', lat: 28.6280, lng: 77.2950, population: 485000, citizenRequests: 16700, infrastructureIndex: 47, investment: 210, resolvedRate: 64, scores: makeScores(38, 48, 74, 45, 58, 35), demandByCategory: makeDemand(46, 24, 14, 8, 4, 18), digitalConnectivity: 'medium', underReported: true },

  { id: 'lucknow', name: 'Lucknow', stateId: 'up', stateName: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, population: 3650000, citizenRequests: 38200, infrastructureIndex: 55, investment: 520, resolvedRate: 71, scores: makeScores(48, 58, 81, 52, 64, 41), demandByCategory: makeDemand(38, 28, 16, 8, 5, 13), digitalConnectivity: 'medium', underReported: false },
  { id: 'kanpur', name: 'Kanpur', stateId: 'up', stateName: 'Uttar Pradesh', lat: 26.4499, lng: 80.3319, population: 3100000, citizenRequests: 29400, infrastructureIndex: 42, investment: 180, resolvedRate: 59, scores: makeScores(35, 44, 72, 41, 55, 32), demandByCategory: makeDemand(42, 26, 14, 9, 4, 15), digitalConnectivity: 'low', underReported: true },
  { id: 'agra', name: 'Agra', stateId: 'up', stateName: 'Uttar Pradesh', lat: 27.1750, lng: 78.0422, population: 2100000, citizenRequests: 19800, infrastructureIndex: 49, investment: 150, resolvedRate: 66, scores: makeScores(41, 51, 76, 47, 59, 37), demandByCategory: makeDemand(39, 27, 15, 8, 5, 14), digitalConnectivity: 'low', underReported: false },
  { id: 'varanasi', name: 'Varanasi', stateId: 'up', stateName: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739, population: 1500000, citizenRequests: 16500, infrastructureIndex: 53, investment: 240, resolvedRate: 70, scores: makeScores(45, 56, 78, 50, 61, 40), demandByCategory: makeDemand(37, 26, 16, 9, 6, 12), digitalConnectivity: 'medium', underReported: false },
  { id: 'meerut', name: 'Meerut', stateId: 'up', stateName: 'Uttar Pradesh', lat: 28.9845, lng: 77.7064, population: 1850000, citizenRequests: 14200, infrastructureIndex: 57, investment: 190, resolvedRate: 73, scores: makeScores(50, 60, 82, 53, 65, 43), demandByCategory: makeDemand(36, 25, 17, 10, 6, 13), digitalConnectivity: 'medium', underReported: false },

  { id: 'ludhiana', name: 'Ludhiana', stateId: 'pb', stateName: 'Punjab', lat: 30.9010, lng: 75.8573, population: 1620000, citizenRequests: 18600, infrastructureIndex: 61, investment: 310, resolvedRate: 75, scores: makeScores(55, 64, 84, 57, 68, 48), demandByCategory: makeDemand(35, 26, 16, 10, 7, 12), digitalConnectivity: 'high', underReported: false },
  { id: 'amritsar', name: 'Amritsar', stateId: 'pb', stateName: 'Punjab', lat: 31.6340, lng: 74.8723, population: 1130000, citizenRequests: 12800, infrastructureIndex: 64, investment: 220, resolvedRate: 77, scores: makeScores(58, 67, 86, 60, 70, 51), demandByCategory: makeDemand(33, 24, 17, 11, 8, 13), digitalConnectivity: 'high', underReported: false },
  { id: 'jalandhar', name: 'Jalandhar', stateId: 'pb', stateName: 'Punjab', lat: 31.3260, lng: 75.5762, population: 870000, citizenRequests: 9400, infrastructureIndex: 66, investment: 180, resolvedRate: 79, scores: makeScores(60, 69, 87, 62, 72, 53), demandByCategory: makeDemand(32, 23, 18, 11, 9, 13), digitalConnectivity: 'high', underReported: false },

  { id: 'gurugram', name: 'Gurugram', stateId: 'hr', stateName: 'Haryana', lat: 28.4595, lng: 77.0266, population: 1530000, citizenRequests: 24300, infrastructureIndex: 68, investment: 450, resolvedRate: 80, scores: makeScores(62, 71, 88, 64, 73, 55), demandByCategory: makeDemand(34, 25, 16, 11, 8, 14), digitalConnectivity: 'high', underReported: false },
  { id: 'faridabad', name: 'Faridabad', stateId: 'hr', stateName: 'Haryana', lat: 28.4041, lng: 77.3105, population: 1390000, citizenRequests: 18700, infrastructureIndex: 52, investment: 220, resolvedRate: 67, scores: makeScores(44, 54, 78, 48, 60, 40), demandByCategory: makeDemand(40, 26, 15, 9, 5, 14), digitalConnectivity: 'medium', underReported: false },
  { id: 'panipat', name: 'Panipat', stateId: 'hr', stateName: 'Haryana', lat: 29.3909, lng: 76.9635, population: 610000, citizenRequests: 7800, infrastructureIndex: 58, investment: 140, resolvedRate: 72, scores: makeScores(51, 61, 83, 54, 66, 46), demandByCategory: makeDemand(36, 25, 17, 10, 7, 13), digitalConnectivity: 'medium', underReported: false },

  { id: 'mumbai-suburban', name: 'Mumbai Suburban', stateId: 'mh', stateName: 'Maharashtra', lat: 19.0760, lng: 72.8777, population: 9350000, citizenRequests: 64200, infrastructureIndex: 65, investment: 820, resolvedRate: 78, scores: makeScores(59, 68, 85, 61, 70, 52), demandByCategory: makeDemand(36, 26, 16, 10, 7, 13), digitalConnectivity: 'high', underReported: false },
  { id: 'pune', name: 'Pune', stateId: 'mh', stateName: 'Maharashtra', lat: 18.5204, lng: 73.8567, population: 6410000, citizenRequests: 38500, infrastructureIndex: 70, investment: 560, resolvedRate: 82, scores: makeScores(64, 73, 88, 65, 74, 57), demandByCategory: makeDemand(34, 25, 17, 11, 8, 13), digitalConnectivity: 'high', underReported: false },
  { id: 'nagpur', name: 'Nagpur', stateId: 'mh', stateName: 'Maharashtra', lat: 21.1458, lng: 79.0882, population: 2400000, citizenRequests: 21200, infrastructureIndex: 56, investment: 280, resolvedRate: 70, scores: makeScores(49, 59, 80, 52, 63, 44), demandByCategory: makeDemand(37, 26, 16, 9, 6, 14), digitalConnectivity: 'medium', underReported: false },
  { id: 'nashik', name: 'Nashik', stateId: 'mh', stateName: 'Maharashtra', lat: 19.9975, lng: 73.7898, population: 1490000, citizenRequests: 14600, infrastructureIndex: 59, investment: 210, resolvedRate: 73, scores: makeScores(52, 62, 82, 55, 67, 47), demandByCategory: makeDemand(36, 25, 17, 10, 7, 13), digitalConnectivity: 'medium', underReported: false },

  { id: 'bengaluru-urban', name: 'Bengaluru Urban', stateId: 'ka', stateName: 'Karnataka', lat: 12.9716, lng: 77.5946, population: 8440000, citizenRequests: 52800, infrastructureIndex: 63, investment: 680, resolvedRate: 76, scores: makeScores(57, 66, 86, 59, 71, 50), demandByCategory: makeDemand(35, 27, 16, 10, 7, 13), digitalConnectivity: 'high', underReported: false },
  { id: 'mysuru', name: 'Mysuru', stateId: 'ka', stateName: 'Karnataka', lat: 12.2958, lng: 76.6394, population: 968000, citizenRequests: 11200, infrastructureIndex: 67, investment: 190, resolvedRate: 79, scores: makeSamples(61, 70, 87, 63, 72, 54), demandByCategory: makeDemand(34, 24, 18, 11, 8, 13), digitalConnectivity: 'high', underReported: false },
  { id: 'hubli-dharwad', name: 'Hubli-Dharwad', stateId: 'ka', stateName: 'Karnataka', lat: 15.3647, lng: 75.1240, population: 1140000, citizenRequests: 8900, infrastructureIndex: 54, investment: 160, resolvedRate: 68, scores: makeSamples(47, 57, 79, 50, 62, 42), demandByCategory: makeDemand(38, 26, 15, 9, 6, 14), digitalConnectivity: 'low', underReported: true },

  { id: 'chennai', name: 'Chennai', stateId: 'tn', stateName: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, population: 7150000, citizenRequests: 47300, infrastructureIndex: 66, investment: 620, resolvedRate: 79, scores: makeSamples(60, 69, 87, 62, 73, 53), demandByCategory: makeDemand(35, 25, 17, 10, 8, 13), digitalConnectivity: 'high', underReported: false },
  { id: 'coimbatore', name: 'Coimbatore', stateId: 'tn', stateName: 'Tamil Nadu', lat: 11.0168, lng: 76.9558, population: 1850000, citizenRequests: 16800, infrastructureIndex: 68, investment: 240, resolvedRate: 81, scores: makeSamples(62, 71, 88, 64, 74, 55), demandByCategory: makeDemand(34, 24, 18, 11, 8, 13), digitalConnectivity: 'high', underReported: false },
  { id: 'madurai', name: 'Madurai', stateId: 'tn', stateName: 'Tamil Nadu', lat: 9.9252, lng: 78.1198, population: 1470000, citizenRequests: 13400, infrastructureIndex: 57, investment: 180, resolvedRate: 72, scores: makeSamples(50, 60, 81, 53, 65, 45), demandByCategory: makeDemand(37, 25, 16, 10, 7, 14), digitalConnectivity: 'medium', underReported: false },

  { id: 'kolkata', name: 'Kolkata', stateId: 'wb', stateName: 'West Bengal', lat: 22.5726, lng: 88.3639, population: 4496000, citizenRequests: 42100, infrastructureIndex: 58, investment: 480, resolvedRate: 72, scores: makeSamples(51, 61, 80, 54, 66, 46), demandByCategory: makeDemand(37, 26, 16, 9, 6, 14), digitalConnectivity: 'medium', underReported: false },
  { id: 'howrah', name: 'Howrah', stateId: 'wb', stateName: 'West Bengal', lat: 22.5958, lng: 88.2636, population: 1080000, citizenRequests: 13900, infrastructureIndex: 50, investment: 170, resolvedRate: 65, scores: makeSamples(43, 53, 77, 46, 58, 39), demandByCategory: makeDemand(40, 25, 15, 9, 5, 15), digitalConnectivity: 'low', underReported: true },
  { id: 'darjeeling', name: 'Darjeeling', stateId: 'wb', stateName: 'West Bengal', lat: 27.0360, lng: 88.2627, population: 183000, citizenRequests: 2100, infrastructureIndex: 45, investment: 60, resolvedRate: 63, scores: makeSamples(38, 48, 71, 42, 54, 34), demandByCategory: makeDemand(36, 24, 17, 11, 8, 14), digitalConnectivity: 'low', underReported: true },

  { id: 'ahmedabad', name: 'Ahmedabad', stateId: 'gj', stateName: 'Gujarat', lat: 23.0225, lng: 72.5714, population: 5570000, citizenRequests: 34800, infrastructureIndex: 69, investment: 540, resolvedRate: 83, scores: makeSamples(63, 72, 89, 65, 75, 56), demandByCategory: makeDemand(34, 25, 17, 11, 8, 13), digitalConnectivity: 'high', underReported: false },
  { id: 'surat', name: 'Surat', stateId: 'gj', stateName: 'Gujarat', lat: 21.1702, lng: 72.8311, population: 4460000, citizenRequests: 28100, infrastructureIndex: 64, investment: 380, resolvedRate: 80, scores: makeSamples(58, 67, 86, 60, 70, 51), demandByCategory: makeDemand(35, 26, 16, 10, 7, 13), digitalConnectivity: 'high', underReported: false },
  { id: 'vadodara', name: 'Vadodara', stateId: 'gj', stateName: 'Gujarat', lat: 22.3072, lng: 73.1812, population: 1660000, citizenRequests: 16700, infrastructureIndex: 66, investment: 260, resolvedRate: 78, scores: makeSamples(60, 69, 87, 62, 72, 53), demandByCategory: makeDemand(35, 24, 18, 11, 8, 13), digitalConnectivity: 'high', underReported: false },

  { id: 'jaipur', name: 'Jaipur', stateId: 'rj', stateName: 'Rajasthan', lat: 26.9124, lng: 75.7873, population: 3070000, citizenRequests: 26500, infrastructureIndex: 60, investment: 350, resolvedRate: 74, scores: makeSamples(54, 63, 84, 56, 68, 48), demandByCategory: makeDemand(36, 26, 16, 10, 7, 13), digitalConnectivity: 'medium', underReported: false },
  { id: 'jodhpur', name: 'Jodhpur', stateId: 'rj', stateName: 'Rajasthan', lat: 26.2389, lng: 73.0243, population: 1140000, citizenRequests: 12800, infrastructureIndex: 53, investment: 170, resolvedRate: 67, scores: makeSamples(46, 56, 78, 49, 61, 41), demandByCategory: makeDemand(38, 26, 15, 9, 6, 14), digitalConnectivity: 'low', underReported: true },
  { id: 'udaipur', name: 'Udaipur', stateId: 'rj', stateName: 'Rajasthan', lat: 24.5854, lng: 73.7125, population: 471000, citizenRequests: 6800, infrastructureIndex: 56, investment: 140, resolvedRate: 71, scores: makeSamples(49, 59, 80, 52, 64, 44), demandByCategory: makeDemand(37, 25, 17, 10, 7, 13), digitalConnectivity: 'medium', underReported: false },
];

function makeSamples(water: number, roads: number, electricity: number, healthcare: number, education: number, waste: number): Record<IssueCategory, number> {
  return { water, roads, electricity, healthcare, education, waste };
}

export const CLUSTERS: Cluster[] = [
  { id: 'C-82', category: 'water', districtId: 'east-delhi', reportCount: 1284, similarity: 87, radiusKm: 2.8, location: 'Sector 17, East Delhi', severity: 'high' },
  { id: 'C-91', category: 'water', districtId: 'kanpur', reportCount: 2104, similarity: 91, radiusKm: 3.4, location: 'Govind Nagar, Kanpur', severity: 'critical' },
  { id: 'C-103', category: 'roads', districtId: 'north-delhi', reportCount: 892, similarity: 84, radiusKm: 4.1, location: 'Civil Lines, North Delhi', severity: 'medium' },
  { id: 'C-117', category: 'waste', districtId: 'howrah', reportCount: 1456, similarity: 89, radiusKm: 2.3, location: 'Bally, Howrah', severity: 'high' },
  { id: 'C-124', category: 'electricity', districtId: 'kanpur', reportCount: 768, similarity: 82, radiusKm: 5.2, location: 'Swaroop Nagar, Kanpur', severity: 'medium' },
  { id: 'C-131', category: 'water', districtId: 'jodhpur', reportCount: 1820, similarity: 88, radiusKm: 3.8, location: 'Paota, Jodhpur', severity: 'critical' },
  { id: 'C-145', category: 'healthcare', districtId: 'hubli-dharwad', reportCount: 534, similarity: 79, radiusKm: 6.1, location: 'Vidyanagar, Hubli', severity: 'medium' },
  { id: 'C-158', category: 'roads', districtId: 'faridabad', reportCount: 1120, similarity: 86, radiusKm: 3.5, location: 'NIT, Faridabad', severity: 'high' },
];

const requestSummaries = [
  'Multiple citizens in this area have reported irregular water supply during the past 14 days.',
  'Frequent power outages lasting 4-6 hours have been reported across this neighborhood.',
  'Roads are severely damaged with potholes causing traffic congestion and safety concerns.',
  'Garbage collection has been irregular, leading to waste accumulation in public areas.',
  'Primary health center lacks adequate staff and medical supplies for the population.',
  'School buildings require urgent repair and additional classrooms for enrollment.',
];

const requestLocations = [
  'Sector 17', 'Civil Lines', 'Govind Nagar', 'Bally', 'Paota', 'Vidyanagar',
  'NIT Sector 12', 'Swaroop Nagar', 'Rajouri Garden', 'Karol Bagh', 'Andheri East',
  'Koramangala', 'T Nagar', 'Salt Lake', 'Maninagar', 'Vaishali Nagar',
];

const requestLanguages: LanguageCode[] = ['hi', 'en', 'pa', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'ur'];

function generateRequests(): CitizenRequest[] {
  const requests: CitizenRequest[] = [];
  const categories: IssueCategory[] = ['water', 'roads', 'electricity', 'waste', 'healthcare', 'education'];
  const severities: Severity[] = ['low', 'medium', 'high', 'critical'];

  for (let i = 0; i < 120; i++) {
    const district = DISTRICTS[i % DISTRICTS.length];
    const category = categories[i % categories.length];
    const severity = severities[i % severities.length];
    const daysAgo = Math.floor(Math.random() * 90);
    const date = new Date(2026, 8, 28 - daysAgo);
    requests.push({
      id: `CP-${10000 + i}`,
      districtId: district.id,
      category,
      severity,
      language: requestLanguages[i % requestLanguages.length],
      location: requestLocations[i % requestLocations.length] + ', ' + district.name,
      status: i % 5 === 0 ? 'pending' : i % 3 === 0 ? 'resolved' : 'verified',
      summary: requestSummaries[i % requestSummaries.length],
      createdAt: date.toISOString().split('T')[0],
      affectedPopulation: Math.floor(5000 + Math.random() * 30000),
      relatedRequests: Math.floor(50 + Math.random() * 2000),
      clusterId: i % 8 === 0 ? CLUSTERS[i % CLUSTERS.length].id : undefined,
    });
  }
  return requests;
}

export const CITIZEN_REQUESTS: CitizenRequest[] = generateRequests();

export const PROJECTS: Project[] = [
  { id: 'P-001', name: 'Water Pipeline Rehabilitation', districtId: 'east-delhi', districtName: 'East Delhi', category: 'water', budget: 120, status: 'in-progress', citizenDemand: 18400, infraScoreBefore: 38, infraScoreAfter: 65, startDate: '2026-01-15', expectedCompletion: '2026-12-30', affectedPopulation: 485000, milestones: [{ label: 'Survey & Design', date: '2026-02-01', done: true }, { label: 'Procurement', date: '2026-03-15', done: true }, { label: 'Pipeline Laying', date: '2026-07-30', done: false }, { label: 'Testing & Commissioning', date: '2026-11-30', done: false }, { label: 'Handover', date: '2026-12-30', done: false }], impact: { complaintsBefore: 18400, complaintsAfter: 9800, satisfactionBefore: 54, satisfactionAfter: 73, resolutionDaysBefore: 17, resolutionDaysAfter: 10 } },
  { id: 'P-002', name: 'Road Modernization', districtId: 'faridabad', districtName: 'Faridabad', category: 'roads', budget: 85, status: 'approved', citizenDemand: 11200, infraScoreBefore: 54, infraScoreAfter: 72, startDate: '2026-04-01', expectedCompletion: '2027-03-30', affectedPopulation: 1390000, milestones: [{ label: 'Survey & Design', date: '2026-04-15', done: true }, { label: 'Tender Award', date: '2026-05-30', done: false }, { label: 'Construction', date: '2026-10-01', done: false }, { label: 'Handover', date: '2027-03-30', done: false }], impact: { complaintsBefore: 11200, complaintsAfter: 5600, satisfactionBefore: 48, satisfactionAfter: 69, resolutionDaysBefore: 21, resolutionDaysAfter: 12 } },
  { id: 'P-003', name: 'Smart Waste Network', districtId: 'howrah', districtName: 'Howrah', category: 'waste', budget: 42, status: 'planning', citizenDemand: 14560, infraScoreBefore: 39, infraScoreAfter: 58, startDate: '2026-07-01', expectedCompletion: '2027-06-30', affectedPopulation: 1080000, milestones: [{ label: 'Feasibility Study', date: '2026-07-15', done: false }, { label: 'Design Approval', date: '2026-09-01', done: false }, { label: 'Procurement', date: '2026-11-30', done: false }, { label: 'Deployment', date: '2027-03-30', done: false }], impact: { complaintsBefore: 14560, complaintsAfter: 7200, satisfactionBefore: 42, satisfactionAfter: 64, resolutionDaysBefore: 19, resolutionDaysAfter: 11 } },
  { id: 'P-004', name: 'Primary Healthcare Expansion', districtId: 'hubli-dharwad', districtName: 'Hubli-Dharwad', category: 'healthcare', budget: 60, status: 'in-progress', citizenDemand: 5340, infraScoreBefore: 50, infraScoreAfter: 68, startDate: '2026-02-01', expectedCompletion: '2026-10-30', affectedPopulation: 1140000, milestones: [{ label: 'Site Selection', date: '2026-02-15', done: true }, { label: 'Construction', date: '2026-06-01', done: true }, { label: 'Equipment Installation', date: '2026-08-30', done: false }, { label: 'Staffing & Opening', date: '2026-10-30', done: false }], impact: { complaintsBefore: 5340, complaintsAfter: 2800, satisfactionBefore: 51, satisfactionAfter: 70, resolutionDaysBefore: 15, resolutionDaysAfter: 9 } },
  { id: 'P-005', name: 'Power Grid Upgrade', districtId: 'kanpur', districtName: 'Kanpur', category: 'electricity', budget: 95, status: 'delayed', citizenDemand: 7680, infraScoreBefore: 72, infraScoreAfter: 88, startDate: '2025-11-01', expectedCompletion: '2026-09-30', affectedPopulation: 3100000, milestones: [{ label: 'Survey', date: '2025-11-15', done: true }, { label: 'Equipment Procurement', date: '2026-01-30', done: true }, { label: 'Grid Installation', date: '2026-05-30', done: false }, { label: 'Testing', date: '2026-08-30', done: false }, { label: 'Commissioning', date: '2026-09-30', done: false }], impact: { complaintsBefore: 7680, complaintsAfter: 3400, satisfactionBefore: 45, satisfactionAfter: 68, resolutionDaysBefore: 23, resolutionDaysAfter: 13 } },
  { id: 'P-006', name: 'School Infrastructure Renewal', districtId: 'darjeeling', districtName: 'Darjeeling', category: 'education', budget: 35, status: 'planning', citizenDemand: 2100, infraScoreBefore: 54, infraScoreAfter: 72, startDate: '2026-06-01', expectedCompletion: '2027-05-30', affectedPopulation: 183000, milestones: [{ label: 'Needs Assessment', date: '2026-06-15', done: false }, { label: 'Design', date: '2026-08-01', done: false }, { label: 'Construction', date: '2026-12-01', done: false }, { label: 'Handover', date: '2027-05-30', done: false }], impact: { complaintsBefore: 2100, complaintsAfter: 900, satisfactionBefore: 49, satisfactionAfter: 71, resolutionDaysBefore: 18, resolutionDaysAfter: 10 } },
  { id: 'P-007', name: 'Water Treatment Plant', districtId: 'jodhpur', districtName: 'Jodhpur', category: 'water', budget: 110, status: 'approved', citizenDemand: 18200, infraScoreBefore: 46, infraScoreAfter: 70, startDate: '2026-05-01', expectedCompletion: '2027-08-30', affectedPopulation: 1140000, milestones: [{ label: 'Environmental Clearance', date: '2026-05-15', done: true }, { label: 'Tender', date: '2026-07-01', done: false }, { label: 'Construction', date: '2027-01-01', done: false }, { label: 'Commissioning', date: '2027-08-30', done: false }], impact: { complaintsBefore: 18200, complaintsAfter: 8400, satisfactionBefore: 43, satisfactionAfter: 67, resolutionDaysBefore: 20, resolutionDaysAfter: 11 } },
  { id: 'P-008', name: 'Drainage System Overhaul', districtId: 'north-delhi', districtName: 'North Delhi', category: 'waste', budget: 78, status: 'completed', citizenDemand: 8920, infraScoreBefore: 38, infraScoreAfter: 62, startDate: '2025-04-01', expectedCompletion: '2026-03-30', affectedPopulation: 620000, milestones: [{ label: 'Survey', date: '2025-04-15', done: true }, { label: 'Construction', date: '2025-08-01', done: true }, { label: 'Testing', date: '2026-01-15', done: true }, { label: 'Handover', date: '2026-03-30', done: true }], impact: { complaintsBefore: 8920, complaintsAfter: 3100, satisfactionBefore: 46, satisfactionAfter: 72, resolutionDaysBefore: 22, resolutionDaysAfter: 10 } },
  { id: 'P-009', name: 'Urban Road Widening', districtId: 'bengaluru-urban', districtName: 'Bengaluru Urban', category: 'roads', budget: 150, status: 'in-progress', citizenDemand: 24600, infraScoreBefore: 66, infraScoreAfter: 80, startDate: '2026-01-01', expectedCompletion: '2026-12-15', affectedPopulation: 8440000, milestones: [{ label: 'Design', date: '2026-01-15', done: true }, { label: 'Land Acquisition', date: '2026-03-30', done: true }, { label: 'Construction', date: '2026-06-01', done: false }, { label: 'Handover', date: '2026-12-15', done: false }], impact: { complaintsBefore: 24600, complaintsAfter: 11200, satisfactionBefore: 52, satisfactionAfter: 74, resolutionDaysBefore: 16, resolutionDaysAfter: 9 } },
  { id: 'P-010', name: 'Solar Microgrid Installation', districtId: 'agra', districtName: 'Agra', category: 'electricity', budget: 55, status: 'approved', citizenDemand: 4200, infraScoreBefore: 76, infraScoreAfter: 89, startDate: '2026-06-15', expectedCompletion: '2027-02-28', affectedPopulation: 2100000, milestones: [{ label: 'Site Survey', date: '2026-06-30', done: true }, { label: 'Procurement', date: '2026-08-15', done: false }, { label: 'Installation', date: '2026-11-30', done: false }, { label: 'Commissioning', date: '2027-02-28', done: false }], impact: { complaintsBefore: 4200, complaintsAfter: 1600, satisfactionBefore: 55, satisfactionAfter: 76, resolutionDaysBefore: 14, resolutionDaysAfter: 8 } },
];

export const NOTIFICATIONS: Notification[] = [
  { id: 'N1', type: 'critical', title: 'Critical hotspot detected', description: 'Kanpur water supply cluster reached 2,104 reports', page: 'demand-map', time: '12 min ago', read: false },
  { id: 'N2', type: 'warning', title: 'Infrastructure gap increased', description: 'East Delhi water index dropped 3 points', page: 'infrastructure', time: '1 hour ago', read: false },
  { id: 'N3', type: 'info', title: 'New project approved', description: 'Water Treatment Plant in Jodhpur approved', page: 'projects', time: '3 hours ago', read: false },
  { id: 'N4', type: 'success', title: 'Project impact updated', description: 'Drainage System Overhaul completed in North Delhi', page: 'impact', time: '5 hours ago', read: true },
  { id: 'N5', type: 'warning', title: 'Potential under-reported region', description: 'Darjeeling shows low reports with poor infrastructure', page: 'ai-insights', time: '8 hours ago', read: true },
  { id: 'N6', type: 'critical', title: 'Critical hotspot detected', description: 'Jodhpur water supply cluster reached 1,820 reports', page: 'demand-map', time: '1 day ago', read: true },
];

export const AI_INSIGHTS: AIInsight[] = [
  {
    id: 'AI-1',
    question: 'Which districts have the largest infrastructure gaps?',
    answer: 'Three major demand clusters have emerged around water supply, waste management and road infrastructure. Kanpur, East Delhi, and Howrah show the most significant gaps, with infrastructure indices 20+ points below the national average. These clusters combine high citizen demand with below-average infrastructure scores, suggesting urgent intervention is needed.',
    confidence: 94,
    districts: ['Kanpur', 'East Delhi', 'Howrah', 'Jodhpur'],
    metrics: [
      { label: 'Avg Infrastructure Index', value: '42/100' },
      { label: 'Total Citizen Requests', value: '71,920' },
      { label: 'Population Affected', value: '8.1M' },
    ],
    chartData: [
      { label: 'Kanpur', value: 42 }, { label: 'East Delhi', value: 47 },
      { label: 'Howrah', value: 50 }, { label: 'Jodhpur', value: 53 },
      { label: 'Darjeeling', value: 45 }, { label: 'Hubli', value: 54 },
    ],
    sources: ['Citizen Request Database', 'Infrastructure Survey 2026', 'Demographic Census'],
  },
  {
    id: 'AI-2',
    question: 'Where is citizen demand increasing fastest?',
    answer: 'Citizen demand is increasing fastest in East Delhi (+32% this quarter), Kanpur (+28%), and Jodhpur (+24%). The surge is primarily driven by water supply complaints, which account for 40-46% of all requests in these districts. This trend correlates with seasonal water scarcity patterns and aging pipeline infrastructure.',
    confidence: 91,
    districts: ['East Delhi', 'Kanpur', 'Jodhpur'],
    metrics: [
      { label: 'East Delhi Growth', value: '+32%' },
      { label: 'Kanpur Growth', value: '+28%' },
      { label: 'Jodhpur Growth', value: '+24%' },
    ],
    chartData: [
      { label: 'East Delhi', value: 32 }, { label: 'Kanpur', value: 28 },
      { label: 'Jodhpur', value: 24 }, { label: 'Faridabad', value: 18 },
      { label: 'Howrah', value: 16 }, { label: 'Nagpur', value: 14 },
    ],
    sources: ['Citizen Request Trends', 'Seasonal Pattern Analysis'],
  },
  {
    id: 'AI-3',
    question: 'Which areas are under-reported?',
    answer: 'Darjeeling, Hubli-Dharwad, and Howrah show signs of potential under-reporting. Despite having populations over 180,000 and infrastructure scores below 55, these districts have unusually low citizen complaint volumes. Low digital connectivity scores (rated "low") suggest that citizens may lack the digital access needed to report issues, meaning actual infrastructure demand could be significantly higher than reported.',
    confidence: 87,
    districts: ['Darjeeling', 'Hubli-Dharwad', 'Howrah', 'Jodhpur'],
    metrics: [
      { label: 'Darjeeling Reports', value: '2,100' },
      { label: 'Hubli Reports', value: '8,900' },
      { label: 'Avg Connectivity', value: 'Low' },
    ],
    chartData: [
      { label: 'Darjeeling', value: 2100 }, { label: 'Hubli', value: 8900 },
      { label: 'Howrah', value: 13900 }, { label: 'Jodhpur', value: 12800 },
    ],
    sources: ['Digital Connectivity Index', 'Population Census', 'Comparative Demand Analysis'],
  },
];

export const BACKGROUND_PRESETS = [
  { id: 'deep-space', name: 'Deep Space', colors: ['#07111F', '#0D1B2A'], type: 'gradient' as const },
  { id: 'government-blue', name: 'Government Blue', colors: ['#0A1628', '#13294A'], type: 'gradient' as const },
  { id: 'midnight-grid', name: 'Midnight Grid', colors: ['#0B0F1A', '#111827'], type: 'gradient' as const },
  { id: 'aurora', name: 'Aurora', colors: ['#0A0F1C', '#0D1F2D'], type: 'gradient' as const },
  { id: 'clean-light', name: 'Clean Light', colors: ['#F8FAFC', '#F1F5F9'], type: 'gradient' as const },
  { id: 'india-map', name: 'India Map', colors: ['#07111F', '#0D1B2A'], type: 'image' as const },
  { id: 'digital-earth', name: 'Digital Earth', colors: ['#050810', '#0A1220'], type: 'gradient' as const },
  { id: 'minimal-white', name: 'Minimal White', colors: ['#FFFFFF', '#F8FAFC'], type: 'gradient' as const },
  { id: 'dark-intelligence', name: 'Dark Intelligence', colors: ['#080808', '#0F0F0F'], type: 'gradient' as const },
  { id: 'custom-gradient', name: 'Custom Gradient', colors: ['#07111F', '#0D1B2A'], type: 'gradient' as const },
];

export const ACCENT_COLORS = [
  { id: 'blue', name: 'Blue', value: '66 133 244' },
  { id: 'cyan', name: 'Cyan', value: '0 194 255' },
  { id: 'green', name: 'Green', value: '52 168 83' },
  { id: 'amber', name: 'Amber', value: '251 188 4' },
  { id: 'red', name: 'Red', value: '234 67 53' },
  { id: 'teal', name: 'Teal', value: '20 184 166' },
];

export const CATEGORY_LABELS: Record<IssueCategory, string> = categoryNames;

export const SEVERITY_LABELS: Record<Severity, string> = {
  low: 'Low', medium: 'Medium', high: 'High', critical: 'Critical',
};

export const SEVERITY_COLORS: Record<Severity, string> = {
  low: '52 168 83', medium: '251 188 4', high: '249 115 22', critical: '234 67 53',
};

export const PROJECT_STATUS_LABELS = {
  planning: 'Planning', approved: 'Approved', 'in-progress': 'In Progress',
  completed: 'Completed', delayed: 'Delayed',
};

export const PROJECT_STATUS_COLORS: Record<string, string> = {
  planning: '100 116 139', approved: '56 189 248', 'in-progress': '66 133 244',
  completed: '52 168 83', delayed: '234 67 53',
};

export function getDistrictById(id: string): District | undefined {
  return DISTRICTS.find((d) => d.id === id);
}

export function getProjectById(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}

export function getRequestsByDistrict(districtId: string): CitizenRequest[] {
  return CITIZEN_REQUESTS.filter((r) => r.districtId === districtId);
}

export function getProjectsByDistrict(districtId: string): Project[] {
  return PROJECTS.filter((p) => p.districtId === districtId);
}

export function getTotalCitizenRequests(): number {
  return DISTRICTS.reduce((sum, d) => sum + d.citizenRequests, 0);
}

export function getTotalPopulation(): number {
  return DISTRICTS.reduce((sum, d) => sum + d.population, 0);
}

export function getAvgInfrastructureIndex(): number {
  return Math.round(DISTRICTS.reduce((sum, d) => sum + d.infrastructureIndex, 0) / DISTRICTS.length);
}

export function getTotalInvestment(): number {
  return DISTRICTS.reduce((sum, d) => sum + d.investment, 0);
}

export function getAvgResolvedRate(): number {
  return Math.round(DISTRICTS.reduce((sum, d) => sum + d.resolvedRate, 0) / DISTRICTS.length * 10) / 10;
}

export function getUnderReportedDistricts(): District[] {
  return DISTRICTS.filter((d) => d.underReported);
}

export function getCriticalHotspots(): number {
  return CLUSTERS.filter((c) => c.severity === 'critical').length;
}

export function getActiveHotspots(): number {
  return CLUSTERS.length;
}
