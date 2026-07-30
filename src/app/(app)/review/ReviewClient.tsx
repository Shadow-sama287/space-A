'use client';

import { useState, useTransition, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { submitReview } from './actions';

import { coolOffProblemAction } from '@/app/actions/cool-off-actions';
import ActiveRecallWidget from '@/components/ActiveRecallWidget';

import { predictAllIntervals } from '@/lib/scheduler';
import SpacedRepetitionModal from '@/components/SpacedRepetitionModal';

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
  stability?: number | null;
  difficulty_fsrs?: number | null;
  last_reviewed_at?: string | null;
}

interface ReviewClientProps {
  initialDueProblems: DueProblem[];
  algorithm?: 'sm2' | 'fsrs';
  targetRetention?: number;
}

export default function ReviewClient({
  initialDueProblems,
  algorithm = 'fsrs',
  targetRetention = 0.90,
}: ReviewClientProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [problems, setProblems] = useState<DueProblem[]>(initialDueProblems);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showGrading, setShowGrading] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Feature 1: Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Feature 2: Keyboard Shortcuts Modal State
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  // Sync state if initialDueProblems changes from server revalidation
  useEffect(() => {
    setProblems(initialDueProblems);
    setCurrentIndex(prev => (initialDueProblems.length > 0 && prev >= initialDueProblems.length ? initialDueProblems.length - 1 : prev));
  }, [initialDueProblems]);

  // Right Queue Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [diffFilter, setDiffFilter] = useState<'ALL' | 'EASY' | 'MEDIUM' | 'HARD'>('ALL');

  const [isSRModalOpen, setIsSRModalOpen] = useState(false);

  const hasDue = problems.length > 0 && currentIndex < problems.length;
  const currentProblem = hasDue ? problems[currentIndex] : null;

  // Trigger Toast Notification helper
  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  // Remove problem from active queue and advance index safely
  const removeProblemFromQueue = useCallback((problemId: string) => {
    setProblems(prev => {
      const nextList = prev.filter(p => p.id !== problemId);
      setCurrentIndex(currIdx => {
        if (nextList.length === 0) return 0;
        if (currIdx >= nextList.length) return nextList.length - 1;
        return currIdx;
      });
      return nextList;
    });
    setSelectedRating(null);
    setShowGrading(false);
  }, []);

  // Calculate real-time dynamic predicted next intervals for current problem
  const predictedIntervals = currentProblem
    ? predictAllIntervals({
        algorithm,
        targetRetention,
        currentInterval: currentProblem.interval_days || 0,
        currentEF: currentProblem.ease_factor || 2.5,
        currentReps: currentProblem.repetitions || 0,
        stability: currentProblem.stability,
        difficulty: currentProblem.difficulty_fsrs,
        lastReviewedAt: currentProblem.last_reviewed_at,
      })
    : { 0: 1, 1: 3, 2: 7, 3: 14 };

  const handleSaveReview = useCallback(async () => {
    if (!currentProblem || selectedRating === null || isSubmitting) return;
    setIsSubmitting(true);

    const problemIdToReview = currentProblem.id;
    const problemTitle = currentProblem.title;
    const ratingLabel = ['AGAIN', 'HARD', 'GOOD', 'EASY'][selectedRating];
    const nextDays = predictedIntervals[selectedRating as 0 | 1 | 2 | 3];

    try {
      const d = new Date();
      const localDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      await submitReview(problemIdToReview, selectedRating, localDateStr);
      
      // Instantly remove solved problem from local queue and update index
      removeProblemFromQueue(problemIdToReview);
      
      // Trigger Toast Banner
      triggerToast(`REVIEW SAVED: "${problemTitle}" -> ${ratingLabel} (+${nextDays}d)`);

      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      alert(`Failed to save review: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [currentProblem, selectedRating, isSubmitting, predictedIntervals, removeProblemFromQueue, triggerToast, router]);

  async function handleCoolOff() {
    if (!currentProblem || isSubmitting) return;
    setIsSubmitting(true);
    const problemIdToCool = currentProblem.id;
    const problemTitle = currentProblem.title;

    try {
      const res = await coolOffProblemAction(problemIdToCool);
      if (res.success) {
        removeProblemFromQueue(problemIdToCool);
        triggerToast(`SNOOZED: "${problemTitle}" snoozed for 3 days`);
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

  // Keyboard Shortcuts (1-4 select rating, Enter submits, Q toggles sidebar, S snoozes, Esc closes)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === '1') {
        setShowGrading(true);
        setSelectedRating(0);
      } else if (e.key === '2') {
        setShowGrading(true);
        setSelectedRating(1);
      } else if (e.key === '3') {
        setShowGrading(true);
        setSelectedRating(2);
      } else if (e.key === '4') {
        setShowGrading(true);
        setSelectedRating(3);
      } else if (e.key === 'Enter' && selectedRating !== null) {
        e.preventDefault();
        handleSaveReview();
      } else if (e.key === 'q' || e.key === 'Q') {
        setIsSidebarOpen(prev => !prev);
      } else if (e.key === 's' || e.key === 'S') {
        if (showGrading) handleCoolOff();
      } else if (e.key === 'Escape') {
        setSelectedRating(null);
        setIsShortcutsModalOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedRating, showGrading, handleSaveReview]);

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

  // Filter due problems for the sidebar queue
  const filteredProblems = problems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiff = diffFilter === 'ALL' || p.difficulty.toUpperCase() === diffFilter;
    return matchesSearch && matchesDiff;
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        border: '3px solid var(--border-color)',
        backgroundColor: 'var(--bg-primary)',
        boxShadow: '6px 6px 0px 0px var(--shadow-color)',
      }}
    >
      {/* TOP SESSION HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.75rem 1.25rem',
          borderBottom: '2px solid var(--border-color)',
          backgroundColor: 'var(--bg-secondary)',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontWeight: 900, fontSize: '0.85rem', fontFamily: 'monospace', textTransform: 'uppercase' }}>
            ACTIVE SESSION
          </span>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.2rem 0.5rem',
              backgroundColor: 'var(--text-primary)',
              color: 'var(--bg-primary)',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              fontWeight: 900,
              border: '1px solid var(--border-color)',
              textTransform: 'uppercase',
            }}
          >
            <div style={{ width: '6px', height: '6px', backgroundColor: 'var(--bg-primary)', borderRadius: '50%', animation: 'blink 1.5s infinite' }}></div>
            {algorithm === 'fsrs' ? `FSRS-V5 (${Math.round(targetRetention * 100)}%)` : 'SM-2 CLASSIC'}
          </div>
          <button 
            onClick={() => setIsSRModalOpen(true)} 
            className="btn btn-small" 
            style={{ padding: '0.1rem 0.45rem', minWidth: '24px', fontSize: '0.75rem' }}
            title="Spaced Repetition Algorithm Guide"
          >
            ?
          </button>

          {/* FEATURE 2: KEYBOARD SHORTCUTS REFERENCE PILL */}
          <button
            onClick={() => setIsShortcutsModalOpen(true)}
            className="btn btn-small"
            style={{
              padding: '0.2rem 0.5rem',
              fontSize: '0.75rem',
              fontWeight: 900,
              fontFamily: 'monospace',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-primary)',
            }}
            title="View Keyboard Shortcuts Cheatsheet"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
              <rect x="2" y="4" width="20" height="16" rx="0" ry="0" />
              <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M8 16h8" />
            </svg>
            <span>SHORTCUTS</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontWeight: 900, fontSize: '0.8rem', fontFamily: 'monospace' }}>
            PROBLEM {currentIndex + 1} OF {problems.length} DUE
          </span>

          {/* POLISHED BRUTALIST SIDEBAR TOGGLE BUTTON */}
          <button
            onClick={() => setIsSidebarOpen(prev => !prev)}
            className="btn btn-black"
            style={{
              fontSize: '0.75rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              padding: '0.35rem 0.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              letterSpacing: '0.3px',
            }}
            title="Toggle Right Queue Sidebar (Shortcut: Q)"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
              <rect x="3" y="3" width="18" height="18" rx="0" ry="0" />
              <line x1="15" y1="3" x2="15" y2="21" />
            </svg>
            <span>{isSidebarOpen ? 'COLLAPSE QUEUE' : 'EXPAND QUEUE'}</span>
            <span
              style={{
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                padding: '0.1rem 0.4rem',
                fontSize: '0.65rem',
                fontWeight: 900,
                border: '1px solid var(--border-color)',
              }}
            >
              {problems.length} DUE
            </span>
          </button>
        </div>
      </div>

      {/* TOP DIFFICULTY GAUGE BAR (EASY: 33%, MEDIUM: 66%, HARD: 100%) */}
      {(() => {
        const diff = currentProblem?.difficulty?.toLowerCase() || '';
        const fillWidth = diff === 'easy' ? '33.33%' : diff === 'medium' ? '66.66%' : diff === 'hard' ? '100%' : '0%';
        return (
          <div
            style={{ height: '6px', backgroundColor: 'var(--bg-secondary)', borderBottom: '2px solid var(--border-color)' }}
            title={`Difficulty Gauge: ${currentProblem?.difficulty || 'N/A'}`}
          >
            <div 
              style={{ height: '100%', backgroundColor: 'var(--text-primary)', width: fillWidth, transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
          </div>
        );
      })()}

      {/* HYBRID VARIANT 2: PUSH-GRID LAYOUT (MAIN STAGE LEFT, QUEUE SIDEBAR RIGHT) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isSidebarOpen ? '1fr 340px' : '1fr',
          gap: '1.25rem',
          padding: '1.25rem',
          transition: 'grid-template-columns 0.2s ease',
        }}
      >
        {/* LEFT MAIN FLASHCARD STAGE */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          
          {/* FEATURE 1: TOAST NOTIFICATION BANNER */}
          {toastMessage && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.65rem 0.85rem',
                marginBottom: '1rem',
                backgroundColor: 'var(--text-primary)',
                color: 'var(--bg-primary)',
                fontWeight: 900,
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                border: '2px solid var(--border-color)',
                boxShadow: '3px 3px 0px 0px var(--shadow-color)',
                animation: 'fadeIn 0.2s ease',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{toastMessage}</span>
            </div>
          )}

          {/* PROBLEM HEADER */}
          <div className="flex-between" style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.85rem', fontFamily: 'monospace' }}>
              {currentProblem?.category}
            </span>
            <span className={`badge-difficulty badge-${currentProblem?.difficulty.toLowerCase()}`}>
              {currentProblem?.difficulty}
            </span>
          </div>

          {/* PROBLEM TITLE */}
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: '1.25', marginBottom: '0.75rem' }}>
            {currentProblem?.title}
          </h2>

          {/* STATS STRIP */}
          <div style={{ border: '1px solid var(--border-color)', padding: '0.5rem 0.75rem', backgroundColor: 'var(--bg-secondary)', fontSize: '0.75rem', fontFamily: 'monospace', marginBottom: '1.25rem' }}>
            <span style={{ textTransform: 'uppercase', fontWeight: 900 }}>Previous Stats:</span> Reps: {currentProblem?.repetitions} | Ease Factor: {currentProblem?.ease_factor} | Last Interval: {currentProblem?.interval_days}d
          </div>

          {/* LEETCODE LINK WITH SVG ICON */}
          <div className="mb-3">
            <a
              href={currentProblem?.leetcode_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{
                width: '100%',
                textTransform: 'uppercase',
                textAlign: 'center',
                fontSize: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <span>Solve on LeetCode</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>

          {/* ACTIVE RECALL WIDGET */}
          {currentProblem && (
            <div style={{ marginBottom: '1.25rem' }}>
              <ActiveRecallWidget
                problemId={currentProblem.id}
                problemTitle={currentProblem.title}
              />
            </div>
          )}

          {/* SAFE TWO-STEP GRADING CONTAINER */}
          <div style={{ marginTop: '1rem' }}>
            {!showGrading ? (
              <button
                onClick={() => setShowGrading(true)}
                className="btn btn-black"
                style={{ width: '100%', textTransform: 'uppercase', padding: '0.75rem', fontSize: '0.9rem', letterSpacing: '0.5px' }}
              >
                SHOW GRADING OPTIONS
              </button>
            ) : (
              <div style={{ border: '2px solid var(--border-color)', padding: '1rem', backgroundColor: 'var(--bg-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', fontFamily: 'monospace' }}>
                    1. SELECT RATING (1-4) & 2. CONFIRM SAVE:
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSRModalOpen(true)}
                    title="Spaced Repetition Guide"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--text-primary)',
                      color: 'var(--bg-primary)',
                      border: '1.5px solid var(--border-color)',
                      fontWeight: 900,
                      fontSize: '0.7rem',
                      fontFamily: 'monospace',
                      cursor: 'pointer',
                    }}
                  >
                    ?
                  </button>
                </div>

                {/* 4 GRADE RATING BUTTONS (SELECTION ONLY) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  {[
                    { grade: 0, label: 'AGAIN', key: '1' },
                    { grade: 1, label: 'HARD', key: '2' },
                    { grade: 2, label: 'GOOD', key: '3' },
                    { grade: 3, label: 'EASY', key: '4' },
                  ].map(({ grade, label, key }) => {
                    const isSelected = selectedRating === grade;
                    const days = predictedIntervals[grade as 0 | 1 | 2 | 3];
                    return (
                      <button
                        key={grade}
                        type="button"
                        onClick={() => setSelectedRating(grade)}
                        style={{
                          padding: '0.55rem 0.2rem',
                          fontFamily: 'monospace',
                          fontSize: '0.75rem',
                          fontWeight: 900,
                          textTransform: 'uppercase',
                          border: isSelected ? '3px solid var(--text-primary)' : '2px solid var(--border-color)',
                          backgroundColor: isSelected ? 'var(--text-primary)' : 'var(--bg-primary)',
                          color: isSelected ? 'var(--bg-primary)' : 'var(--text-primary)',
                          boxShadow: isSelected ? '3px 3px 0px 0px var(--shadow-color)' : 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          transition: 'all 0.1s ease',
                        }}
                      >
                        <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>[{key}]</span>
                        <span style={{ fontWeight: 900 }}>{label}</span>
                        <span style={{ fontSize: '0.65rem', opacity: 0.85 }}>+{days}d</span>
                      </button>
                    );
                  })}
                </div>

                {/* DYNAMIC TWO-STEP SUBMIT & SAVE BUTTON */}
                {selectedRating !== null ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: 'var(--text-secondary)', textAlign: 'center' }}>
                      Selected: <strong>{['AGAIN', 'HARD', 'GOOD', 'EASY'][selectedRating]}</strong> (+{predictedIntervals[selectedRating as 0|1|2|3]}d interval). Press Enter or click below to save.
                    </div>
                    <button
                      disabled={isSubmitting}
                      onClick={handleSaveReview}
                      className="btn btn-black"
                      style={{ width: '100%', textTransform: 'uppercase', padding: '0.75rem', fontSize: '0.85rem', letterSpacing: '0.5px' }}
                    >
                      {isSubmitting ? 'SAVING REVIEW...' : 'SUBMIT & SAVE REVIEW [ENTER]'}
                    </button>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: 'var(--text-secondary)', textTransform: 'uppercase', textAlign: 'center', fontStyle: 'italic', padding: '0.2rem' }}>
                    Click a rating button or press [1-4] to select grade
                  </div>
                )}

                {/* SNOOZE / HIDE OPTIONS BAR */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                  <button
                    disabled={isSubmitting}
                    onClick={handleCoolOff}
                    title="Snooze this question for 3 days (Shortcut: S)"
                    className="btn btn-outline"
                    style={{
                      flex: 1,
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                      border: '2px solid var(--border-color)',
                      backgroundColor: 'var(--bg-primary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      padding: '0.35rem',
                    }}
                  >
                    [ SNOOZE (S) ]
                  </button>
                  <button
                    onClick={() => {
                      setShowGrading(false);
                      setSelectedRating(null);
                    }}
                    className="btn btn-outline"
                    style={{ flex: 1, fontSize: '0.7rem', textTransform: 'uppercase', border: 'none', padding: '0.35rem' }}
                  >
                    [Hide Options]
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT-SIDE QUEUE SIDEBAR */}
        {isSidebarOpen && (
          <div
            style={{
              border: '2px solid var(--border-color)',
              backgroundColor: 'var(--bg-secondary)',
              padding: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            {/* SIDEBAR HEADER */}
            <div style={{ paddingBottom: '0.5rem', borderBottom: '2px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 900, fontFamily: 'monospace', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                QUEUE SIDEBAR ({problems.length})
              </span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="btn btn-small"
                style={{ fontSize: '0.65rem', padding: '0.15rem 0.35rem' }}
              >
                [X]
              </button>
            </div>

            {/* SEARCH & FILTER CONTROLS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Search queue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.45rem 0.5rem',
                  border: '2px solid var(--border-color)',
                  backgroundColor: 'var(--bg-primary)',
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  color: 'var(--text-primary)',
                }}
              />

              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {(['ALL', 'EASY', 'MEDIUM', 'HARD'] as const).map((df) => (
                  <button
                    key={df}
                    onClick={() => setDiffFilter(df)}
                    style={{
                      flex: 1,
                      padding: '0.25rem 0',
                      fontFamily: 'monospace',
                      fontSize: '0.65rem',
                      fontWeight: 900,
                      border: diffFilter === df ? '2px solid var(--text-primary)' : '1px solid var(--border-color)',
                      backgroundColor: diffFilter === df ? 'var(--text-primary)' : 'var(--bg-primary)',
                      color: diffFilter === df ? 'var(--bg-primary)' : 'var(--text-primary)',
                      cursor: 'pointer',
                    }}
                  >
                    {df}
                  </button>
                ))}
              </div>
            </div>

            {/* QUEUE LIST CARDS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {filteredProblems.map((p) => {
                const originalIndex = problems.findIndex((item) => item.id === p.id);
                const isActive = originalIndex === currentIndex;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setCurrentIndex(originalIndex);
                      setSelectedRating(null);
                    }}
                    style={{
                      padding: '0.55rem',
                      border: '2px solid var(--border-color)',
                      backgroundColor: isActive ? 'var(--text-primary)' : 'var(--bg-primary)',
                      color: isActive ? 'var(--bg-primary)' : 'var(--text-primary)',
                      cursor: 'pointer',
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      transition: 'all 0.1s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 900 }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                        #{originalIndex + 1} {p.title}
                      </span>
                      <span className={`badge-difficulty badge-${p.difficulty.toLowerCase()}`} style={{ fontSize: '0.6rem', padding: '0.1rem 0.3rem' }}>
                        {p.difficulty}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.65rem', opacity: 0.85, marginTop: '3px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{p.category}</span>
                      <span>Reps: {p.repetitions}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* FEATURE 2: KEYBOARD SHORTCUTS CHEATSHEET MODAL */}
      {isShortcutsModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsShortcutsModalOpen(false);
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '520px',
              width: '100%',
              backgroundColor: 'var(--bg-primary)',
              border: '3px solid var(--border-color)',
              boxShadow: '8px 8px 0px 0px var(--shadow-color)',
              padding: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 900, fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                  SPACE A • REVIEW ENGINE
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, textTransform: 'uppercase', margin: '2px 0 0 0' }}>
                  KEYBOARD SHORTCUTS CHEATSHEET
                </h3>
              </div>
              <button onClick={() => setIsShortcutsModalOpen(false)} className="btn btn-black btn-small">
                [X]
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontFamily: 'monospace', fontSize: '0.8rem' }}>
              {[
                { key: '1', action: 'Select AGAIN rating (+1d)' },
                { key: '2', action: 'Select HARD rating (+3d)' },
                { key: '3', action: 'Select GOOD rating (+7d)' },
                { key: '4', action: 'Select EASY rating (+14d)' },
                { key: 'ENTER', action: 'Submit & Save selected review grade' },
                { key: 'Q', action: 'Toggle Right Queue Sidebar panel' },
                { key: 'S', action: 'Snooze / Cool-off problem for 3 days' },
                { key: 'ESC', action: 'Clear selection / Close active modal' },
              ].map(({ key, action }) => (
                <div
                  key={key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.45rem 0.65rem',
                    border: '1.5px solid var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)',
                  }}
                >
                  <span style={{ color: 'var(--text-primary)' }}>{action}</span>
                  <span
                    style={{
                      padding: '0.15rem 0.45rem',
                      backgroundColor: 'var(--text-primary)',
                      color: 'var(--bg-primary)',
                      fontWeight: 900,
                      fontSize: '0.75rem',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    {key}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SPACED REPETITION EXPLANATORY MODAL */}
      <SpacedRepetitionModal
        isOpen={isSRModalOpen}
        onClose={() => setIsSRModalOpen(false)}
        defaultTab={algorithm === 'fsrs' ? 'fsrs' : 'sm2'}
      />
    </div>
  );
}
