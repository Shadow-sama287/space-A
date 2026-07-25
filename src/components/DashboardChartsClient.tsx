'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import SevenDayReviewWidget from './SevenDayReviewWidget';

interface DashboardChartsClientProps {
  activeProblems: any[];
  history: any[];
  allHistory: any[];
}

export default function DashboardChartsClient({
  activeProblems,
  history,
  allHistory,
}: DashboardChartsClientProps) {
  // === 7-DAY FORECAST ===
  const forecast = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + i);
      targetDate.setHours(0, 0, 0, 0);

      const nextDate = new Date(targetDate);
      nextDate.setDate(nextDate.getDate() + 1);

      const count = activeProblems.filter((up) => {
        const reviewDate = new Date(up.next_review_date);
        if (i === 0) {
          return reviewDate < nextDate;
        } else {
          return reviewDate >= targetDate && reviewDate < nextDate;
        }
      }).length;

      const label = targetDate.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit' });
      return { label, count };
    });
  }, [activeProblems]);

  const maxForecastCount = Math.max(...forecast.map((f) => f.count), 1);

  // === 28-DAY CALENDAR HEATMAP ===
  const heatmapDays = useMemo(() => {
    // Build a count map: dateStr → number of reviews that day
    const historyCountMap = new Map<string, number>();
    (history || []).forEach((h) => {
      const dateStr = new Date(h.reviewed_at).toDateString();
      historyCountMap.set(dateStr, (historyCountMap.get(dateStr) ?? 0) + 1);
    });

    return Array.from({ length: 28 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (27 - i));
      const dateStr = d.toDateString();
      const count = historyCountMap.get(dateStr) ?? 0;
      return {
        dayNum: d.getDate(),
        count,
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      };
    });
  }, [history]);

  // Dynamic max: busiest day = darkest shade (even if only 1 review)
  const heatmapMax = Math.max(...heatmapDays.map((d) => d.count), 1);

  // === 7-DAY PAST REVIEW (NEW VS OLD) ===
  const { past7DaysReviews, maxPastReviewCount, firstReviewMap } = useMemo(() => {
    const firstMap = new Map<string, string>();
    allHistory.forEach((h) => {
      const d = new Date(h.reviewed_at);
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!firstMap.has(h.problem_id)) {
        firstMap.set(h.problem_id, dateKey);
      } else {
        const existingDate = firstMap.get(h.problem_id)!;
        if (dateKey < existingDate) {
          firstMap.set(h.problem_id, dateKey);
        }
      }
    });

    const reviews = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

      let newCount = 0;
      let oldCount = 0;

      allHistory.forEach((h) => {
        const hd = new Date(h.reviewed_at);
        const hDateKey = `${hd.getFullYear()}-${String(hd.getMonth() + 1).padStart(2, '0')}-${String(hd.getDate()).padStart(2, '0')}`;

        if (hDateKey === dateKey) {
          if (firstMap.get(h.problem_id) === dateKey) {
            newCount++;
          } else {
            oldCount++;
          }
        }
      });

      return {
        label: d.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit' }),
        newCount,
        oldCount,
        totalCount: newCount + oldCount,
      };
    });

    return {
      past7DaysReviews: reviews,
      maxPastReviewCount: Math.max(...reviews.map((f) => f.totalCount), 1),
      firstReviewMap: firstMap,
    };
  }, [allHistory]);

  return (
    <div>
      {/* 7-DAY FORECAST */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
          <h3 className="card-title" style={{ margin: 0 }}>7-Day Review Forecast</h3>
          <Link href="/timeline" style={{ fontSize: '0.7rem', fontWeight: 900, fontFamily: 'monospace', textTransform: 'uppercase', textDecoration: 'underline' }}>
            FULL TIMELINE ➔
          </Link>
        </div>
        <p className="mb-2" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
          Number of reviews scheduled for the upcoming week
        </p>
        <div className="bar-chart mt-1">
          {forecast.map((f, i) => {
            const pct = (f.count / maxForecastCount) * 100;
            return (
              <div key={i} className="bar-container">
                <div style={{ fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '2px' }}>
                  {f.count > 0 ? f.count : ''}
                </div>
                <div
                  className="bar-fill"
                  style={{
                    height: `${Math.max(pct, 4)}%`,
                    backgroundColor: i === 0 && f.count > 0 ? 'var(--text-primary)' : 'var(--bg-tertiary)',
                    borderWidth: f.count > 0 ? '2px' : '1px',
                  }}
                />
                <div className="bar-label">{f.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 28-DAY CALENDAR HEATMAP */}
      <div className="card">
        <h3 className="card-title">28-Day Review Activity</h3>
        <p className="mb-3" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
          Review intensity over the past 28 days
        </p>
        <div className="heatmap-grid">
          {heatmapDays.map((d, index) => {
            let level = 0;
            if (d.count > 0) {
              const ratio = d.count / heatmapMax;
              if (ratio <= 0.25) level = 1;
              else if (ratio <= 0.50) level = 2;
              else if (ratio <= 0.75) level = 3;
              else level = 4;
            }
            const tooltipText =
              d.count === 0
                ? `${d.label} — No reviews`
                : `${d.label} — ${d.count} review${d.count > 1 ? 's' : ''}`;
            return (
              <div
                key={index}
                title={tooltipText}
                className={`heatmap-day heatmap-level-${level}`}
              >
                {d.dayNum}
              </div>
            );
          })}
        </div>
        <div className="heatmap-legend">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <div key={l} className={`heatmap-legend-swatch heatmap-level-${l}`} />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* 7-DAY PAST REVIEW: NEW VS OLD WIDGET */}
      <SevenDayReviewWidget
        past7DaysReviews={past7DaysReviews}
        maxPastReviewCount={maxPastReviewCount}
        allHistory={allHistory}
        firstReviewMap={firstReviewMap}
      />
    </div>
  );
}
