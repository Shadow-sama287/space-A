'use client';

import React, { useState } from 'react';

export interface DemoProblem {
  id: string;
  user_problem_id: string;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  leetcode_url: string;
  interval_days: number;
  ease_factor: number;
  repetitions: number;
}

const MOCK_PROBLEMS: DemoProblem[] = [
  {
    id: 'p1',
    user_problem_id: 'up1',
    title: 'Set Matrix Zeroes',
    category: 'Arrays & Hashing',
    difficulty: 'Medium',
    leetcode_url: 'https://leetcode.com/problems/set-matrix-zeroes/',
    interval_days: 1,
    ease_factor: 2.5,
    repetitions: 1,
  },
  {
    id: 'p2',
    user_problem_id: 'up2',
    title: '3Sum',
    category: 'Two Pointers',
    difficulty: 'Medium',
    leetcode_url: 'https://leetcode.com/problems/3sum/',
    interval_days: 4,
    ease_factor: 2.6,
    repetitions: 2,
  },
  {
    id: 'p3',
    user_problem_id: 'up3',
    title: 'Trapping Rain Water',
    category: 'Two Pointers',
    difficulty: 'Hard',
    leetcode_url: 'https://leetcode.com/problems/trapping-rain-water/',
    interval_days: 0,
    ease_factor: 2.3,
    repetitions: 0,
  },
  {
    id: 'p4',
    user_problem_id: 'up4',
    title: 'Valid Anagram',
    category: 'Arrays & Hashing',
    difficulty: 'Easy',
    leetcode_url: 'https://leetcode.com/problems/valid-anagram/',
    interval_days: 12,
    ease_factor: 2.8,
    repetitions: 3,
  },
  {
    id: 'p5',
    user_problem_id: 'up5',
    title: 'Binary Tree Level Order Traversal',
    category: 'Trees',
    difficulty: 'Medium',
    leetcode_url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
    interval_days: 2,
    ease_factor: 2.4,
    repetitions: 1,
  },
];

const PREDICTED_INTERVALS: Record<number, { label: string; days: string }> = {
  0: { label: 'AGAIN', days: '+1d' },
  1: { label: 'HARD', days: '+3d' },
  2: { label: 'GOOD', days: '+7d' },
  3: { label: 'EASY', days: '+14d' },
};

/* =========================================================================
   HYBRID VARIANT 1: "SLIDE-OVER DRAWER SIDEBAR + FLOATING GRADE DOCK"
   ========================================================================= */
export function DesignADemo() {
  const [problems] = useState<DemoProblem[]>(MOCK_PROBLEMS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [search, setSearch] = useState('');
  const [diffFilter, setDiffFilter] = useState<string>('ALL');
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [showGrading, setShowGrading] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const current = problems[currentIndex];

  const filteredProblems = problems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchesDiff = diffFilter === 'ALL' || p.difficulty.toUpperCase() === diffFilter;
    return matchesSearch && matchesDiff;
  });

  const handleSave = () => {
    if (selectedGrade === null) return;
    const gradeLabel = PREDICTED_INTERVALS[selectedGrade].label;
    setSavedNotice(`Review Saved: "${current.title}" graded as ${gradeLabel} (${PREDICTED_INTERVALS[selectedGrade].days})`);
    setSelectedGrade(null);
    setShowGrading(false);
    if (currentIndex < problems.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
    setTimeout(() => setSavedNotice(null), 4000);
  };

  return (
    <div style={{ border: '3px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', padding: '1.25rem', boxShadow: '6px 6px 0px var(--shadow-color)', position: 'relative', overflow: 'hidden' }}>
      {/* HEADER BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <div>
          <span style={{ fontSize: '0.7rem', fontWeight: 900, fontFamily: 'monospace', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
            HYBRID VARIANT 1
          </span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>
            Slide-Over Sidebar Drawer & Floating Grade Dock
          </h3>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="btn btn-black"
          style={{ textTransform: 'uppercase', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <span>{isSidebarOpen ? '◀ HIDE SIDEBAR' : '▶ 📁 OPEN QUEUE SIDEBAR'}</span>
          <span style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', padding: '0.15rem 0.4rem', fontSize: '0.7rem' }}>
            {problems.length} DUE
          </span>
        </button>
      </div>

      {savedNotice && (
        <div style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)', fontWeight: 900, fontFamily: 'monospace', fontSize: '0.8rem', border: '2px solid var(--border-color)' }}>
          ✓ {savedNotice}
        </div>
      )}

      {/* MAIN CONTAINER WITH SLIDE-OVER SIDEBAR */}
      <div style={{ display: 'flex', gap: '1.25rem', position: 'relative', minHeight: '480px' }}>
        {/* SLIDE-OVER SIDEBAR PANEL */}
        {isSidebarOpen && (
          <div
            style={{
              width: '300px',
              flexShrink: 0,
              border: '3px solid var(--border-color)',
              backgroundColor: 'var(--bg-secondary)',
              padding: '1rem',
              boxShadow: '4px 4px 0px var(--shadow-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <span style={{ fontWeight: 900, fontFamily: 'monospace', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                QUEUE SIDEBAR ({problems.length})
              </span>
              <button onClick={() => setIsSidebarOpen(false)} className="btn btn-small" style={{ fontSize: '0.65rem', padding: '0.2rem 0.4rem' }}>
                [X]
              </button>
            </div>

            {/* SEARCH INPUT */}
            <input
              type="text"
              placeholder="Search due queue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0.45rem', border: '2px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-primary)' }}
            />

            {/* DIFFICULTY FILTER TABS */}
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {['ALL', 'EASY', 'MEDIUM', 'HARD'].map((df) => (
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

            {/* SCROLLABLE QUEUE LIST */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', overflowY: 'auto', maxHeight: '320px', paddingRight: '0.25rem' }}>
              {filteredProblems.map((p) => {
                const originalIdx = problems.findIndex((item) => item.id === p.id);
                const isActive = originalIdx === currentIndex;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setCurrentIndex(originalIdx);
                      setSelectedGrade(null);
                    }}
                    style={{
                      padding: '0.5rem',
                      border: '2px solid var(--border-color)',
                      backgroundColor: isActive ? 'var(--text-primary)' : 'var(--bg-primary)',
                      color: isActive ? 'var(--bg-primary)' : 'var(--text-primary)',
                      cursor: 'pointer',
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold' }}>
                      <span>#{originalIdx + 1} {p.title}</span>
                      <span className={`badge-difficulty badge-${p.difficulty.toLowerCase()}`} style={{ fontSize: '0.6rem' }}>
                        {p.difficulty}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.65rem', opacity: 0.8, marginTop: '2px' }}>
                      {p.category} • Reps: {p.repetitions}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MAIN FLASHCARD STAGE */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="flashcard" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="flex-between" style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 900, fontFamily: 'monospace', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                  PROBLEM {currentIndex + 1} OF {problems.length} • {current.category}
                </span>
                <span className={`badge-difficulty badge-${current.difficulty.toLowerCase()}`}>
                  {current.difficulty}
                </span>
              </div>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                {current.title}
              </h2>

              <div style={{ border: '1px solid var(--border-color)', padding: '0.4rem 0.6rem', backgroundColor: 'var(--bg-secondary)', fontSize: '0.75rem', fontFamily: 'monospace', marginBottom: '1rem' }}>
                STATS: Reps: {current.repetitions} | EF: {current.ease_factor} | Last Interval: {current.interval_days}d
              </div>

              <a href={current.leetcode_url} target="_blank" rel="noreferrer" className="btn" style={{ width: '100%', textTransform: 'uppercase', textAlign: 'center', marginBottom: '1rem' }}>
                Solve on LeetCode ↗
              </a>
            </div>

            {/* TWO-STEP SAFE GRADING DOCK */}
            <div>
              {!showGrading ? (
                <button onClick={() => setShowGrading(true)} className="btn btn-black" style={{ width: '100%', textTransform: 'uppercase' }}>
                  SHOW GRADING OPTIONS
                </button>
              ) : (
                <div style={{ border: '2px solid var(--border-color)', padding: '0.85rem', backgroundColor: 'var(--bg-secondary)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 900, fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    1. SELECT GRADE & 2. SAVE:
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem', marginBottom: '0.75rem' }}>
                    {[0, 1, 2, 3].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setSelectedGrade(g)}
                        style={{
                          padding: '0.5rem 0.2rem',
                          fontFamily: 'monospace',
                          fontSize: '0.7rem',
                          fontWeight: 900,
                          border: selectedGrade === g ? '3px solid var(--text-primary)' : '1.5px solid var(--border-color)',
                          backgroundColor: selectedGrade === g ? 'var(--text-primary)' : 'var(--bg-primary)',
                          color: selectedGrade === g ? 'var(--bg-primary)' : 'var(--text-primary)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                      >
                        <span>{PREDICTED_INTERVALS[g].label}</span>
                        <span style={{ fontSize: '0.6rem', opacity: 0.85 }}>{PREDICTED_INTERVALS[g].days}</span>
                      </button>
                    ))}
                  </div>

                  {selectedGrade !== null ? (
                    <button
                      onClick={handleSave}
                      className="btn btn-black"
                      style={{ width: '100%', textTransform: 'uppercase', padding: '0.6rem', fontSize: '0.85rem' }}
                    >
                      ✓ SUBMIT & SAVE REVIEW [ENTER]
                    </button>
                  ) : (
                    <div style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: 'var(--text-secondary)', textAlign: 'center', fontStyle: 'italic' }}>
                      Click a grade button above to select grade
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   HYBRID VARIANT 2: "PUSH-GRID SIDEBAR + INSPECTION STAGE"
   ========================================================================= */
export function DesignBDemo() {
  const [problems] = useState<DemoProblem[]>(MOCK_PROBLEMS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [showGrading, setShowGrading] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const current = problems[currentIndex];

  const handleSave = () => {
    if (selectedGrade === null) return;
    const gradeLabel = PREDICTED_INTERVALS[selectedGrade].label;
    setSavedNotice(`Saved: "${current.title}" -> ${gradeLabel}`);
    setSelectedGrade(null);
    setShowGrading(false);
    if (currentIndex < problems.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
    setTimeout(() => setSavedNotice(null), 4000);
  };

  return (
    <div style={{ border: '3px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', padding: '1.25rem', boxShadow: '6px 6px 0px var(--shadow-color)' }}>
      {/* HEADER WITH TOGGLE */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.7rem', fontWeight: 900, fontFamily: 'monospace', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
            HYBRID VARIANT 2
          </span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>
            Push-Grid Sidebar & Detailed Inspection Stage
          </h3>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="btn"
          style={{ textTransform: 'uppercase', fontSize: '0.75rem', border: '2px solid var(--border-color)', fontWeight: 900 }}
        >
          {isSidebarOpen ? 'COLLAPSE SIDEBAR ◀' : 'EXPAND SIDEBAR QUEUE ▶'}
        </button>
      </div>

      {savedNotice && (
        <div style={{ padding: '0.5rem', marginBottom: '1rem', backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)', fontWeight: 900, fontFamily: 'monospace', fontSize: '0.75rem' }}>
          ✓ {savedNotice}
        </div>
      )}

      {/* PUSH GRID LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: isSidebarOpen ? '280px 1fr' : '1fr', gap: '1.25rem', transition: 'all 0.2s ease' }}>
        {/* PUSH SIDEBAR */}
        {isSidebarOpen && (
          <div style={{ border: '2px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ fontWeight: 900, fontFamily: 'monospace', textTransform: 'uppercase', fontSize: '0.75rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.4rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>DUE QUEUE</span>
              <span>{currentIndex + 1}/{problems.length}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {problems.map((p, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setSelectedGrade(null);
                    }}
                    style={{
                      padding: '0.5rem',
                      border: '2px solid var(--border-color)',
                      backgroundColor: isActive ? 'var(--text-primary)' : 'var(--bg-primary)',
                      color: isActive ? 'var(--bg-primary)' : 'var(--text-primary)',
                      cursor: 'pointer',
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                    }}
                  >
                    <div style={{ fontWeight: 900, display: 'flex', justifyContent: 'space-between' }}>
                      <span>#{idx + 1} {p.title}</span>
                    </div>
                    <div style={{ fontSize: '0.65rem', opacity: 0.85, marginTop: '2px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{p.category}</span>
                      <span>{p.difficulty}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MAIN STAGE */}
        <div style={{ border: '2px solid var(--border-color)', padding: '1rem', backgroundColor: 'var(--bg-primary)' }}>
          <div className="flex-between" style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontWeight: 900, fontFamily: 'monospace', textTransform: 'uppercase', fontSize: '0.8rem' }}>
              PROBLEM #{currentIndex + 1}: {current.category}
            </span>
            <span className={`badge-difficulty badge-${current.difficulty.toLowerCase()}`}>
              {current.difficulty}
            </span>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            {current.title}
          </h2>

          <a href={current.leetcode_url} target="_blank" rel="noreferrer" className="btn" style={{ width: '100%', textTransform: 'uppercase', textAlign: 'center', marginBottom: '1rem' }}>
            Solve on LeetCode ↗
          </a>

          {!showGrading ? (
            <button onClick={() => setShowGrading(true)} className="btn btn-black" style={{ width: '100%', textTransform: 'uppercase' }}>
              SHOW GRADING OPTIONS
            </button>
          ) : (
            <div style={{ border: '2px solid var(--border-color)', padding: '0.85rem', backgroundColor: 'var(--bg-secondary)' }}>
              <div style={{ fontWeight: 900, fontFamily: 'monospace', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                SELECT GRADE RATING:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem', marginBottom: '0.75rem' }}>
                {[0, 1, 2, 3].map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGrade(g)}
                    style={{
                      padding: '0.5rem 0.2rem',
                      fontFamily: 'monospace',
                      fontSize: '0.7rem',
                      fontWeight: 900,
                      border: selectedGrade === g ? '3px solid var(--text-primary)' : '1.5px solid var(--border-color)',
                      backgroundColor: selectedGrade === g ? 'var(--text-primary)' : 'var(--bg-primary)',
                      color: selectedGrade === g ? 'var(--bg-primary)' : 'var(--text-primary)',
                      cursor: 'pointer',
                    }}
                  >
                    <div>{PREDICTED_INTERVALS[g].label}</div>
                    <div style={{ fontSize: '0.6rem', opacity: 0.8 }}>{PREDICTED_INTERVALS[g].days}</div>
                  </button>
                ))}
              </div>

              <button
                disabled={selectedGrade === null}
                onClick={handleSave}
                className="btn btn-black"
                style={{ width: '100%', textTransform: 'uppercase', opacity: selectedGrade === null ? 0.4 : 1 }}
              >
                {selectedGrade !== null ? `✓ CONFIRM & SAVE (${PREDICTED_INTERVALS[selectedGrade].label})` : 'SELECT A GRADE ABOVE'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   HYBRID VARIANT 3: "COMMAND RAIL SIDEBAR + DECK CARD"
   ========================================================================= */
export function DesignCDemo() {
  const [problems] = useState<DemoProblem[]>(MOCK_PROBLEMS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRailOpen, setIsRailOpen] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [showGrading, setShowGrading] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const current = problems[currentIndex];

  const handleSave = () => {
    if (selectedGrade === null) return;
    const gradeLabel = PREDICTED_INTERVALS[selectedGrade].label;
    setSavedNotice(`Saved: "${current.title}" -> ${gradeLabel}`);
    setSelectedGrade(null);
    setShowGrading(false);
    if (currentIndex < problems.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
    setTimeout(() => setSavedNotice(null), 4000);
  };

  return (
    <div style={{ border: '3px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', padding: '1.25rem', boxShadow: '6px 6px 0px var(--shadow-color)' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.7rem', fontWeight: 900, fontFamily: 'monospace', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
            HYBRID VARIANT 3
          </span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>
            Command Rail Sidebar & Deck Card
          </h3>
        </div>
        <button
          onClick={() => setIsRailOpen(!isRailOpen)}
          className="btn btn-black"
          style={{ textTransform: 'uppercase', fontSize: '0.75rem' }}
        >
          {isRailOpen ? '⚡ CLOSE RAIL' : '⚡ OPEN COMMAND RAIL QUEUE'}
        </button>
      </div>

      {savedNotice && (
        <div style={{ padding: '0.5rem', marginBottom: '1rem', backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)', fontWeight: 900, fontFamily: 'monospace', fontSize: '0.75rem' }}>
          ✓ {savedNotice}
        </div>
      )}

      <div style={{ display: 'flex', gap: '1.25rem' }}>
        {/* COMMAND RAIL SIDEBAR */}
        {isRailOpen && (
          <div style={{ width: '260px', flexShrink: 0, border: '2px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ fontWeight: 900, fontFamily: 'monospace', fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.4rem' }}>
              ⚡ QUICK COMMAND RAIL
            </div>

            {/* KEYBOARD SHORTCUTS REFERENCE BOX */}
            <div style={{ border: '1px solid var(--border-color)', padding: '0.5rem', backgroundColor: 'var(--bg-primary)', fontSize: '0.65rem', fontFamily: 'monospace' }}>
              <div style={{ fontWeight: 900, marginBottom: '2px', textTransform: 'uppercase' }}>SHORTCUTS:</div>
              <div>[1-4] Grade rating</div>
              <div>[ENTER] Submit review</div>
              <div>[Q] Toggle queue rail</div>
            </div>

            <div style={{ fontWeight: 900, fontFamily: 'monospace', fontSize: '0.7rem', textTransform: 'uppercase' }}>
              DUE PROBLEMS ({problems.length}):
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {problems.map((p, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setSelectedGrade(null);
                    }}
                    style={{
                      textAlign: 'left',
                      padding: '0.45rem',
                      fontFamily: 'monospace',
                      fontSize: '0.7rem',
                      fontWeight: 900,
                      border: '1.5px solid var(--border-color)',
                      backgroundColor: isActive ? 'var(--text-primary)' : 'var(--bg-primary)',
                      color: isActive ? 'var(--bg-primary)' : 'var(--text-primary)',
                      cursor: 'pointer',
                    }}
                  >
                    #{idx + 1} {p.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* CENTER DECK CARD */}
        <div style={{ flex: 1 }} className="flashcard">
          <div className="flex-between" style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontWeight: 900, fontFamily: 'monospace', textTransform: 'uppercase', fontSize: '0.8rem' }}>
              {current.category}
            </span>
            <span className={`badge-difficulty badge-${current.difficulty.toLowerCase()}`}>
              {current.difficulty}
            </span>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            {current.title}
          </h2>

          <a href={current.leetcode_url} target="_blank" rel="noreferrer" className="btn" style={{ width: '100%', textTransform: 'uppercase', textAlign: 'center', marginBottom: '1rem' }}>
            Solve on LeetCode ↗
          </a>

          {!showGrading ? (
            <button onClick={() => setShowGrading(true)} className="btn btn-black" style={{ width: '100%', textTransform: 'uppercase' }}>
              SHOW GRADING OPTIONS
            </button>
          ) : (
            <div style={{ border: '2px solid var(--border-color)', padding: '1rem', backgroundColor: 'var(--bg-secondary)' }}>
              <div style={{ fontWeight: 900, fontFamily: 'monospace', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                SELECT GRADE & SAVE:
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {[0, 1, 2, 3].map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGrade(g)}
                    style={{
                      padding: '0.5rem 0.2rem',
                      fontFamily: 'monospace',
                      fontSize: '0.7rem',
                      fontWeight: 900,
                      border: selectedGrade === g ? '3px solid var(--text-primary)' : '2px solid var(--border-color)',
                      backgroundColor: selectedGrade === g ? 'var(--text-primary)' : 'var(--bg-primary)',
                      color: selectedGrade === g ? 'var(--bg-primary)' : 'var(--text-primary)',
                      cursor: 'pointer',
                    }}
                  >
                    <div>{PREDICTED_INTERVALS[g].label}</div>
                    <div style={{ fontSize: '0.65rem', opacity: 0.8 }}>{PREDICTED_INTERVALS[g].days}</div>
                  </button>
                ))}
              </div>

              <button
                disabled={selectedGrade === null}
                onClick={handleSave}
                className="btn btn-black"
                style={{ width: '100%', textTransform: 'uppercase', opacity: selectedGrade === null ? 0.4 : 1 }}
              >
                {selectedGrade !== null ? `✓ SAVE REVIEW (${PREDICTED_INTERVALS[selectedGrade].label})` : 'SELECT GRADE FIRST'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
