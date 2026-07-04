'use client';

import { useState } from 'react';

interface CategoryProblem {
  id: string;
  category: string;
  sheet: string;
}

interface UserProblem {
  problem_id: string;
}

interface TopicProgressWidgetProps {
  categoryProblems: CategoryProblem[];
  activeProblems: UserProblem[];
  enabledSheets: string[];
}

export default function TopicProgressWidget({
  categoryProblems,
  activeProblems,
  enabledSheets,
}: TopicProgressWidgetProps) {
  const [selectedSheet, setSelectedSheet] = useState<string>('all');

  const solvedSet = new Set(activeProblems.map(up => up.problem_id));

  // Filter problems based on sheet selection and enabled sheets
  const filteredProblems = categoryProblems.filter(p => {
    // Only consider enabled sheets if 'all' is selected
    if (selectedSheet === 'all') {
      return enabledSheets.includes(p.sheet);
    }
    return p.sheet === selectedSheet;
  });

  // Calculate statistics per category
  const categoryStats: { [key: string]: { total: number; solved: number; sheet: string } } = {};
  filteredProblems.forEach(p => {
    if (!categoryStats[p.category]) {
      categoryStats[p.category] = { total: 0, solved: 0, sheet: p.sheet };
    }
    categoryStats[p.category].total += 1;
    if (solvedSet.has(p.id)) {
      categoryStats[p.category].solved += 1;
    }
  });

  const categoryKeys = Object.keys(categoryStats);

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
        </select>
      </div>

      {/* TOPICS SCROLLABLE CONTAINER */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '480px', overflowY: 'auto', paddingRight: '0.3rem' }}>
        {categoryKeys.map(cat => {
          const stats = categoryStats[cat];
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
