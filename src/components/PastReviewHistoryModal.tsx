'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Loader2 } from 'lucide-react';
import { fetchDetailedHistoryForDate } from '@/app/actions/history-actions';

interface PastReviewHistoryModalProps {
  onClose: () => void;
  allHistory: any[];
  firstReviewMap: Map<string, string>;
}

export default function PastReviewHistoryModal({
  onClose,
  allHistory,
  firstReviewMap
}: PastReviewHistoryModalProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [detailedHistory, setDetailedHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 1. Group allHistory by date to build the chart data
  const chartDataMap = new Map<string, { newCount: number, oldCount: number, label: string }>();
  
  allHistory.forEach(h => {
    const hd = new Date(h.reviewed_at);
    const dateKey = `${hd.getFullYear()}-${String(hd.getMonth()+1).padStart(2,'0')}-${String(hd.getDate()).padStart(2,'0')}`;
    const label = hd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    if (!chartDataMap.has(dateKey)) {
      chartDataMap.set(dateKey, { newCount: 0, oldCount: 0, label });
    }
    
    const entry = chartDataMap.get(dateKey)!;
    if (firstReviewMap.get(h.problem_id) === dateKey) {
      entry.newCount++;
    } else {
      entry.oldCount++;
    }
  });

  // Convert map to sorted array (oldest to newest)
  const chartData = Array.from(chartDataMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([dateKey, counts]) => ({
      dateKey,
      ...counts,
      totalCount: counts.newCount + counts.oldCount
    }));

  const maxCount = Math.max(...chartData.map(d => d.totalCount), 1);

  // Set initial selected date to the most recent day that has reviews
  useEffect(() => {
    if (chartData.length > 0 && !selectedDate) {
      const mostRecent = chartData[chartData.length - 1].dateKey;
      setSelectedDate(mostRecent);
    }
  }, [chartData, selectedDate]);

  // Scroll to the far right on mount (to see the newest data)
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, []);

  // Fetch detailed history when a date is selected
  useEffect(() => {
    if (!selectedDate) return;

    const loadDetails = async () => {
      setLoading(true);
      try {
        const details = await fetchDetailedHistoryForDate(selectedDate);
        setDetailedHistory(details);
      } catch (e) {
        console.error('Failed to load details', e);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [selectedDate]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick} style={{ zIndex: 1100 }}>
      <div className="modal-content" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', height: '600px', maxHeight: '90vh' }}>
        
        {/* HEADER */}
        <div className="flex-between mb-3" style={{ borderBottom: '3px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>
            Past Review History
          </h2>
          <button onClick={onClose} className="btn btn-outline" style={{ padding: '0.25rem' }}>
            <X size={20} />
          </button>
        </div>

        {/* TOP SECTION: SCROLLABLE CHART */}
        <div style={{ flexShrink: 0, marginBottom: '1.5rem' }}>
          <p className="mb-2" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            <span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: 'var(--text-primary)', marginRight: '4px' }}></span> New Problems
            <span style={{ display: 'inline-block', width: '10px', height: '10px', marginLeft: '12px', marginRight: '4px', border: '1px solid var(--border-color)' }} className="bg-hatched"></span> Old Problems
          </p>

          <div 
            ref={scrollContainerRef}
            style={{ 
              display: 'flex', 
              alignItems: 'flex-end', 
              height: '140px', 
              gap: '12px', 
              padding: '8px 4px', 
              borderBottom: '2px solid var(--border-color)',
              overflowX: 'auto',
              scrollbarWidth: 'thin'
            }}
          >
            {chartData.length === 0 ? (
              <div style={{ alignSelf: 'center', width: '100%', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No review history found.
              </div>
            ) : (
              chartData.map((d) => {
                const newPct = (d.newCount / maxCount) * 100;
                const oldPct = (d.oldCount / maxCount) * 100;
                const isSelected = selectedDate === d.dateKey;

                return (
                  <div 
                    key={d.dateKey} 
                    onClick={() => setSelectedDate(d.dateKey)}
                    style={{
                      flex: '0 0 40px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      height: '100%',
                      cursor: 'pointer',
                      opacity: (selectedDate && !isSelected) ? 0.4 : 1,
                      transition: 'opacity 0.2s'
                    }}
                  >
                    <div style={{ fontSize: '0.65rem', fontWeight: 'bold', marginBottom: '4px' }}>
                      {d.totalCount}
                    </div>
                    
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
                      {d.newCount > 0 && (
                        <div 
                          className="bg-solid-black" 
                          style={{ 
                            height: `${Math.max(newPct, 4)}%`,
                            border: '1px solid var(--border-color)',
                            borderBottom: d.oldCount > 0 ? 'none' : '1px solid var(--border-color)',
                            width: '100%'
                          }}
                          title={`${d.newCount} New Problems`}
                        />
                      )}
                      {d.oldCount > 0 && (
                        <div 
                          className="bg-hatched" 
                          style={{ 
                            height: `${Math.max(oldPct, 4)}%`,
                            border: '1px solid var(--border-color)',
                            width: '100%'
                          }}
                          title={`${d.oldCount} Old Problems (Re-reviews)`}
                        />
                      )}
                    </div>

                    <div style={{ fontSize: '0.65rem', marginTop: '4px', whiteSpace: 'nowrap' }}>
                      {d.label}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* BOTTOM SECTION: DETAILED LIST */}
        <div style={{ flexGrow: 1, overflowY: 'auto' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '1rem', borderBottom: '1.5px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            {selectedDate ? `Reviews on ${selectedDate}` : 'Select a date'}
          </h3>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <Loader2 className="animate-spin" size={24} />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {detailedHistory.length === 0 && selectedDate ? (
                <div style={{ color: 'var(--text-secondary)' }}>No detailed records found for this date.</div>
              ) : (
                detailedHistory.map((entry, idx) => (
                  <div key={idx} style={{ 
                    border: '1px solid var(--border-color)', 
                    padding: '0.75rem', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.5rem',
                    backgroundColor: 'var(--bg-secondary)'
                  }}>
                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                      {entry.problems?.title || entry.problem_id}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      <div>
                        Rating: <span style={{ fontWeight: 'bold' }}>{entry.rating}</span>
                      </div>
                      <div>
                        Interval: <span style={{ fontWeight: 'bold' }}>{entry.interval_days}d</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {entry.problems?.difficulty && (
                          <span className={`badge-difficulty badge-${entry.problems.difficulty.toLowerCase()}`}>
                            {entry.problems.difficulty}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
