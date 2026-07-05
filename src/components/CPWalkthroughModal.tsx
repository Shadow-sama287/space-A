'use client';

import { useState } from 'react';

interface CPWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'dsa_vs_cp' | 'roadmap' | 'milestones' | 'editorial' | 'resources';

export default function CPWalkthroughModal({ isOpen, onClose }: CPWalkthroughModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('dsa_vs_cp');

  if (!isOpen) return null;

  return (
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
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '850px',
          width: '100%',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--bg-primary)',
          border: '3px solid var(--border-color)',
          boxShadow: '8px 8px 0px 0px var(--shadow-color)',
          padding: '1.25rem',
          overflow: 'hidden',
        }}
      >
        {/* MODAL HEADER */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '2px solid var(--border-color)',
            paddingBottom: '0.75rem',
            marginBottom: '1rem',
          }}
        >
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 900, fontFamily: 'monospace', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              SPACE A • COMMUNITY ROADMAP
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase', margin: '4px 0 0 0' }}>
              COMPETITIVE PROGRAMMING GUIDE
            </h2>
          </div>

          <button
            onClick={onClose}
            className="btn btn-black btn-sm"
            style={{ padding: '0.35rem 0.65rem', fontFamily: 'monospace' }}
          >
            CLOSE [X]
          </button>
        </div>

        {/* INTERACTIVE NAVIGATION TABS */}
        <div style={{ display: 'flex', gap: '0.4rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {[
            { id: 'dsa_vs_cp', label: 'DSA VS CP' },
            { id: 'roadmap', label: 'STARTER ROADMAP' },
            { id: 'milestones', label: 'RATING MILESTONES' },
            { id: 'editorial', label: 'THINKING & EDITORIAL' },
            { id: 'resources', label: 'RESOURCES & CREDITS' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              style={{
                padding: '0.4rem 0.75rem',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                cursor: 'pointer',
                backgroundColor: activeTab === tab.id ? 'var(--text-primary)' : 'var(--bg-primary)',
                color: activeTab === tab.id ? 'var(--bg-primary)' : 'var(--text-primary)',
                border: '2px solid var(--border-color)',
                boxShadow: activeTab === tab.id ? '2px 2px 0px 0px var(--shadow-color)' : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENT SCROLL AREA */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: '1.5' }}>
          
          {/* TAB 1: DSA VS CP */}
          {activeTab === 'dsa_vs_cp' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ border: '2px solid var(--border-color)', padding: '1rem', backgroundColor: 'var(--bg-secondary)' }}>
                <h4 style={{ fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  What is the difference between Standard DSA and CP?
                </h4>
                <p style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  <strong>Standard DSA:</strong> Questions asked in Online Assessments (OAs) and Tech Interviews that fit well-known patterns (Arrays, DP, Graphs, Sliding Window). 90% of work is recognizing which pre-learned topic applies.
                </p>
                <p style={{ color: 'var(--text-primary)' }}>
                  <strong>Competitive Programming (CP):</strong> Time-bound contests with completely new, unseen problems. CP forces your brain to think in all directions without pattern memorization!
                </p>
              </div>

              <div style={{ border: '2px solid var(--border-color)', padding: '1rem', backgroundColor: 'var(--bg-primary)' }}>
                <h4 style={{ fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Why do CP if interview problems are different?
                </h4>
                <p style={{ color: 'var(--text-secondary)' }}>
                  <strong>To sharpen raw problem-solving logic.</strong> Tech stacks change, hiring processes shift, but pure logic remains constant. A strong CPer can break down a new problem in 10 minutes that takes non-CPers 2 hours!
                </p>
              </div>

              <div style={{ border: '2px solid var(--border-color)', padding: '1rem', backgroundColor: 'var(--bg-secondary)' }}>
                <h4 style={{ fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Should I focus on CP or Development?
                </h4>
                <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-primary)' }}>
                  <li><strong>Targeting job in 5-6 months with no prior DSA?</strong> Stick to standard DSA (Striver SDE / A2Z sheets).</li>
                  <li><strong>Have 1+ year or decent DSA baseline?</strong> Do CP without a doubt to easily clear hard OAs!</li>
                  <li><strong>CP Target:</strong> Aim for <em>Knight on LeetCode</em> or <em>Expert on Codeforces (1600+)</em>.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: STARTER ROADMAP */}
          {activeTab === 'roadmap' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ border: '2px solid var(--border-color)', padding: '1rem', backgroundColor: 'var(--bg-primary)' }}>
                <h4 style={{ fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Step 1: Learn C++ & Standard Template Library (STL)
                </h4>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  C++ is fast, intuitive, and standard for CP. Learn C++ fundamentals (10 days) and STL (vectors, sets, maps, priority queues - 10 days).
                </p>
              </div>

              <div style={{ border: '2px solid var(--border-color)', padding: '1rem', backgroundColor: 'var(--bg-secondary)' }}>
                <h4 style={{ fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Step 2: Basic Problem Writing & Warmup
                </h4>
                <p style={{ color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  Practice basic syntax and logic on CodeChef or Codeforces (15 days).
                </p>
              </div>

              <div style={{ border: '2px solid var(--border-color)', padding: '1rem', backgroundColor: 'var(--bg-primary)' }}>
                <h4 style={{ fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Step 3: Solve 50 Div3 and Div4 A Problems
                </h4>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Solve 50 Div 3/4 A problems on Codeforces to get comfortable with contest input/output formats and fast coding.
                </p>
              </div>

              <div style={{ border: '2px solid var(--border-color)', padding: '1rem', backgroundColor: 'var(--bg-secondary)' }}>
                <h4 style={{ fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Step 4: Start Giving Live Contests
                </h4>
                <p style={{ color: 'var(--text-primary)' }}>
                  Give every contest you can (Div 2, Div 3, Div 4, AtCoder Beginner Contests). Don't worry about initial ratings—focus on solving Div 2 A/B or Div 3 A/B/C!
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: RATING MILESTONES */}
          {activeTab === 'milestones' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ border: '2px solid var(--border-color)', padding: '1rem', backgroundColor: 'var(--bg-primary)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-secondary)' }}>RATING 800 - 1000</div>
                <h4 style={{ fontWeight: 900, textTransform: 'uppercase', margin: '4px 0' }}>Basic Implementation & STL</h4>
                <p style={{ color: 'var(--text-primary)' }}>
                  No fancy data structures needed! Master C++ STL (vectors, maps), basic loops, and condition logic. Solve TLE 31 (800-1000) rating problems.
                </p>
              </div>

              <div style={{ border: '2px solid var(--border-color)', padding: '1rem', backgroundColor: 'var(--bg-secondary)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-secondary)' }}>RATING 1000 - 1200</div>
                <h4 style={{ fontWeight: 900, textTransform: 'uppercase', margin: '4px 0' }}>Math & Two Pointers</h4>
                <p style={{ color: 'var(--text-primary)' }}>
                  Study Binary Search, Prefix Sums, Sliding Window, Modular Arithmetic, Exponentiation, Sieve of Eratosthenes, and Bitwise Operations.
                </p>
              </div>

              <div style={{ border: '2px solid var(--border-color)', padding: '1rem', backgroundColor: 'var(--bg-primary)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-secondary)' }}>RATING 1200 - 1400</div>
                <h4 style={{ fontWeight: 900, textTransform: 'uppercase', margin: '4px 0' }}>Binary Search on Answer & Graphs</h4>
                <p style={{ color: 'var(--text-primary)' }}>
                  Study Binary Search on answer spaces, Dynamic Programming basics, BFS/DFS, Line Sweep, and Difference Arrays.
                </p>
              </div>

              <div style={{ border: '2px solid var(--border-color)', padding: '1rem', backgroundColor: 'var(--bg-secondary)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-secondary)' }}>RATING 1400 - 1600 (EXPERT)</div>
                <h4 style={{ fontWeight: 900, textTransform: 'uppercase', margin: '4px 0' }}>Advanced DP & Trees</h4>
                <p style={{ color: 'var(--text-primary)' }}>
                  DP Optimizations, Dijkstra, Cycle Finding, Lowest Common Ancestor (LCA), Rabin-Karp String Matching, and Combinatorics.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: THINKING & EDITORIAL */}
          {activeTab === 'editorial' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ border: '2px solid var(--border-color)', padding: '1rem', backgroundColor: 'var(--bg-primary)' }}>
                <h4 style={{ fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  The 15-20 Minute Stuck Rule
                </h4>
                <p style={{ color: 'var(--text-primary)' }}>
                  Think about a problem as long as you are generating ideas. If you are <strong>completely stuck with zero ideas for 15-20 minutes</strong>, open the editorial line-by-line. As soon as a hint sparks an idea, close the editorial and keep coding!
                </p>
              </div>

              <div style={{ border: '2px solid var(--border-color)', padding: '1rem', backgroundColor: 'var(--bg-secondary)' }}>
                <h4 style={{ fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Never Cheat in Contests
                </h4>
                <p style={{ color: 'var(--text-primary)' }}>
                  Giving contests honestly is vital. Plagiarizing solutions inflates rating without building brain logic, and will get exposed in real technical interviews.
                </p>
              </div>

              <div style={{ border: '2px solid var(--border-color)', padding: '1rem', backgroundColor: 'var(--bg-primary)' }}>
                <h4 style={{ fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Upsolving: The Ultimate Learning Secret
                </h4>
                <p style={{ color: 'var(--text-primary)' }}>
                  After every contest, always <strong>upsolve</strong> the first problem you couldn't solve during the contest. This guarantees steady rating growth!
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: RESOURCES & CREDITS */}
          {activeTab === 'resources' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* GRATITUDE & CREDITS BANNER */}
              <div style={{ border: '2px solid var(--border-color)', padding: '1.25rem', backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  SPECIAL GRATITUDE & COMMUNITY CREDITS
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase', margin: '4px 0 8px 0' }}>
                  Built on Community Wisdom & TLE Eliminators
                </h3>
                <p style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                  Huge thanks to <strong>Priyansh Aggarwal</strong> and the <strong>TLE Eliminators</strong> team for building the legendary CP 31 Sheet, and to the Competitive Programming community for curating these insights!
                </p>
              </div>

              <div style={{ border: '2px solid var(--border-color)', padding: '1rem', backgroundColor: 'var(--bg-secondary)' }}>
                <h4 style={{ fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Recommended Platform Links
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <a href="https://www.tle-eliminators.com/cp-sheet" target="_blank" rel="noreferrer" style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
                    1. TLE Eliminators Official CP Sheet ↗
                  </a>
                  <a href="https://cses.fi/problemset" target="_blank" rel="noreferrer" style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
                    2. CSES Problemset (DP & Graph Sections) ↗
                  </a>
                  <a href="https://codehunt.cc/" target="_blank" rel="noreferrer" style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
                    3. CodeHunt.cc (Filter Codeforces Problems by Tag) ↗
                  </a>
                  <a href="https://youkn0wwho.academy/topic-list" target="_blank" rel="noreferrer" style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
                    4. YouKn0wWho Academy Topic List ↗
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
