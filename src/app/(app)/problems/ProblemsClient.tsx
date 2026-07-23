'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { submitReview } from '../review/actions';
import CPWalkthroughModal from '@/components/CPWalkthroughModal';
import { coolOffProblemAction, resumeProblemAction } from '@/app/actions/cool-off-actions';
import ActiveRecallWidget from '@/components/ActiveRecallWidget';
import ScratchpadModal from '@/components/ScratchpadModal';
import { getProblemSubSheets } from '@/lib/neetcodeHelpers';

interface Problem {
  id: string;
  sheet: string;
  sub_sheets?: string[];
  title: string;
  category: string;
  difficulty: string;
  rating?: number | null;
  leetcode_url: string;
  ninja_url: string | null;
}

interface UserProblem {
  problem_id: string;
  interval_days: number;
  ease_factor: string;
  repetitions: number;
  next_review_date: string;
  last_reviewed_at: string | null;
  status: string;
}

interface ProblemsClientProps {
  problems: Problem[];
  userProgress: UserProblem[];
  enabledSheets?: string[];
}

export default function ProblemsClient({ problems, userProgress, enabledSheets = ['striver_sde', 'striver_a2z', 'tle_31', 'neetcode_all', 'neetcode_250', 'neetcode_150', 'blind_75'] }: ProblemsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Seeding state
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);

  // Default to first enabled sheet if available
  const initialSheet = enabledSheets.length > 0 ? enabledSheets[0] : 'striver_sde';
  const [sheetFilter, setSheetFilter] = useState(initialSheet);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState('');

  // CP Walkthrough Modal state
  const [isCPModalOpen, setIsCPModalOpen] = useState(false);

  // Back to Top scroll listener
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Modal state
  const [reviewProblem, setReviewProblem] = useState<Problem | null>(null);
  const [scratchpadProblem, setScratchpadProblem] = useState<Problem | null>(null);
  const [reviewRating, setReviewRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cool Off Handlers
  async function handleCoolOffProblem(problemId: string) {
    setIsSubmitting(true);
    try {
      const res = await coolOffProblemAction(problemId);
      if (res.success) {
        startTransition(() => {
          router.refresh();
        });
      } else {
        alert(res.error);
      }
    } catch (err: any) {
      alert(`Cool-off failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResumeProblem(problemId: string) {
    setIsSubmitting(true);
    try {
      const res = await resumeProblemAction(problemId);
      if (res.success) {
        startTransition(() => {
          router.refresh();
        });
      }
    } catch (err: any) {
      alert(`Resume failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Get progress mapping
  const progressMap = new Map<string, UserProblem>();
  userProgress.forEach(up => {
    progressMap.set(up.problem_id, up);
  });

  // Dynamic categories per selected sheet
  const categories = Array.from(
    new Set(
      problems
        .filter(p => {
          if (['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'].includes(sheetFilter)) {
            const subSheets = getProblemSubSheets(p);
            return p.sheet === sheetFilter || subSheets.includes(sheetFilter);
          }
          return p.sheet === sheetFilter;
        })
        .map(p => p.category)
    )
  );

  // Available sheets
  const availableSheets = [
    { id: 'striver_sde', label: `Striver SDE Sheet (191)${!enabledSheets.includes('striver_sde') ? ' - [DISABLED]' : ''}` },
    { id: 'striver_a2z', label: `Striver's A2Z Sheet (474)${!enabledSheets.includes('striver_a2z') ? ' - [DISABLED]' : ''}` },
    { id: 'tle_31', label: `TLE Eliminators CP Sheet (372)${!enabledSheets.includes('tle_31') ? ' - [DISABLED]' : ''}` },
    { id: 'neetcode_all', label: `NeetCode All Practice (973)${!enabledSheets.includes('neetcode_all') ? ' - [DISABLED]' : ''}` },
    { id: 'neetcode_250', label: `NeetCode 250${!enabledSheets.includes('neetcode_250') ? ' - [DISABLED]' : ''}` },
    { id: 'neetcode_150', label: `NeetCode 150${!enabledSheets.includes('neetcode_150') ? ' - [DISABLED]' : ''}` },
    { id: 'blind_75', label: `Blind 75${!enabledSheets.includes('blind_75') ? ' - [DISABLED]' : ''}` },
  ];

  // Run database seeding
  async function handleSeed() {
    setSeeding(true);
    setSeedResult(null);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSeedResult(`SUCCESS: ${data.message || `Preseeded ${data.count} problems across all sheets!`}`);
        startTransition(() => {
          router.refresh();
        });
      } else {
        setSeedResult(`ERROR: ${data.error || 'Failed to seed'}`);
      }
    } catch (err: any) {
      setSeedResult(`ERROR: ${err.message}`);
    } finally {
      setSeeding(false);
    }
  }

  // Handle Quick Review submission
  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reviewProblem || reviewRating === null) return;

    setIsSubmitting(true);
    try {
      const d = new Date();
      const localDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      await submitReview(reviewProblem.id, reviewRating, localDateStr);
      setReviewProblem(null);
      setReviewRating(null);
      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      alert(`Error submitting review: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Filter logic
  const filteredProblems = problems.filter(p => {
    // 1. Sheet Filter
    if (['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'].includes(sheetFilter)) {
      const subSheets = getProblemSubSheets(p);
      const matchesMainSheet = p.sheet === sheetFilter;
      const matchesSubSheet = subSheets.includes(sheetFilter);
      if (!matchesMainSheet && !matchesSubSheet) return false;
    } else if (p.sheet !== sheetFilter) {
      return false;
    }

    // 2. Search query
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;

    // 3. Rating Filter (for TLE 31 CP sheet)
    if (sheetFilter === 'tle_31' && ratingFilter !== 'all') {
      const targetRating = parseInt(ratingFilter, 10);
      if (p.rating !== targetRating && p.category !== `${targetRating} Rating`) return false;
    }

    // 4. Category Filter
    if (categoryFilter && p.category !== categoryFilter) return false;

    // 5. Status Filter
    if (statusFilter) {
      const prog = progressMap.get(p.id);
      const status = prog ? prog.status : 'unreviewed';
      if (statusFilter === 'unreviewed' && status !== 'unreviewed') return false;
      if (statusFilter === 'reviewing' && status !== 'reviewing') return false;
      if (statusFilter === 'mastered' && status !== 'mastered') return false;
    }

    return true;
  });

  const totalSheetProblemsCount = problems.filter(p => {
    if (['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'].includes(sheetFilter)) {
      const subSheets = getProblemSubSheets(p);
      return p.sheet === sheetFilter || subSheets.includes(sheetFilter);
    }
    return p.sheet === sheetFilter;
  }).length;

  return (
    <div>
      {/* CP WALKTHROUGH MODAL */}
      <CPWalkthroughModal isOpen={isCPModalOpen} onClose={() => setIsCPModalOpen(false)} />

      {/* SEED DATABASE CORNER BANNER */}
      {problems.length === 0 && (
        <div className="card" style={{ backgroundColor: 'var(--bg-secondary)', marginBottom: '2rem' }}>
          <h2 className="card-title">Database is empty</h2>
          <p className="mb-2">Your Supabase database has no problems loaded. Click below to seed the database with Striver SDE, A2Z & TLE 31 sheet problems.</p>
          <button onClick={handleSeed} disabled={seeding} className="btn btn-black">
            {seeding ? 'SEEDING DATABASE...' : 'SEED ALL SHEETS (SDE, A2Z & TLE 31)'}
          </button>
          {seedResult && <div className="mt-2" style={{ fontWeight: 'bold' }}>{seedResult}</div>}
        </div>
      )}

      {/* FILTER CONTROL BAR */}
      {problems.length > 0 && (
        <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #000' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>
              TOTAL LOADED PROBLEMS: {problems.length}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {sheetFilter === 'tle_31' && (
                <button
                  onClick={() => setIsCPModalOpen(true)}
                  className="btn btn-black btn-sm"
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', fontFamily: 'monospace' }}
                >
                  CP WALKTHROUGH & ROADMAP
                </button>
              )}
              <button 
                onClick={handleSeed} 
                disabled={seeding} 
                className="btn btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
              >
                {seeding ? 'RE-SEEDING...' : 'RE-SEED / RELOAD ALL SHEETS'}
              </button>
            </div>
          </div>
          {seedResult && <div className="mb-3" style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{seedResult}</div>}

          <div className="grid-3" style={{ gap: '1rem' }}>
            {/* Sheet Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Select Sheet
              </label>
              <select
                value={sheetFilter}
                onChange={(e) => {
                  setSheetFilter(e.target.value);
                  setCategoryFilter('');
                  setRatingFilter('all');
                }}
                className="input"
                style={{ height: '42px', padding: '0.4rem' }}
              >
                {availableSheets.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Search Title
              </label>
              <input
                type="text"
                placeholder="e.g. Kadane's"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input"
                style={{ height: '42px', padding: '0.5rem' }}
              />
            </div>

            {/* Category Dropdown (Hidden when TLE CP Sheet is active) */}
            {sheetFilter !== 'tle_31' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="input"
                  style={{ height: '42px', padding: '0.4rem' }}
                >
                  <option value="">ALL CATEGORIES</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex-between mt-2" style={{ fontSize: '0.8rem' }}>
            <div>
              SHOWING <strong>{filteredProblems.length}</strong> OF <strong>{totalSheetProblemsCount}</strong> PROBLEMS
            </div>
            {/* Seed Trigger Option for Resetting/Seeding */}
            <button onClick={handleSeed} disabled={seeding} className="btn btn-outline btn-small" style={{ border: '1px solid var(--border-color)', boxShadow: 'none' }}>
              {seeding ? 'Seeding...' : 'Reload/Seed Data'}
            </button>
          </div>
          {seedResult && <div className="mt-1" style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>{seedResult}</div>}
        </div>
      )}

      {/* DEDICATED SEPARATE CARD DIVISION FOR CODEFORCES RATING TIER FILTER BAR */}
      {problems.length > 0 && sheetFilter === 'tle_31' && (
        <div className="card mb-3" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 900, fontFamily: 'monospace', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            CODEFORCES RATING TIERS (800 - 1900)
          </div>
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {['all', '800', '900', '1000', '1100', '1200', '1300', '1400', '1500', '1600', '1700', '1800', '1900'].map((r) => (
              <button
                key={r}
                onClick={() => setRatingFilter(r)}
                style={{
                  padding: '0.35rem 0.65rem',
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  backgroundColor: ratingFilter === r ? 'var(--text-primary)' : 'var(--bg-primary)',
                  color: ratingFilter === r ? 'var(--bg-primary)' : 'var(--text-primary)',
                  border: '2px solid var(--border-color)',
                  boxShadow: ratingFilter === r ? '2px 2px 0px 0px var(--shadow-color)' : 'none',
                }}
              >
                {r === 'all' ? 'ALL RATINGS' : `CF ${r}`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PROBLEMS LIST */}
      {filteredProblems.length > 0 ? (
        <div className="card problem-table-container" style={{ padding: '0px' }}>
          <table className="problem-table" style={{ margin: '0px' }}>
            <thead>
              <tr>
                <th style={{ width: '15%', minWidth: '130px' }}>Topic</th>
                <th>Problem Title</th>
                <th style={{ width: '110px' }}>Difficulty</th>
                <th style={{ width: '150px' }}>Status</th>
                <th style={{ width: '270px', minWidth: '270px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.map(p => {
                const prog = progressMap.get(p.id);
                const status = prog ? prog.status : 'unreviewed';

                return (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.85rem' }}>
                      {p.category}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.95rem' }}>{p.title}</span>
                        {p.rating && (
                          <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', fontWeight: 900, padding: '0.1rem 0.35rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                            CF {p.rating}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`badge-difficulty badge-${p.difficulty.toLowerCase()}`}>
                        {p.difficulty}
                      </span>
                    </td>
                    <td>
                      {status === 'unreviewed' && (
                        <span className="badge-status badge-status-unreviewed">[ ] UNREVIEWED</span>
                      )}
                      {status === 'reviewing' && (
                        <span className="badge-status badge-status-reviewing">
                          [*] D:{prog?.interval_days}d (EF:{prog?.ease_factor})
                        </span>
                      )}
                      {status === 'mastered' && (
                        <span className="badge-status badge-status-mastered">[M] MASTERED</span>
                      )}
                      {status === 'cooling' && (
                        <span className="badge-status badge-status-cooling">
                          [Zzz] SNOOZED ({(prog as any)?.cooling_queue_tier === 'primary' ? 'PRI 3D' : 'WAITING'})
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {/* Outer Solve Link */}
                        <a
                          href={p.leetcode_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-small"
                          style={{ boxShadow: 'none' }}
                        >
                          SOLVE ↗
                        </a>

                        {/* Scratchpad Canvas Modal Trigger */}
                        <button
                          onClick={() => setScratchpadProblem(p)}
                          className="btn btn-small"
                          style={{ boxShadow: 'none', backgroundColor: 'var(--bg-secondary)', border: '2px solid var(--border-color)' }}
                          title="Open tldraw Canvas Scratchpad"
                        >
                          DRAW
                        </button>

                        {/* Review Modal Trigger */}
                        <button
                          onClick={() => setReviewProblem(p)}
                          className="btn btn-small btn-black"
                          style={{ boxShadow: 'none' }}
                        >
                          REVIEW
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        problems.length > 0 && (
          <div className="card text-center" style={{ padding: '2rem' }}>
            <h3>NO PROBLEMS MATCH YOUR FILTER CRITERIA</h3>
            <p className="mt-1" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Try clearing your filters or changing your search query.</p>
          </div>
        )
      )}

      {/* QUICK REVIEW MODAL */}
      {reviewProblem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex-between mb-2" style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <h3 style={{ textTransform: 'uppercase' }}>Submit Review</h3>
              <button
                onClick={() => {
                  setReviewProblem(null);
                  setReviewRating(null);
                }}
                className="btn btn-small btn-outline"
                style={{ border: 'none', padding: '0.2rem 0.5rem', cursor: 'pointer' }}
              >
                [X] CLOSE
              </button>
            </div>

            <p style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              {reviewProblem.title}
            </p>
            <div className="mb-3" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              TOPIC: <span style={{ fontWeight: 'bold' }}>{reviewProblem.category.toUpperCase()}</span> | 
              DIFFICULTY: <span style={{ fontWeight: 'bold' }}>{reviewProblem.difficulty.toUpperCase()}</span>
            </div>

            {/* ACTIVE RECALL WIDGET */}
            <ActiveRecallWidget
              problemId={reviewProblem.id}
              problemTitle={reviewProblem.title}
            />

            <form onSubmit={handleReviewSubmit} style={{ marginTop: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                How well did you recall/solve this problem?
              </label>

              {/* Minimalist Brutalist Radio Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', marginBottom: '1.5rem' }}>
                {[
                  { val: 0, label: 'AGAIN (0) - Forgot completely / failed to solve' },
                  { val: 1, label: 'HARD (1) - Solved with major hesitation/mistakes' },
                  { val: 2, label: 'GOOD (2) - Solved correctly with normal speed' },
                  { val: 3, label: 'EASY (3) - Solved instantly with clean logic' }
                ].map(item => (
                  <label
                    key={item.val}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem',
                      border: '2px solid var(--border-color)',
                      backgroundColor: reviewRating === item.val ? 'var(--bg-secondary)' : 'var(--bg-primary)',
                      fontWeight: reviewRating === item.val ? 'bold' : 'normal',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="rating"
                      value={item.val}
                      checked={reviewRating === item.val}
                      onChange={() => setReviewRating(item.val)}
                      style={{ marginRight: '12px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>

              <button
                type="submit"
                disabled={reviewRating === null || isSubmitting}
                className="btn btn-black"
                style={{ width: '100%', textTransform: 'uppercase' }}
              >
                {isSubmitting ? 'Logging Review...' : 'Submit Rating'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FLOATING TLDRAW SCRATCHPAD MODAL */}
      <ScratchpadModal
        isOpen={!!scratchpadProblem}
        problemId={scratchpadProblem?.id || ''}
        problemTitle={scratchpadProblem?.title || ''}
        onClose={() => setScratchpadProblem(null)}
        onSave={() => setScratchpadProblem(null)}
      />

      {/* STICKY FLOATING BRUTALIST BACK TO TOP BUTTON */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="btn btn-black"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            padding: '0.65rem 1rem',
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            border: '2px solid var(--border-color)',
            boxShadow: '4px 4px 0px 0px var(--shadow-color)',
            cursor: 'pointer',
          }}
        >
          [ ▲ BACK TO TOP ]
        </button>
      )}
    </div>
  );
}
