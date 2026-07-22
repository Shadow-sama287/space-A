'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { submitReview } from './actions';

import { coolOffProblemAction } from '@/app/actions/cool-off-actions';
import ActiveRecallWidget from '@/components/ActiveRecallWidget';

interface DueProblem {
  id: string;
  user_problem_id: string;
  title: string;
  category: string;
  difficulty: string;
  leetcode_url: string;
  ninja_url: string | null;
  interval_days: number;
  ease_factor: number;
  repetitions: number;
}

interface ReviewClientProps {
  initialDueProblems: DueProblem[];
}

export default function ReviewClient({ initialDueProblems }: ReviewClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [problems, setProblems] = useState<DueProblem[]>(initialDueProblems);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showGrading, setShowGrading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasDue = problems.length > 0 && currentIndex < problems.length;
  const currentProblem = hasDue ? problems[currentIndex] : null;

  async function handleGrade(rating: number) {
    if (!currentProblem) return;
    setIsSubmitting(true);

    try {
      const d = new Date();
      const localDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      await submitReview(currentProblem.id, rating, localDateStr);
      
      // Update states
      setShowGrading(false);
      setCurrentIndex(prev => prev + 1);
      
      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      alert(`Failed to save review: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCoolOff() {
    if (!currentProblem) return;
    setIsSubmitting(true);
    try {
      const res = await coolOffProblemAction(currentProblem.id);
      if (res.success) {
        setShowGrading(false);
        setCurrentIndex(prev => prev + 1);
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

  if (!hasDue) {
    return (
      <div className="card text-center" style={{ padding: '3rem 1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1rem' }}>
          Queue Clear
        </h2>
        <p className="mb-3" style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
          All reviews completed for today. You are fully up to date!
        </p>
        <Link href="/problems" className="btn btn-black" style={{ textTransform: 'uppercase' }}>
          Browse & Solve Random Problems
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      {/* PROGRESS TRACKER */}
      <div className="flex-between mb-1" style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
        <span style={{ textTransform: 'uppercase' }}>
          Active Session
        </span>
        <span>
          PROBLEM {currentIndex + 1} OF {problems.length} DUE
        </span>
      </div>
      
      {/* MINI PROGRESS BAR */}
      <div className="progress-bar-container mb-3" style={{ height: '10px' }}>
        <div 
          className="progress-bar-fill" 
          style={{ width: `${((currentIndex) / problems.length) * 100}%` }}
        />
      </div>

      {/* FLASHCARD */}
      <div className="flashcard">
        <div>
          {/* HEADER DETAILS */}
          <div className="flex-between" style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
            <span style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.85rem' }}>
              {currentProblem?.category}
            </span>
            <span className={`badge-difficulty badge-${currentProblem?.difficulty.toLowerCase()}`}>
              {currentProblem?.difficulty}
            </span>
          </div>

          {/* PROBLEM TITLE */}
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: '1.2' }}>
            {currentProblem?.title}
          </h2>

          {/* PROBLEM STATS BOX */}
          <div className="mt-2" style={{ border: '1px solid var(--border-color)', padding: '0.5rem', backgroundColor: 'var(--bg-secondary)', fontSize: '0.75rem' }}>
            <span style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>Previous Stats:</span> Reps: {currentProblem?.repetitions} | Ease Factor: {currentProblem?.ease_factor} | Last Interval: {currentProblem?.interval_days}d
          </div>
        </div>

        <div className="flashcard-content">
          {/* LEETCODE LINK */}
          <div className="mb-3">
            <a
              href={currentProblem?.leetcode_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{ width: '100%', textTransform: 'uppercase', textAlign: 'center' }}
            >
              Solve on LeetCode ↗
            </a>
          </div>

          {/* ACTIVE RECALL & TLDRAW SCRATCHPAD WIDGET */}
          {currentProblem && (
            <ActiveRecallWidget
              problemId={currentProblem.id}
              problemTitle={currentProblem.title}
            />
          )}

          <div style={{ marginTop: '1.25rem' }}>
          {/* GRADING LOGIC */}
          {!showGrading ? (
            <button
              onClick={() => setShowGrading(true)}
              className="btn btn-black"
              style={{ width: '100%', textTransform: 'uppercase' }}
            >
              Show Grading Options
            </button>
          ) : (
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem', textAlign: 'center' }}>
                Grade your solving performance:
              </p>
              
              <div className="rating-bar">
                <button
                  disabled={isSubmitting}
                  onClick={() => handleGrade(0)}
                  className="btn btn-small"
                  style={{ textTransform: 'uppercase', fontSize: '0.75rem' }}
                >
                  Again (0)
                </button>
                <button
                  disabled={isSubmitting}
                  onClick={() => handleGrade(1)}
                  className="btn btn-small"
                  style={{ textTransform: 'uppercase', fontSize: '0.75rem' }}
                >
                  Hard (1)
                </button>
                <button
                  disabled={isSubmitting}
                  onClick={() => handleGrade(2)}
                  className="btn btn-small"
                  style={{ textTransform: 'uppercase', fontSize: '0.75rem' }}
                >
                  Good (2)
                </button>
                <button
                  disabled={isSubmitting}
                  onClick={() => handleGrade(3)}
                  className="btn btn-small btn-black"
                  style={{ textTransform: 'uppercase', fontSize: '0.75rem' }}
                >
                  Easy (3)
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <button
                  disabled={isSubmitting}
                  onClick={handleCoolOff}
                  title="Snooze this question for 3 days to recover with a fresh mind and break frustration"
                  className="btn btn-outline"
                  style={{
                    flex: 1,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    border: '2px solid var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
                    <circle cx="12" cy="12" r="9"/>
                    <polyline points="12 6 12 12 15 15"/>
                    <path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>
                  </svg>
                  [ SNOOZE ]
                </button>
                <button
                  onClick={() => setShowGrading(false)}
                  className="btn btn-outline"
                  style={{ flex: 1, fontSize: '0.75rem', textTransform: 'uppercase', border: 'none' }}
                >
                  [Hide Options]
                </button>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
