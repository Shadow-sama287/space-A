'use client';

import React, { useState, useEffect } from 'react';
import ScratchpadModal from './ScratchpadModal';

interface ActiveRecallWidgetProps {
  problemId: string;
  problemTitle: string;
}

const COMMON_PATTERNS = [
  'Two Pointers',
  'Sliding Window',
  'Monotonic Stack / Queue',
  'Binary Search on Answer',
  'Prefix Sum + Hashmap',
  'Dynamic Programming (1D/2D)',
  'Topological Sort / Kahn',
  'BFS / DFS Traversal',
  'Fast & Slow Pointers',
  'Union Find / Disjoint Set',
  'Backtracking / Recursion',
  'Heap / Priority Queue',
];

const COMPLEXITY_OPTIONS = ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)', 'O(N^2)', 'O(2^N)'];

const CORNER_CASES = [
  'Empty Input / Null',
  'Single Element',
  'Duplicates / Equal Values',
  'Negative Values',
  'Integer Overflow',
  'Cycles / Graph Loops',
];

export default function ActiveRecallWidget({ problemId, problemTitle }: ActiveRecallWidgetProps) {
  const [selectedPattern, setSelectedPattern] = useState<string>('');
  const [timeComplexity, setTimeComplexity] = useState<string>('');
  const [spaceComplexity, setSpaceComplexity] = useState<string>('');
  const [selectedCases, setSelectedCases] = useState<string[]>([]);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Load saved recall data for this problem
  useEffect(() => {
    if (!problemId) return;
    try {
      const saved = localStorage.getItem(`space_a_recall_${problemId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.selectedPattern) setSelectedPattern(parsed.selectedPattern);
        if (parsed.timeComplexity) setTimeComplexity(parsed.timeComplexity);
        if (parsed.spaceComplexity) setSpaceComplexity(parsed.spaceComplexity);
        if (parsed.selectedCases) setSelectedCases(parsed.selectedCases);
      }
    } catch (e) {
      console.error('Error loading recall data', e);
    }
  }, [problemId]);

  // Auto-save recall inputs to localStorage on change
  const saveRecallData = (
    pattern: string,
    tComp: string,
    sComp: string,
    cases: string[]
  ) => {
    try {
      const data = {
        selectedPattern: pattern,
        timeComplexity: tComp,
        spaceComplexity: sComp,
        selectedCases: cases,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(`space_a_recall_${problemId}`, JSON.stringify(data));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (e) {
      console.error('Error saving recall data', e);
    }
  };

  const handlePatternChange = (pat: string) => {
    setSelectedPattern(pat);
    saveRecallData(pat, timeComplexity, spaceComplexity, selectedCases);
  };

  const handleTimeCompChange = (tc: string) => {
    setTimeComplexity(tc);
    saveRecallData(selectedPattern, tc, spaceComplexity, selectedCases);
  };

  const handleSpaceCompChange = (sc: string) => {
    setSpaceComplexity(sc);
    saveRecallData(selectedPattern, timeComplexity, sc, selectedCases);
  };

  const toggleCornerCase = (cc: string) => {
    const updated = selectedCases.includes(cc)
      ? selectedCases.filter(c => c !== cc)
      : [...selectedCases, cc];
    setSelectedCases(updated);
    saveRecallData(selectedPattern, timeComplexity, spaceComplexity, updated);
  };

  return (
    <div
      style={{
        border: '3px solid var(--border-color, #000000)',
        backgroundColor: 'var(--bg-primary, #ffffff)',
        color: 'var(--text-primary, #000000)',
        padding: '1.25rem',
        marginTop: '1.25rem',
        boxShadow: '4px 4px 0px var(--shadow-color, #000000)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid var(--border-color, #000000)',
          paddingBottom: '0.5rem',
          marginBottom: '1rem',
          gap: '0.5rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: '0.95rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            ACTIVE RECALL & SOLUTION PREP
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #666)' }}>
            State pattern & complexity before viewing solution
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsScratchpadOpen(true)}
          className="btn btn-black"
          style={{
            fontSize: '0.75rem',
            padding: '0.4rem 0.85rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          OPEN SCRATCHPAD
        </button>
      </div>

      {/* PATTERN SELECTOR */}
      <div style={{ marginBottom: '1rem' }}>
        <label
          style={{
            display: 'block',
            fontSize: '0.75rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            marginBottom: '0.4rem',
          }}
        >
          CORE PROBLEM PATTERN:
        </label>
        <select
          value={selectedPattern}
          onChange={e => handlePatternChange(e.target.value)}
          style={{
            width: '100%',
            padding: '0.55rem',
            border: '2px solid var(--border-color, #000000)',
            fontWeight: 'bold',
            fontFamily: 'var(--font-mono, monospace)',
            backgroundColor: 'var(--bg-secondary, #f8f8f8)',
            color: 'var(--text-primary, #000000)',
            fontSize: '0.85rem',
            borderRadius: '0px',
            outline: 'none',
          }}
        >
          <option value="" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            -- Select or Identify Pattern --
          </option>
          {COMMON_PATTERNS.map(pat => (
            <option
              key={pat}
              value={pat}
              style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
            >
              {pat}
            </option>
          ))}
        </select>
      </div>

      {/* COMPLEXITY INPUTS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              marginBottom: '0.4rem',
            }}
          >
            TIME COMPLEXITY:
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
            {COMPLEXITY_OPTIONS.map(tc => {
              const isSelected = timeComplexity === tc;
              return (
                <button
                  type="button"
                  key={tc}
                  onClick={() => handleTimeCompChange(tc)}
                  style={{
                    padding: '2px 8px',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono, monospace)',
                    border: '2px solid var(--border-color, #000)',
                    backgroundColor: isSelected ? 'var(--text-primary, #000)' : 'var(--bg-primary, #fff)',
                    color: isSelected ? 'var(--bg-primary, #fff)' : 'var(--text-primary, #000)',
                    cursor: 'pointer',
                  }}
                >
                  {tc}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              marginBottom: '0.4rem',
            }}
          >
            SPACE COMPLEXITY:
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
            {COMPLEXITY_OPTIONS.map(sc => {
              const isSelected = spaceComplexity === sc;
              return (
                <button
                  type="button"
                  key={sc}
                  onClick={() => handleSpaceCompChange(sc)}
                  style={{
                    padding: '2px 8px',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono, monospace)',
                    border: '2px solid var(--border-color, #000)',
                    backgroundColor: isSelected ? 'var(--text-primary, #000)' : 'var(--bg-primary, #fff)',
                    color: isSelected ? 'var(--bg-primary, #fff)' : 'var(--text-primary, #000)',
                    cursor: 'pointer',
                  }}
                >
                  {sc}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CORNER CASES CHECKLIST */}
      <div>
        <label
          style={{
            display: 'block',
            fontSize: '0.75rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            marginBottom: '0.4rem',
          }}
        >
          CORNER CASES & EDGE TESTS:
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {CORNER_CASES.map(cc => {
            const isChecked = selectedCases.includes(cc);
            return (
              <button
                type="button"
                key={cc}
                onClick={() => toggleCornerCase(cc)}
                style={{
                  padding: '3px 8px',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  border: '2px solid var(--border-color, #000)',
                  backgroundColor: isChecked ? 'var(--text-primary, #000)' : 'var(--bg-primary, #fff)',
                  color: isChecked ? 'var(--bg-primary, #fff)' : 'var(--text-primary, #000)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{isChecked ? '[X]' : '[ ]'}</span>
                <span>{cc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {savedSuccess && (
        <div
          style={{
            marginTop: '0.75rem',
            fontSize: '0.7rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            color: 'var(--text-primary)',
          }}
        >
          [SAVED] Active Recall Progress Saved
        </div>
      )}

      {/* FLOATING TLDRAW SCRATCHPAD MODAL */}
      <ScratchpadModal
        isOpen={isScratchpadOpen}
        problemId={problemId}
        problemTitle={problemTitle}
        onClose={() => setIsScratchpadOpen(false)}
        onSave={() => setIsScratchpadOpen(false)}
      />
    </div>
  );
}
