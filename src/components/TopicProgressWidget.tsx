'use client';

import { useState } from 'react';

interface CategoryStat {
  category: string;
  sheet: string;
  total: number;
  solved: number;
}

interface TopicProgressWidgetProps {
  categoryStats: CategoryStat[];
  enabledSheets: string[];
}

export default function TopicProgressWidget({
  categoryStats,
  enabledSheets,
}: TopicProgressWidgetProps) {
  const [selectedSheet, setSelectedSheet] = useState<string>('all');

  // Filter stats based on sheet selection and enabled sheets
  const filteredStats = categoryStats.filter(s => {
    if (selectedSheet === 'all') {
      return enabledSheets.includes(s.sheet);
    }
    return s.sheet === selectedSheet;
  });

  // Aggregate statistics per category (handles same category across different sheets)
  const aggregatedStats: { [key: string]: { total: number; solved: number; sheet: string } } = {};
  filteredStats.forEach(s => {
    if (!aggregatedStats[s.category]) {
      aggregatedStats[s.category] = { total: 0, solved: 0, sheet: s.sheet };
    }
    aggregatedStats[s.category].total += s.total;
    aggregatedStats[s.category].solved += s.solved;
  });

  const categoryKeys = Object.keys(aggregatedStats);

  return (
    <div className="card">
      {/* HEADER WITH SHEET FILTER DROPDOWN */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '2px solid #000' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="card-title" style={{ margin: 0 }}>Progress by Topic</h3>
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
            {categoryKeys.length} TOPICS
          </span>
        </div>
        
        {/* DROPDOWN SELECTOR */}
        <select
          value={selectedSheet}
          onChange={(e) => setSelectedSheet(e.target.value)}
          className="input"
          style={{ height: '36px', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.3rem', fontFamily: 'monospace' }}
        >
          <option value="all">ALL ENABLED SHEETS</option>
          {enabledSheets.includes('striver_sde') && <option value="striver_sde">STRIVER SDE SHEET (191)</option>}
          {enabledSheets.includes('striver_a2z') && <option value="striver_a2z">STRIVER A2Z SHEET (474)</option>}
          {enabledSheets.includes('tle_31') && <option value="tle_31">TLE ELIMINATORS CP (372)</option>}
          {enabledSheets.includes('neetcode_all') && <option value="neetcode_all">NEETCODE ALL PRACTICE (973)</option>}
          {enabledSheets.includes('neetcode_250') && <option value="neetcode_250">NEETCODE 250</option>}
          {enabledSheets.includes('neetcode_150') && <option value="neetcode_150">NEETCODE 150</option>}
          {enabledSheets.includes('blind_75') && <option value="blind_75">BLIND 75</option>}
        </select>
      </div>

      {/* TOPICS SCROLLABLE CONTAINER */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '480px', overflowY: 'auto', paddingRight: '0.3rem' }}>
        {categoryKeys.map(cat => {
          const stats = aggregatedStats[cat];
          const pct = Math.round((stats.solved / stats.total) * 100);
          return (
            <div key={cat} style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
              <div className="flex-between mb-1" style={{ fontWeight: 'bold' }}>
                <span style={{ textTransform: 'uppercase', wordBreak: 'break-word', paddingRight: '0.5rem' }}>{cat}</span>
                <span style={{ whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>{stats.solved}/{stats.total} ({pct}%)</span>
              </div>
              <div className="progress-bar-container" style={{ height: '10px' }}>
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}

        {categoryKeys.length === 0 && (
          <div className="text-center" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', padding: '1rem 0' }}>
            No topics available for this selection.
          </div>
        )}
      </div>
    </div>
  );
}
