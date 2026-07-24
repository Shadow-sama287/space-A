'use client';

import { useState } from 'react';

interface SpacedRepetitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'sr' | 'sm2' | 'fsrs';
}

type TabType = 'sr' | 'sm2' | 'fsrs';

export default function SpacedRepetitionModal({
  isOpen,
  onClose,
  defaultTab = 'sr',
}: SpacedRepetitionModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);

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
          maxWidth: '860px',
          width: '100%',
          maxHeight: '88vh',
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
              SPACE A • MEMORY & SCHEDULING GUIDE
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase', margin: '4px 0 0 0' }}>
              SPACED REPETITION & ALGORITHMS GUIDE
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
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {[
            { id: 'sr', label: '1. WHAT IS SPACED REPETITION' },
            { id: 'sm2', label: '2. SM-2 ALGORITHM (1987)' },
            { id: 'fsrs', label: '3. FSRS-V5 ALGORITHM (MODERN AI)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              style={{
                padding: '0.45rem 0.85rem',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                cursor: 'pointer',
                backgroundColor: activeTab === tab.id ? 'var(--text-primary)' : 'var(--bg-primary)',
                color: activeTab === tab.id ? 'var(--bg-primary)' : 'var(--text-primary)',
                border: '2px solid var(--border-color)',
                boxShadow: activeTab === tab.id ? '2px 2px 0px 0px var(--shadow-color)' : 'none',
                transition: 'all 0.1s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENT SCROLL AREA */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: '1.5' }}>
          
          {/* ================= TAB 1: WHAT IS SPACED REPETITION ================= */}
          {activeTab === 'sr' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* FORGETTING CURVE SVG DIAGRAM CARD */}
              <div style={{ border: '2px solid var(--border-color)', padding: '1rem', backgroundColor: 'var(--bg-secondary)' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  THE EBBINGHAUS FORGETTING CURVE & RECALL BOOSTS
                </div>
                <h4 style={{ fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Why Single-Pass Cramming Fails for LeetCode / DSA
                </h4>

                {/* SVG GRAPH */}
                <div style={{ backgroundColor: 'var(--bg-primary)', border: '2px solid var(--border-color)', padding: '0.75rem', marginBottom: '0.75rem' }}>
                  <svg viewBox="0 0 600 220" style={{ width: '100%', height: 'auto', display: 'block' }}>
                    <line x1="50" y1="30" x2="570" y2="30" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3 3" opacity="0.3"/>
                    <line x1="50" y1="80" x2="570" y2="80" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3 3" opacity="0.3"/>
                    <line x1="50" y1="130" x2="570" y2="130" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3 3" opacity="0.3"/>
                    <line x1="50" y1="180" x2="570" y2="180" stroke="var(--border-color)" strokeWidth="2"/>
                    <line x1="50" y1="20" x2="50" y2="180" stroke="var(--border-color)" strokeWidth="2"/>

                    <text x="15" y="35" fill="var(--text-primary)" fontSize="10" fontWeight="bold" fontFamily="monospace">100%</text>
                    <text x="25" y="110" fill="var(--text-primary)" fontSize="10" fontWeight="bold" fontFamily="monospace">50%</text>
                    <text x="32" y="184" fill="var(--text-primary)" fontSize="10" fontWeight="bold" fontFamily="monospace">0%</text>

                    <path d="M 50 30 Q 100 140 220 175" fill="none" stroke="#ff4444" strokeWidth="3" strokeDasharray="6 4" />
                    <text x="120" y="165" fill="#ff4444" fontSize="10" fontWeight="bold" fontFamily="monospace">
                      ❌ Single Study: 80% forgotten in 7 days
                    </text>

                    <path d="M 50 30 Q 80 100 110 120" fill="none" stroke="var(--text-primary)" strokeWidth="2.5" />
                    <line x1="110" y1="120" x2="110" y2="30" stroke="#00cc66" strokeWidth="2" strokeDasharray="2 2" />
                    <circle cx="110" cy="30" r="4" fill="#00cc66" />
                    <text x="100" y="20" fill="#00cc66" fontSize="9" fontWeight="bold" fontFamily="monospace">Rev 1</text>

                    <path d="M 110 30 Q 180 80 230 100" fill="none" stroke="var(--text-primary)" strokeWidth="2.5" />
                    <line x1="230" y1="100" x2="230" y2="30" stroke="#00cc66" strokeWidth="2" strokeDasharray="2 2" />
                    <circle cx="230" cy="30" r="4" fill="#00cc66" />
                    <text x="220" y="20" fill="#00cc66" fontSize="9" fontWeight="bold" fontFamily="monospace">Rev 2</text>

                    <path d="M 230 30 Q 380 50 560 65" fill="none" stroke="#00cc66" strokeWidth="3" />
                    <text x="340" y="45" fill="#00cc66" fontSize="10" fontWeight="bold" fontFamily="monospace">
                      ✓ Spaced Recall: Permanent Retention
                    </text>

                    <text x="50" y="200" fill="var(--text-primary)" fontSize="10" fontWeight="bold" fontFamily="monospace">Day 0</text>
                    <text x="110" y="200" fill="var(--text-primary)" fontSize="10" fontWeight="bold" fontFamily="monospace">Day 1</text>
                    <text x="230" y="200" fill="var(--text-primary)" fontSize="10" fontWeight="bold" fontFamily="monospace">Day 4</text>
                    <text x="420" y="200" fill="var(--text-primary)" fontSize="10" fontWeight="bold" fontFamily="monospace">Day 14</text>
                    <text x="540" y="200" fill="var(--text-primary)" fontSize="10" fontWeight="bold" fontFamily="monospace">Day 30</text>
                  </svg>
                </div>

                <p style={{ color: 'var(--text-primary)' }}>
                  Human memory decays exponentially according to Hermann Ebbinghaus&apos;s 1885 discovery. Reviewing a problem right when memory is about to fade <strong>resets the decay rate to a much flatter curve</strong>, turning short-term recognition into permanent intuition.
                </p>
              </div>

              {/* THREE CORE PRINCIPLES */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div style={{ border: '2px solid var(--border-color)', padding: '0.85rem', backgroundColor: 'var(--bg-primary)' }}>
                  <div style={{ fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.3rem', color: 'var(--text-primary)' }}>
                    1. Active Recall
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Attempting to reconstruct a problem&apos;s pattern from memory <em>before</em> looking at the solution strengthens neural pathways 5x faster than passive reading.
                  </div>
                </div>

                <div style={{ border: '2px solid var(--border-color)', padding: '0.85rem', backgroundColor: 'var(--bg-primary)' }}>
                  <div style={{ fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.3rem', color: 'var(--text-primary)' }}>
                    2. Expanding Intervals
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Instead of reviewing daily, intervals expand dynamically (e.g. 1d &rarr; 4d &rarr; 12d &rarr; 35d) so you spend time only on what you are close to forgetting.
                  </div>
                </div>

                <div style={{ border: '2px solid var(--border-color)', padding: '0.85rem', backgroundColor: 'var(--bg-primary)' }}>
                  <div style={{ fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.3rem', color: 'var(--text-primary)' }}>
                    3. Zero Frustration Queue
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Failing a review isn&apos;t a penalty—it signals the engine to reset interval state so you re-encounter the pattern right when your brain needs it most.
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ================= TAB 2: SM-2 ALGORITHM ================= */}
          {activeTab === 'sm2' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div style={{ border: '2px solid var(--border-color)', padding: '1rem', backgroundColor: 'var(--bg-secondary)' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  CLASSIC ALGORITHM (1987)
                </div>
                <h4 style={{ fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  SuperMemo-2 (SM-2): How Legacy Anki Scheduling Works
                </h4>
                <p style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                  Created by Piotr Woźniak in 1987, <strong>SM-2</strong> relies on an <strong>Ease Factor (EF)</strong> with a default starting value of <strong>2.5</strong> and consecutive repetition counts. Unlike FSRS, SM-2 <strong>does not have intra-day learning steps</strong>. It schedules everything in increments of days.
                </p>

                {/* FORMULA & COMPUTATION BOX */}
                <div style={{ border: '2px solid var(--border-color)', padding: '0.85rem', backgroundColor: 'var(--bg-primary)', marginBottom: '0.75rem' }}>
                  <div style={{ fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                    📐 SM-2 Interval Calculation Rules:
                  </div>
                  <ul style={{ paddingLeft: '1.25rem', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <li><strong>Repetition 1 (Pass):</strong> Next Interval = 1 Day</li>
                    <li><strong>Repetition 2 (Pass):</strong> Next Interval = 4 Days</li>
                    <li><strong>Repetition n &gt; 2:</strong> Next Interval = Previous Interval &times; EF</li>
                  </ul>
                </div>

                <h4 style={{ fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem', marginTop: '1.5rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                  What Happens When You Grade a Problem?
                </h4>
                
                <div style={{ backgroundColor: 'var(--bg-primary)', border: '2px solid var(--border-color)', padding: '0.75rem', marginTop: '1rem' }}>
                  <svg viewBox="0 0 600 260" style={{ width: '100%', height: 'auto', display: 'block' }}>
                    {/* Central Review Node */}
                    <rect x="20" y="110" width="100" height="40" fill="var(--bg-secondary)" stroke="var(--border-color)" strokeWidth="2" />
                    <text x="70" y="135" fill="var(--text-primary)" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                      REVIEW
                    </text>

                    {/* Path 1: AGAIN */}
                    <path d="M 120 120 Q 150 40 200 40" fill="none" stroke="#ff4444" strokeWidth="3" />
                    <rect x="200" y="20" width="80" height="40" fill="var(--bg-primary)" stroke="#ff4444" strokeWidth="2" />
                    <text x="240" y="45" fill="#ff4444" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">AGAIN</text>
                    
                    <path d="M 280 40 L 330 40" fill="none" stroke="var(--border-color)" strokeWidth="2" strokeDasharray="4 4" />
                    <rect x="330" y="25" width="140" height="30" fill="var(--bg-secondary)" stroke="var(--border-color)" strokeWidth="1" />
                    <text x="400" y="45" fill="var(--text-primary)" fontSize="10" fontFamily="monospace" textAnchor="middle">EF drops ~0.8 (Hell!)</text>

                    <path d="M 470 40 L 510 40" fill="none" stroke="var(--text-primary)" strokeWidth="2" />
                    <rect x="510" y="25" width="70" height="30" fill="var(--text-primary)" stroke="var(--border-color)" strokeWidth="1" />
                    <text x="545" y="45" fill="var(--bg-primary)" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">+1 DAY</text>

                    {/* Path 2: HARD */}
                    <path d="M 120 125 Q 150 100 200 100" fill="none" stroke="#ffaa00" strokeWidth="3" />
                    <rect x="200" y="80" width="80" height="40" fill="var(--bg-primary)" stroke="#ffaa00" strokeWidth="2" />
                    <text x="240" y="105" fill="#ffaa00" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">HARD</text>

                    <path d="M 280 100 L 330 100" fill="none" stroke="var(--border-color)" strokeWidth="2" strokeDasharray="4 4" />
                    <rect x="330" y="85" width="140" height="30" fill="var(--bg-secondary)" stroke="var(--border-color)" strokeWidth="1" />
                    <text x="400" y="105" fill="var(--text-primary)" fontSize="10" fontFamily="monospace" textAnchor="middle">EF drops ~0.14</text>

                    <path d="M 470 100 L 510 100" fill="none" stroke="var(--text-primary)" strokeWidth="2" />
                    <rect x="510" y="85" width="70" height="30" fill="var(--text-primary)" stroke="var(--border-color)" strokeWidth="1" />
                    <text x="545" y="105" fill="var(--bg-primary)" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">+1 TO 4d</text>

                    {/* Path 3: GOOD */}
                    <path d="M 120 135 Q 150 160 200 160" fill="none" stroke="#00cc66" strokeWidth="3" />
                    <rect x="200" y="140" width="80" height="40" fill="var(--bg-primary)" stroke="#00cc66" strokeWidth="2" />
                    <text x="240" y="165" fill="#00cc66" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">GOOD</text>

                    <path d="M 280 160 L 330 160" fill="none" stroke="var(--border-color)" strokeWidth="2" strokeDasharray="4 4" />
                    <rect x="330" y="145" width="140" height="30" fill="var(--bg-secondary)" stroke="var(--border-color)" strokeWidth="1" />
                    <text x="400" y="165" fill="var(--text-primary)" fontSize="10" fontFamily="monospace" textAnchor="middle">EF remains same</text>

                    <path d="M 470 160 L 510 160" fill="none" stroke="var(--text-primary)" strokeWidth="2" />
                    <rect x="510" y="145" width="70" height="30" fill="var(--text-primary)" stroke="var(--border-color)" strokeWidth="1" />
                    <text x="545" y="165" fill="var(--bg-primary)" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">+1 TO 4d</text>

                    {/* Path 4: EASY */}
                    <path d="M 120 140 Q 150 220 200 220" fill="none" stroke="var(--text-primary)" strokeWidth="3" />
                    <rect x="200" y="200" width="80" height="40" fill="var(--bg-primary)" stroke="var(--text-primary)" strokeWidth="2" />
                    <text x="240" y="225" fill="var(--text-primary)" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">EASY</text>

                    <path d="M 280 220 L 330 220" fill="none" stroke="var(--border-color)" strokeWidth="2" strokeDasharray="4 4" />
                    <rect x="330" y="205" width="140" height="30" fill="var(--bg-secondary)" stroke="var(--border-color)" strokeWidth="1" />
                    <text x="400" y="225" fill="var(--text-primary)" fontSize="10" fontFamily="monospace" textAnchor="middle">EF jumps +0.10</text>

                    <path d="M 470 220 L 510 220" fill="none" stroke="var(--text-primary)" strokeWidth="2" />
                    <rect x="510" y="205" width="70" height="30" fill="var(--text-primary)" stroke="var(--border-color)" strokeWidth="1" />
                    <text x="545" y="225" fill="var(--bg-primary)" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">+4+ DAYS</text>
                  </svg>
                </div>

              </div>

              {/* SM-2 PROS & CONS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ border: '2px solid var(--border-color)', padding: '0.85rem', backgroundColor: 'var(--bg-primary)' }}>
                  <div style={{ fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.4rem', color: '#ff4444' }}>
                    ⚠️ The &quot;Ease Hell&quot; Problem
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    Failing a problem drops Ease Factor down to 1.3. Once stuck in Ease Hell, SM-2 schedules reviews every few days forever even after you master the pattern.
                  </div>
                </div>

                <div style={{ border: '2px solid var(--border-color)', padding: '0.85rem', backgroundColor: 'var(--bg-primary)' }}>
                  <div style={{ fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.4rem', color: '#00cc66' }}>
                    💡 No Intra-Day Learning
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    Unlike FSRS, SM-2 simply schedules everything for tomorrow. If you need immediate reinforcement on a brand new problem, you have to do it manually outside the Queue.
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ================= TAB 3: FSRS-V5 ALGORITHM ================= */}
          {activeTab === 'fsrs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div style={{ border: '2px solid var(--border-color)', padding: '1rem', backgroundColor: 'var(--bg-secondary)' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  MODERN MACHINE LEARNING ENGINE (2024+)
                </div>
                <h4 style={{ fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  FSRS-v5: Free Spaced Repetition Scheduler
                </h4>
                <p style={{ color: 'var(--text-primary)', marginBottom: '0.75rem', fontSize: '0.8rem' }}>
                  FSRS categorizes your problems into two distinct phases: <strong>The Learning Phase</strong> (uses short, intra-day steps measured in minutes) and <strong>The Review Phase</strong> (schedules in days based on your Target Retention).
                </p>

                <h4 style={{ fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem', marginTop: '1.5rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                  What Happens When You Grade a Problem?
                </h4>
                
                <div style={{ backgroundColor: 'var(--bg-primary)', border: '2px solid var(--border-color)', padding: '0.75rem', marginTop: '1rem' }}>
                  <svg viewBox="0 0 600 280" style={{ width: '100%', height: 'auto', display: 'block' }}>
                    
                    {/* Zones */}
                    <rect x="20" y="10" width="350" height="260" fill="var(--bg-secondary)" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                    <text x="195" y="30" fill="var(--text-secondary)" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">LEARNING PHASE (MINUTES)</text>

                    <rect x="380" y="10" width="200" height="260" fill="var(--bg-secondary)" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                    <text x="480" y="30" fill="var(--text-secondary)" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">REVIEW PHASE (DAYS)</text>

                    {/* Central Node */}
                    <rect x="40" y="120" width="80" height="40" fill="var(--bg-primary)" stroke="var(--border-color)" strokeWidth="2" />
                    <text x="80" y="145" fill="var(--text-primary)" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">GRADE</text>

                    {/* Path 1: AGAIN */}
                    <path d="M 120 130 Q 150 60 170 60" fill="none" stroke="#ff4444" strokeWidth="3" />
                    <rect x="170" y="40" width="70" height="40" fill="var(--bg-primary)" stroke="#ff4444" strokeWidth="2" />
                    <text x="205" y="65" fill="#ff4444" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">AGAIN</text>
                    
                    <path d="M 240 60 L 290 60" fill="none" stroke="var(--text-primary)" strokeWidth="2" />
                    <rect x="290" y="45" width="60" height="30" fill="var(--text-primary)" stroke="var(--border-color)" strokeWidth="1" />
                    <text x="320" y="65" fill="var(--bg-primary)" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">~1m</text>

                    {/* Path 2: HARD */}
                    <path d="M 120 135 Q 150 115 170 115" fill="none" stroke="#ffaa00" strokeWidth="3" />
                    <rect x="170" y="95" width="70" height="40" fill="var(--bg-primary)" stroke="#ffaa00" strokeWidth="2" />
                    <text x="205" y="120" fill="#ffaa00" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">HARD</text>

                    <path d="M 240 115 L 290 115" fill="none" stroke="var(--text-primary)" strokeWidth="2" />
                    <rect x="290" y="100" width="60" height="30" fill="var(--text-primary)" stroke="var(--border-color)" strokeWidth="1" />
                    <text x="320" y="120" fill="var(--bg-primary)" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">~5m</text>

                    {/* Path 3: GOOD */}
                    <path d="M 120 145 Q 150 170 170 170" fill="none" stroke="#00cc66" strokeWidth="3" />
                    <rect x="170" y="150" width="70" height="40" fill="var(--bg-primary)" stroke="#00cc66" strokeWidth="2" />
                    <text x="205" y="175" fill="#00cc66" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">GOOD</text>

                    <path d="M 240 170 L 290 170" fill="none" stroke="var(--text-primary)" strokeWidth="2" />
                    <rect x="290" y="155" width="60" height="30" fill="var(--text-primary)" stroke="var(--border-color)" strokeWidth="1" />
                    <text x="320" y="175" fill="var(--bg-primary)" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">~10m</text>
                    
                    <path d="M 350 170 L 400 170" fill="none" stroke="var(--border-color)" strokeWidth="2" strokeDasharray="4 4" />
                    <rect x="400" y="155" width="160" height="30" fill="var(--bg-primary)" stroke="var(--border-color)" strokeWidth="1" />
                    <text x="480" y="175" fill="var(--text-primary)" fontSize="10" fontFamily="monospace" textAnchor="middle">Graduates (~3d)</text>

                    {/* Path 4: EASY */}
                    <path d="M 120 150 Q 150 230 170 230" fill="none" stroke="var(--text-primary)" strokeWidth="3" />
                    <rect x="170" y="210" width="70" height="40" fill="var(--bg-primary)" stroke="var(--text-primary)" strokeWidth="2" />
                    <text x="205" y="235" fill="var(--text-primary)" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">EASY</text>

                    <path d="M 240 230 L 400 230" fill="none" stroke="var(--border-color)" strokeWidth="2" strokeDasharray="4 4" />
                    <text x="320" y="225" fill="var(--text-secondary)" fontSize="10" fontFamily="monospace" textAnchor="middle">Bypass</text>
                    <rect x="400" y="215" width="160" height="30" fill="var(--bg-primary)" stroke="var(--border-color)" strokeWidth="1" />
                    <text x="480" y="235" fill="var(--text-primary)" fontSize="10" fontFamily="monospace" textAnchor="middle">Graduates (~8d)</text>

                  </svg>
                </div>
              </div>

              {/* FSRS BEST PRACTICES */}
              <div style={{ border: '2px solid var(--border-color)', padding: '1rem', backgroundColor: 'var(--bg-primary)' }}>
                <h4 style={{ fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                  Best Practices
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ borderLeft: '2px solid #00cc66', paddingLeft: '0.75rem' }}>
                    <div style={{ fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.2rem' }}>1. Default to GOOD</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>If you solved the problem within a reasonable timeframe (e.g., 15-20 mins), press GOOD. Don't press EASY just because you feel confident. Let the algorithm naturally expand the intervals.</div>
                  </div>
                  
                  <div style={{ borderLeft: '2px solid var(--text-primary)', paddingLeft: '0.75rem' }}>
                    <div style={{ fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.2rem' }}>2. Reserve EASY for Trivial Problems</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Only press EASY if the entire optimal solution instantly flashes into your mind without any effort. Overusing EASY will lead to forgetting patterns down the line.</div>
                  </div>

                  <div style={{ borderLeft: '2px solid #ff4444', paddingLeft: '0.75rem' }}>
                    <div style={{ fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.2rem' }}>3. Don't Fear the AGAIN Button</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>If you had to look at the solution, you must press AGAIN. Falsely pressing HARD or GOOD will inflate stability, causing it to be scheduled too far in the future.</div>
                  </div>

                  <div style={{ borderLeft: '2px solid #00f0ff', paddingLeft: '0.75rem' }}>
                    <div style={{ fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.2rem' }}>4. Trust the Learning Steps</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>If you grade a new problem as GOOD and it reappears in your queue 10 mins later, this is not a bug! This is FSRS solidifying the neural pathway before sending it away for days.</div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
