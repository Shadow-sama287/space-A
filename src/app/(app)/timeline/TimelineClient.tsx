'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Problem {
  id: string;
  sheet: string;
  title: string;
  category: string;
  difficulty: string;
  leetcode_url?: string;
  ninja_url?: string;
}

interface UserProblem {
  id: string;
  problem_id: string;
  next_review_date: string;
  repetitions: number;
  ease_factor: number;
  interval_days: number;
  status: string;
  updated_at?: string;
}

interface TimelineClientProps {
  problems: Problem[];
  userProgress: UserProblem[];
  enabledSheets: string[];
}

type HorizonOption = '7' | '14' | '30' | '90' | 'all';
type DifficultyFilter = 'all' | 'Easy' | 'Medium' | 'Hard';

export default function TimelineClient({
  problems,
  userProgress,
  enabledSheets,
}: TimelineClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Filters State
  const [horizon, setHorizon] = useState<HorizonOption>('30');
  const [sheetFilter, setSheetFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');

  // Selected Problem Modal State for SM-2 Growth Details
  const [selectedProblem, setSelectedProblem] = useState<{
    problem: Problem;
    progress: UserProblem;
  } | null>(null);

  // Map problems by ID
  const problemMap = new Map<string, Problem>();
  problems.forEach((p) => problemMap.set(p.id, p));

  // Filter progress entries based on active filters
  const filteredUserProblems = userProgress.filter((up) => {
    const p = problemMap.get(up.problem_id);
    if (!p) return false;

    // Filter by enabled sheets
    if (!enabledSheets.includes(p.sheet)) return false;

    // Filter by selected sheet
    if (sheetFilter !== 'all' && p.sheet !== sheetFilter) return false;

    // Filter by difficulty
    if (difficultyFilter !== 'all' && p.difficulty !== difficultyFilter) return false;

    // Filter by horizon
    if (horizon !== 'all') {
      const days = parseInt(horizon, 10);
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + days);
      const reviewDate = new Date(up.next_review_date);
      if (reviewDate > maxDate) return false;
    }

    return true;
  });

  // Group scheduled problems by formatted date
  const groupedByDate: { [dateStr: string]: { dateObj: Date; items: { problem: Problem; progress: UserProblem }[] } } = {};

  const todayStr = new Date().toDateString();

  filteredUserProblems.forEach((up) => {
    const p = problemMap.get(up.problem_id);
    if (!p) return;

    const reviewDate = new Date(up.next_review_date);
    const dateStr = reviewDate.toDateString();

    if (!groupedByDate[dateStr]) {
      groupedByDate[dateStr] = {
        dateObj: reviewDate,
        items: [],
      };
    }
    groupedByDate[dateStr].items.push({ problem: p, progress: up });
  });

  // Sort dates chronologically
  const sortedDateKeys = Object.keys(groupedByDate).sort(
    (a, b) => groupedByDate[a].dateObj.getTime() - groupedByDate[b].dateObj.getTime()
  );

  // Helper: Calculate projected SM-2 interval milestones
  const getProjectedMilestones = (up: UserProblem) => {
    let rep = up.repetitions || 1;
    let interval = up.interval_days || 1;
    let ef = up.ease_factor || 2.5;

    const milestones = [];
    milestones.push({ stage: 'Current', interval: `${interval}d`, ef: ef.toFixed(2), rep });

    // Project next 3 successful 'Good' reviews
    for (let i = 1; i <= 3; i++) {
      if (rep === 0) {
        interval = 1;
      } else if (rep === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * ef);
      }
      rep += 1;
      milestones.push({ stage: `Review +${i}`, interval: `${interval}d`, ef: ef.toFixed(2), rep });
    }
    return milestones;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* FILTER CONTROL BAR */}
      <div className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 900, fontFamily: 'monospace', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              TIME HORIZON
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '4px' }}>
              {(['7', '14', '30', '90', 'all'] as HorizonOption[]).map((h) => (
                <button
                  key={h}
                  onClick={() => setHorizon(h)}
                  style={{
                    padding: '0.35rem 0.65rem',
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    backgroundColor: horizon === h ? 'var(--text-primary)' : 'var(--bg-primary)',
                    color: horizon === h ? 'var(--bg-primary)' : 'var(--text-primary)',
                    border: '2px solid var(--border-color)',
                    boxShadow: horizon === h ? '2px 2px 0px 0px var(--shadow-color)' : 'none',
                  }}
                >
                  {h === 'all' ? 'ALL' : `${h} DAYS`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 900, fontFamily: 'monospace', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              SHEET FILTER
            </div>
            <select
              value={sheetFilter}
              onChange={(e) => setSheetFilter(e.target.value)}
              className="input"
              style={{ height: '34px', fontSize: '0.75rem', fontWeight: 900, fontFamily: 'monospace', marginTop: '4px', padding: '0.3rem' }}
            >
              <option value="all">ALL ENABLED SHEETS</option>
              {enabledSheets.includes('striver_sde') && <option value="striver_sde">STRIVER SDE (191)</option>}
              {enabledSheets.includes('striver_a2z') && <option value="striver_a2z">STRIVER A2Z (474)</option>}
              {enabledSheets.includes('tle_31') && <option value="tle_31">TLE ELIMINATORS CP (372)</option>}
              {enabledSheets.includes('neetcode_all') && <option value="neetcode_all">NEETCODE ALL (973)</option>}
              {enabledSheets.includes('neetcode_250') && <option value="neetcode_250">NEETCODE 250 (250)</option>}
              {enabledSheets.includes('neetcode_150') && <option value="neetcode_150">NEETCODE 150 (150)</option>}
              {enabledSheets.includes('blind_75') && <option value="blind_75">BLIND 75 (75)</option>}
            </select>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 900, fontFamily: 'monospace', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              DIFFICULTY
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '4px' }}>
              {(['all', 'Easy', 'Medium', 'Hard'] as DifficultyFilter[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficultyFilter(d)}
                  style={{
                    padding: '0.35rem 0.6rem',
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    backgroundColor: difficultyFilter === d ? 'var(--text-primary)' : 'var(--bg-primary)',
                    color: difficultyFilter === d ? 'var(--bg-primary)' : 'var(--text-primary)',
                    border: '2px solid var(--border-color)',
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
          SHOWING <strong>{filteredUserProblems.length}</strong> SCHEDULED REVIEWS ACROSS <strong>{sortedDateKeys.length}</strong> TIMELINE DATES
        </div>
      </div>

      {/* REVISION TIMELINE TRACK */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {sortedDateKeys.map((dateStr) => {
          const group = groupedByDate[dateStr];
          const isToday = dateStr === todayStr;
          const isPastDue = group.dateObj < new Date() && !isToday;

          return (
            <div
              key={dateStr}
              style={{
                border: '2px solid var(--border-color)',
                backgroundColor: isToday ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                boxShadow: isToday ? '4px 4px 0px 0px var(--shadow-color)' : '2px 2px 0px 0px var(--shadow-color)',
                padding: '1.25rem',
                position: 'relative',
              }}
            >
              {/* DATE HEADER BANNER */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.6rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 900,
                      fontSize: '1rem',
                      textTransform: 'uppercase',
                      padding: '0.2rem 0.6rem',
                      backgroundColor: isToday ? 'var(--text-primary)' : 'var(--bg-primary)',
                      color: isToday ? 'var(--bg-primary)' : 'var(--text-primary)',
                      border: '2px solid var(--border-color)',
                    }}
                  >
                    {isToday ? 'TODAY (DUE NOW)' : isPastDue ? `${dateStr} (OVERDUE)` : dateStr}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '0.8rem' }}>
                    {group.items.length} {group.items.length === 1 ? 'PROBLEM' : 'PROBLEMS'}
                  </span>

                  {isToday && (
                    <Link
                      href="/review"
                      className="btn btn-black"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', textTransform: 'uppercase', fontFamily: 'monospace', textDecoration: 'none' }}
                    >
                      START QUEUE ➔
                    </Link>
                  )}
                </div>
              </div>

              {/* SCHEDULED PROBLEM CHIPS GRID */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
                {group.items.map(({ problem, progress }) => {
                  const isMastered = progress.status === 'mastered';

                  return (
                    <div
                      key={problem.id}
                      onClick={() => setSelectedProblem({ problem, progress })}
                      style={{
                        border: '2px solid var(--border-color)',
                        backgroundColor: 'var(--bg-primary)',
                        padding: '0.75rem',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '0.5rem',
                        boxShadow: '2px 2px 0px 0px var(--shadow-color)',
                        transition: 'transform 0.1s ease',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.4rem', marginBottom: '4px' }}>
                          <span
                            style={{
                              fontSize: '0.65rem',
                              fontFamily: 'monospace',
                              fontWeight: 900,
                              textTransform: 'uppercase',
                              padding: '0.15rem 0.4rem',
                              border: '1px solid var(--border-color)',
                              backgroundColor:
                                problem.difficulty === 'Easy'
                                  ? 'var(--difficulty-easy)'
                                  : problem.difficulty === 'Medium'
                                  ? 'var(--difficulty-medium)'
                                  : 'var(--difficulty-hard)',
                              color:
                                problem.difficulty === 'Hard'
                                  ? 'var(--difficulty-hard-text)'
                                  : 'var(--text-primary)',
                            }}
                          >
                            {problem.difficulty}
                          </span>

                          <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', fontWeight: 900, color: 'var(--text-secondary)' }}>
                            {problem.sheet === 'striver_sde' ? 'SDE SHEET' : 'A2Z SHEET'}
                          </span>
                        </div>

                        <div style={{ fontWeight: 900, fontSize: '0.85rem', fontFamily: 'monospace', textTransform: 'uppercase', color: 'var(--text-primary)', wordBreak: 'break-word' }}>
                          {problem.title}
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.4rem', marginTop: '0.2rem' }}>
                        <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                          {problem.category}
                        </span>

                        <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', fontWeight: 900 }}>
                          {progress.status === 'cooling' ? (
                            <span style={{ backgroundColor: 'var(--text-secondary)', color: 'var(--bg-primary)', padding: '2px 4px' }}>
                              IN COOL-OFF
                            </span>
                          ) : (
                            `STAGE ${progress.repetitions} (${progress.interval_days}d)`
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {sortedDateKeys.length === 0 && (
          <div className="card text-center" style={{ padding: '3rem 1rem' }}>
            <h3 className="card-title mb-2">No Scheduled Reviews Found</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
              No upcoming revisions match your selected filters and horizon.
            </p>
          </div>
        )}
      </div>

      {/* SM-2 PROBLEM GROWTH JOURNEY MODAL */}
      {selectedProblem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedProblem(null);
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '600px',
              width: '100%',
              backgroundColor: 'var(--bg-primary)',
              border: '3px solid var(--border-color)',
              boxShadow: '6px 6px 0px 0px var(--shadow-color)',
            }}
          >
            {/* MODAL HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 900, fontFamily: 'monospace', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                  {selectedProblem.problem.sheet === 'striver_sde' ? 'STRIVER SDE SHEET' : 'STRIVER A2Z SHEET'} • {selectedProblem.problem.category}
                </span>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', margin: '4px 0 0 0' }}>
                  {selectedProblem.problem.title}
                </h2>
              </div>

              <button
                onClick={() => setSelectedProblem(null)}
                className="btn btn-black btn-sm"
                style={{ padding: '0.3rem 0.6rem', fontFamily: 'monospace' }}
              >
                CLOSE [X]
              </button>
            </div>

            {/* SM-2 METRICS */}
            <div className="grid-3 mb-3" style={{ gap: '0.75rem' }}>
              <div style={{ border: '2px solid var(--border-color)', padding: '0.75rem', textAlign: 'center', fontFamily: 'monospace' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Current Interval</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, marginTop: '2px' }}>{selectedProblem.progress.interval_days} Days</div>
              </div>

              <div style={{ border: '2px solid var(--border-color)', padding: '0.75rem', textAlign: 'center', fontFamily: 'monospace' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Ease Factor (EF)</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, marginTop: '2px' }}>{Number(selectedProblem.progress.ease_factor).toFixed(2)}</div>
              </div>

              <div style={{ border: '2px solid var(--border-color)', padding: '0.75rem', textAlign: 'center', fontFamily: 'monospace' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Repetitions</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, marginTop: '2px' }}>Stage {selectedProblem.progress.repetitions}</div>
              </div>
            </div>

            {/* PROJECTED GROWTH MILESTONES */}
            <div style={{ border: '2px solid var(--border-color)', padding: '1rem', backgroundColor: 'var(--bg-secondary)', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 900, fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Projected SM-2 Retention Growth Milestones
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
                {getProjectedMilestones(selectedProblem.progress).map((m, i) => (
                  <div key={i} style={{ border: '1px solid var(--border-color)', backgroundColor: i === 0 ? 'var(--text-primary)' : 'var(--bg-primary)', color: i === 0 ? 'var(--bg-primary)' : 'var(--text-primary)', padding: '0.5rem', fontFamily: 'monospace' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 'bold' }}>{m.stage}</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 900, marginTop: '2px' }}>{m.interval}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* EXTERNAL PRACTICE LINKS */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {selectedProblem.problem.leetcode_url && (
                <a
                  href={selectedProblem.problem.leetcode_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-black"
                  style={{ flex: 1, textAlign: 'center', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'monospace', fontSize: '0.8rem' }}
                >
                  Solve on LeetCode ↗
                </a>
              )}
              {selectedProblem.problem.ninja_url && (
                <a
                  href={selectedProblem.problem.ninja_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-black"
                  style={{ flex: 1, textAlign: 'center', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'monospace', fontSize: '0.8rem' }}
                >
                  Solve Editor Link ↗
                </a>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
