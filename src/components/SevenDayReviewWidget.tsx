'use client';

import React, { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import PastReviewHistoryModal from './PastReviewHistoryModal';

interface SevenDayReviewWidgetProps {
  past7DaysReviews: {
    label: string;
    newCount: number;
    oldCount: number;
    totalCount: number;
  }[];
  maxPastReviewCount: number;
  allHistory: any[];
  firstReviewMap: Map<string, string>;
}

export default function SevenDayReviewWidget({
  past7DaysReviews,
  maxPastReviewCount,
  allHistory,
  firstReviewMap
}: SevenDayReviewWidgetProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="card mt-4">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
          <h3 className="card-title" style={{ margin: 0 }}>7-Day Review History</h3>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn btn-outline" 
            style={{ padding: '0.25rem', border: 'none', boxShadow: 'none' }}
            title="Open Full History"
          >
            <Maximize2 size={18} />
          </button>
        </div>
        <p className="mb-2" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
          <span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: 'var(--text-primary)', marginRight: '4px' }}></span> New Problems
          <span style={{ display: 'inline-block', width: '10px', height: '10px', marginLeft: '12px', marginRight: '4px', border: '1px solid var(--border-color)' }} className="bg-hatched"></span> Old Problems
        </p>
        <div className="bar-chart mt-1">
          {past7DaysReviews.map((f, i) => {
            const newPct = (f.newCount / maxPastReviewCount) * 100;
            const oldPct = (f.oldCount / maxPastReviewCount) * 100;
            const showGap = f.totalCount === 0;

            return (
              <div key={i} className="bar-container">
                {!showGap && (
                  <div style={{ fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '2px' }}>
                    {f.totalCount}
                  </div>
                )}
                
                {!showGap ? (
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyItems: 'flex-end', justifyContent: 'flex-end', height: '100%' }}>
                    {f.newCount > 0 && (
                      <div 
                        className="bg-solid-black" 
                        style={{ 
                          height: `${Math.max(newPct, 4)}%`,
                          border: '1px solid var(--border-color)',
                          borderBottom: f.oldCount > 0 ? 'none' : '1px solid var(--border-color)',
                          width: '100%'
                        }}
                        title={`${f.newCount} New Problems`}
                      />
                    )}
                    {f.oldCount > 0 && (
                      <div 
                        className="bg-hatched" 
                        style={{ 
                          height: `${Math.max(oldPct, 4)}%`,
                          border: '1px solid var(--border-color)',
                          width: '100%'
                        }}
                        title={`${f.oldCount} Old Problems (Re-reviews)`}
                      />
                    )}
                  </div>
                ) : (
                  <div style={{ width: '100%', height: '100%', borderBottom: '1px solid transparent' }} />
                )}

                <div className="bar-label">{f.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {isModalOpen && (
        <PastReviewHistoryModal 
          onClose={() => setIsModalOpen(false)}
          allHistory={allHistory}
          firstReviewMap={firstReviewMap}
        />
      )}
    </>
  );
}
