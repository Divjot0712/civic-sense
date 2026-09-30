'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/lib/app-context';
import { PageHeader, SeverityBadge, StatusBadge, formatINR } from '@/components/shared';
import { DISTRICTS, PROJECTS, CITIZEN_REQUESTS, CATEGORY_LABELS } from '@/lib/mock-data';
import type { IssueCategory } from '@/lib/types';
import { Search, Download, ArrowUpDown, Database } from 'lucide-react';

type TabId = 'requests' | 'infrastructure' | 'demographics' | 'investment' | 'projects' | 'impact';

const tabs: { id: TabId; label: string }[] = [
  { id: 'requests', label: 'Citizen Requests' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'demographics', label: 'Demographics' },
  { id: 'investment', label: 'Investment' },
  { id: 'projects', label: 'Projects' },
  { id: 'impact', label: 'Impact' },
];

type SortDir = 'asc' | 'desc';

export function DataExplorerPage() {
  const { t } = useApp();
  const [tab, setTab] = useState<TabId>('requests');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const exportCSV = () => {
    const headers = currentColumns.map((c) => c.label).join(',');
    const rows = sortedData.map((row) => currentColumns.map((c) => `"${String((row as Record<string, unknown>)[c.key] ?? '')}"`).join(','));
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `civic-sense-${tab}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentColumns: { key: string; label: string }[] = useMemo(() => {
    switch (tab) {
      case 'requests': return [
        { key: 'id', label: 'ID' }, { key: 'districtId', label: 'District' }, { key: 'category', label: 'Category' },
        { key: 'severity', label: 'Severity' }, { key: 'language', label: 'Language' }, { key: 'status', label: 'Status' },
        { key: 'createdAt', label: 'Date' }, { key: 'affectedPopulation', label: 'Affected Pop.' },
      ];
      case 'infrastructure': return [
        { key: 'name', label: 'District' }, { key: 'stateName', label: 'State' }, { key: 'infrastructureIndex', label: 'Index' },
        { key: 'resolvedRate', label: 'Resolved %' },
      ];
      case 'demographics': return [
        { key: 'name', label: 'District' }, { key: 'stateName', label: 'State' }, { key: 'population', label: 'Population' },
        { key: 'citizenRequests', label: 'Requests' }, { key: 'digitalConnectivity', label: 'Connectivity' },
      ];
      case 'investment': return [
        { key: 'name', label: 'District' }, { key: 'stateName', label: 'State' }, { key: 'investment', label: 'Investment (Cr)' },
        { key: 'citizenRequests', label: 'Demand' }, { key: 'infrastructureIndex', label: 'Infra Index' },
      ];
      case 'projects': return [
        { key: 'name', label: 'Project' }, { key: 'districtName', label: 'District' }, { key: 'category', label: 'Category' },
        { key: 'budget', label: 'Budget (Cr)' }, { key: 'status', label: 'Status' }, { key: 'citizenDemand', label: 'Demand' },
        { key: 'startDate', label: 'Start' }, { key: 'expectedCompletion', label: 'Completion' },
      ];
      case 'impact': return [
        { key: 'name', label: 'Project' }, { key: 'districtName', label: 'District' }, { key: 'budget', label: 'Budget (Cr)' },
        { key: 'impact.complaintsBefore', label: 'Before' }, { key: 'impact.complaintsAfter', label: 'After' },
        { key: 'impact.satisfactionBefore', label: 'Sat. Before' }, { key: 'impact.satisfactionAfter', label: 'Sat. After' },
      ];
    }
  }, [tab]);

  const rawData = useMemo(() => {
    switch (tab) {
      case 'requests': return CITIZEN_REQUESTS.slice(0, 50);
      case 'infrastructure': return DISTRICTS;
      case 'demographics': return DISTRICTS;
      case 'investment': return DISTRICTS;
      case 'projects': return PROJECTS;
      case 'impact': return PROJECTS;
    }
  }, [tab]);

  const filteredData = useMemo(() => {
    if (!search) return rawData;
    const q = search.toLowerCase();
    return (rawData as unknown as Record<string, unknown>[]).filter((row) =>
      Object.values(row).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [rawData, search]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    const getVal = (row: Record<string, unknown>) => {
      if (sortKey.includes('.')) {
        const [a, b] = sortKey.split('.');
        return (row[a] as Record<string, unknown>)?.[b];
      }
      return row[sortKey];
    };
    return [...filteredData].sort((a, b) => {
      const av = getVal(a as Record<string, unknown>);
      const bv = getVal(b as Record<string, unknown>);
      if (typeof av === 'number' && typeof bv === 'number') return sortDir === 'asc' ? av - bv : bv - av;
      return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
  }, [filteredData, sortKey, sortDir]);

  const renderCell = (row: Record<string, unknown>, key: string) => {
    const val = key.includes('.') ? (row[key.split('.')[0]] as Record<string, unknown>)?.[key.split('.')[1]] : row[key];
    if (key === 'severity') return <SeverityBadge severity={String(val)} />;
    if (key === 'status') return <StatusBadge status={String(val)} />;
    if (key === 'category') return <span className="text-t-secondary">{CATEGORY_LABELS[val as IssueCategory] || String(val)}</span>;
    if (key === 'districtId') return <span className="text-t-secondary">{DISTRICTS.find((d) => d.id === val)?.name || String(val)}</span>;
    if (typeof val === 'number' && val > 1000) return <span className="text-t-secondary">{val.toLocaleString()}</span>;
    if (key === 'investment' || key === 'budget') return <span className="text-t-primary font-medium">{formatINR(Number(val))}</span>;
    return <span className="text-t-secondary">{String(val ?? '')}</span>;
  };

  return (
    <div className="space-y-6">
      <PageHeader title={t('dataExplorer')} subtitle="Browse, filter, sort, and export all infrastructure and citizen data." />

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin">
        {tabs.map((tabItem) => (
          <button
            key={tabItem.id}
            onClick={() => { setTab(tabItem.id); setSortKey(''); setSearch(''); }}
            className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              tab === tabItem.id ? 'bg-accent-primary/20 accent-primary' : 'text-t-secondary hover:text-t-primary hover:bg-surface'
            }`}
          >
            {tabItem.label}
          </button>
        ))}
      </div>

      {/* Search + Export */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 flex-1">
          <Search className="w-4 h-4 text-t-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" className="flex-1 bg-surface border border-c rounded-lg px-3 py-2 text-sm text-t-primary placeholder:text-t-muted outline-none focus:border-accent-primary/40" />
        </div>
        <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface border border-c text-xs text-t-secondary hover:text-t-primary hover:border-accent-primary/30 transition-colors">
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-surface border border-c overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-c bg-base/50">
                {currentColumns.map((col) => (
                  <th key={col.key} onClick={() => handleSort(col.key)} className="text-left py-3 px-3 text-t-muted font-medium cursor-pointer hover:text-t-primary transition-colors">
                    <span className="flex items-center gap-1">
                      {col.label}
                      {sortKey === col.key && <ArrowUpDown className="w-3 h-3" />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row, i) => (
                <tr key={i} className="border-b border-c/50 hover:bg-base/50 transition-colors">
                  {currentColumns.map((col) => (
                    <td key={col.key} className="py-2.5 px-3">{renderCell(row as Record<string, unknown>, col.key)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sortedData.length === 0 && (
          <div className="py-8 text-center">
            <Database className="w-6 h-6 text-t-muted mx-auto mb-2" />
            <p className="text-sm text-t-muted">No results found</p>
          </div>
        )}
      </div>

      <p className="text-xs text-t-muted">{sortedData.length} records · Click column headers to sort</p>
    </div>
  );
}
