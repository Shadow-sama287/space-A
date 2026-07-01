'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { submitReview } from '../review/actions';

interface Problem {
  id: string;
  sheet: string;
  title: string;
  category: string;
  difficulty: string;
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
}

export default function ProblemsClient({ problems, userProgress }: ProblemsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Seeding state
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);

  // Filter states
  const [sheetFilter, setSheetFilter] = useState('striver_sde');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal state
  const [reviewProblem, setReviewProblem] = useState<Problem | null>(null);
  const [reviewRating, setReviewRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get progress mapping
  const progressMap = new Map<string, UserProblem>();
  userProgress.forEach(up => {
    progressMap.set(up.problem_id, up);
  });

  // Unique categories for filtering
  const categories = Array.from(new Set(problems.map(p => p.category)));

  // Available sheets (can be expanded dynamically)
  const availableSheets = [
    { id: 'striver_sde', label: 'Striver SDE Sheet' },
    { id: 'neetcode_150', label: 'NeetCode 150 (Future)' },
    { id: 'neetcode_100', label: 'NeetCode 100 (Future)' },
  ];

  // Run database seeding
  async function handleSeed() {
    setSeeding(true);
    setSeedResult(null);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSeedResult(`SUCCESS: Preseeded ${data.count} problems!`);
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
      await submitReview(reviewProblem.id, reviewRating);
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
    if (p.sheet !== sheetFilter) return false;

    // 2. Search query
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;

    // 3. Category Filter
    if (categoryFilter && p.category !== categoryFilter) return false;

    // 4. Status Filter
    if (statusFilter) {
      const prog = progressMap.get(p.id);
      const status = prog ? prog.status : 'unreviewed';
      if (statusFilter === 'unreviewed' && status !== 'unreviewed') return false;
      if (statusFilter === 'reviewing' && status !== 'reviewing') return false;
      if (statusFilter === 'mastered' && status !== 'mastered') return false;
    }

    return true;
  });

  return (
    <div>
      {/* SEED DATABASE CORNER BANNER */}
      {problems.length === 0 && (
        <div className="card" style={{ backgroundColor: 'var(--bg-secondary)', marginBottom: '2rem' }}>
          <h2 className="card-title">Database is empty</h2>
          <p className="mb-2">Your Supabase database has no problems loaded. Click below to seed the database with the Striver SDE sheet problems.</p>
          <button onClick={handleSeed} disabled={seeding} className="btn btn-black">
            {seeding ? 'SEEDING DATABASE...' : 'SEED STRIVER SDE SHEET'}
          </button>
          {seedResult && <div className="mt-2" style={{ fontWeight: 'bold' }}>{seedResult}</div>}
        </div>
      )}

      {/* FILTER CONTROL BAR */}
      {problems.length > 0 && (
        <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
          <div className="grid-3" style={{ gap: '1rem' }}>
            {/* Sheet Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Select Sheet
              </label>
              <select
                value={sheetFilter}
                onChange={(e) => setSheetFilter(e.target.value)}
                className="input"
                style={{ height: '42px', padding: '0.4rem' }}
              >
                {availableSheets.map(s => (
                  <option key={s.id} value={s.id} disabled={s.id !== 'striver_sde'}>
                    {s.label}
                  </option>
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

            {/* Category Dropdown */}
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

            {/* Status Dropdown */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input"
                style={{ height: '42px', padding: '0.4rem' }}
              >
                <option value="">ALL STATUSES</option>
                <option value="unreviewed">UNREVIEWED</option>
                <option value="reviewing">REVIEWING</option>
                <option value="mastered">MASTERED</option>
              </select>
            </div>
          </div>

          <div className="flex-between mt-2" style={{ fontSize: '0.8rem' }}>
            <div>
              SHOWING <strong>{filteredProblems.length}</strong> OF <strong>{problems.filter(p => p.sheet === sheetFilter).length}</strong> PROBLEMS
            </div>
            {/* Seed Trigger Option for Resetting/Seeding */}
            <button onClick={handleSeed} disabled={seeding} className="btn btn-outline btn-small" style={{ border: '1px solid var(--border-color)', boxShadow: 'none' }}>
              {seeding ? 'Seeding...' : 'Reload/Seed Data'}
            </button>
          </div>
          {seedResult && <div className="mt-1" style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>{seedResult}</div>}
        </div>
      )}

      {/* PROBLEMS LIST */}
      {filteredProblems.length > 0 ? (
        <div className="card problem-table-container" style={{ padding: '0px' }}>
          <table className="problem-table" style={{ margin: '0px' }}>
            <thead>
              <tr>
                <th>Topic</th>
                <th>Problem Title</th>
                <th style={{ width: '100px' }}>Difficulty</th>
                <th style={{ width: '120px' }}>Status</th>
                <th style={{ width: '220px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.map(p => {
                const prog = progressMap.get(p.id);
                const status = prog ? prog.status : 'unreviewed';
                
                let statusColor = 'var(--text-secondary)';
                if (status === 'reviewing') statusColor = 'var(--text-primary)';
                if (status === 'mastered') statusColor = 'var(--text-primary)';

                return (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.85rem' }}>
                      {p.category}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.95rem' }}>{p.title}</span>
                    </td>
                    <td>
                      <span className={`badge-difficulty badge-${p.difficulty.toLowerCase()}`}>
                        {p.difficulty}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', color: statusColor }}>
                      {status === 'unreviewed' && '[ ] UNREVIEWED'}
                      {status === 'reviewing' && `[*] D:${prog?.interval_days}d (EF:${prog?.ease_factor})`}
                      {status === 'mastered' && `[M] MASTERED`}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
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

            <form onSubmit={handleReviewSubmit}>
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
    </div>
  );
}
