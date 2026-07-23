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
                    {/* Grid lines */}
                    <line x1="50" y1="30" x2="570" y2="30" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3 3" opacity="0.3"/>
                    <line x1="50" y1="80" x2="570" y2="80" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3 3" opacity="0.3"/>
                    <line x1="50" y1="130" x2="570" y2="130" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3 3" opacity="0.3"/>
                    <line x1="50" y1="180" x2="570" y2="180" stroke="var(--border-color)" strokeWidth="2"/>
                    <line x1="50" y1="20" x2="50" y2="180" stroke="var(--border-color)" strokeWidth="2"/>

                    {/* Y Axis Labels */}
                    <text x="15" y="35" fill="var(--text-primary)" fontSize="10" fontWeight="bold" fontFamily="monospace">100%</text>
                    <text x="25" y="110" fill="var(--text-primary)" fontSize="10" fontWeight="bold" fontFamily="monospace">50%</text>
                    <text x="32" y="184" fill="var(--text-primary)" fontSize="10" fontWeight="bold" fontFamily="monospace">0%</text>

                    {/* Curve 1: Without Spaced Repetition (Red/Dashed Fast Decay) */}
                    <path
                      d="M 50 30 Q 100 140 220 175"
                      fill="none"
                      stroke="#ff4444"
                      strokeWidth="3"
                      strokeDasharray="6 4"
                    />
                    <text x="120" y="165" fill="#ff4444" fontSize="10" fontWeight="bold" fontFamily="monospace">
                      ❌ Single Study: 80% forgotten in 7 days
                    </text>

                    {/* Curve 2: Review 1 at Day 1 */}
                    <path d="M 50 30 Q 80 100 110 120" fill="none" stroke="var(--text-primary)" strokeWidth="2.5" />
                    {/* Spike 1 */}
                    <line x1="110" y1="120" x2="110" y2="30" stroke="#00cc66" strokeWidth="2" strokeDasharray="2 2" />
                    <circle cx="110" cy="30" r="4" fill="#00cc66" />
                    <text x="100" y="20" fill="#00cc66" fontSize="9" fontWeight="bold" fontFamily="monospace">Rev 1</text>

                    {/* Curve 3: Review 2 at Day 4 */}
                    <path d="M 110 30 Q 180 80 230 100" fill="none" stroke="var(--text-primary)" strokeWidth="2.5" />
                    {/* Spike 2 */}
                    <line x1="230" y1="100" x2="230" y2="30" stroke="#00cc66" strokeWidth="2" strokeDasharray="2 2" />
                    <circle cx="230" cy="30" r="4" fill="#00cc66" />
                    <text x="220" y="20" fill="#00cc66" fontSize="9" fontWeight="bold" fontFamily="monospace">Rev 2</text>

                    {/* Curve 4: Review 3 at Day 14 (Long Flat Tail) */}
                    <path d="M 230 30 Q 380 50 560 65" fill="none" stroke="#00cc66" strokeWidth="3" />
                    <text x="340" y="45" fill="#00cc66" fontSize="10" fontWeight="bold" fontFamily="monospace">
                      ✓ Spaced Recall: Permanent Retention
                    </text>

                    {/* X Axis Labels */}
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
                    Instead of reviewing daily, intervals expand dynamically (e.g. 1d $\rightarrow$ 4d $\rightarrow$ 12d $\rightarrow$ 35d) so you spend time only on what you are close to forgetting.
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
                  Created by Piotr Woźniak in 1987, <strong>SM-2</strong> relies on an <strong>Ease Factor ($EF$)</strong> with a default starting value of <strong>2.5</strong> and consecutive repetition counts.
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
                    <li><strong>Ease Factor Formula:</strong> $EF' = EF + (0.1 - (5 - q) \times (0.08 + (5 - q) \times 0.02))$</li>
                    <li><strong>Quality $q$ Mapping:</strong> Again = 0 (Fail), Hard = 3, Good = 4, Easy = 5</li>
                  </ul>
                </div>

                {/* SVG INTERVAL MULTIPLIER CHART */}
                <div style={{ backgroundColor: 'var(--bg-primary)', border: '2px solid var(--border-color)', padding: '0.75rem' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    SM-2 EXPANDING INTERVAL TIMELINE (EF = 2.5)
                  </div>
                  <svg viewBox="0 0 580 120" style={{ width: '100%', height: 'auto', display: 'block' }}>
                    <line x1="30" y1="70" x2="550" y2="70" stroke="var(--border-color)" strokeWidth="3"/>
                    
                    {/* Node 1 */}
                    <circle cx="50" cy="70" r="10" fill="var(--text-primary)"/>
                    <text x="50" y="45" fill="var(--text-primary)" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">Day 0</text>
                    <text x="50" y="95" fill="var(--text-secondary)" fontSize="9" fontFamily="monospace" textAnchor="middle">Initial</text>

                    {/* Arrow 1 */}
                    <path d="M 65 55 Q 105 30 145 55" fill="none" stroke="var(--border-color)" strokeWidth="2" markerEnd="url(#arrow)"/>
                    <text x="105" y="32" fill="var(--text-primary)" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">+1 Day</text>

                    {/* Node 2 */}
                    <circle cx="150" cy="70" r="10" fill="var(--text-primary)"/>
                    <text x="150" y="45" fill="var(--text-primary)" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">Day 1</text>

                    {/* Arrow 2 */}
                    <path d="M 165 55 Q 225 25 285 55" fill="none" stroke="var(--border-color)" strokeWidth="2"/>
                    <text x="225" y="28" fill="var(--text-primary)" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">+4 Days</text>

                    {/* Node 3 */}
                    <circle cx="290" cy="70" r="10" fill="var(--text-primary)"/>
                    <text x="290" y="45" fill="var(--text-primary)" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">Day 5</text>

                    {/* Arrow 3 */}
                    <path d="M 305 55 Q 385 20 465 55" fill="none" stroke="var(--border-color)" strokeWidth="2"/>
                    <text x="385" y="24" fill="var(--text-primary)" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">+10 Days (4 × 2.5)</text>

                    {/* Node 4 */}
                    <circle cx="470" cy="70" r="10" fill="#00cc66"/>
                    <text x="470" y="45" fill="#00cc66" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">Day 15</text>
                    <text x="470" y="95" fill="#00cc66" fontSize="9" fontFamily="monospace" textAnchor="middle">+25 Days next</text>
                  </svg>
                </div>
              </div>

              {/* SM-2 PROS & CONS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ border: '2px solid var(--border-color)', padding: '0.85rem', backgroundColor: 'var(--bg-primary)' }}>
                  <div style={{ fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.4rem', color: '#00cc66' }}>
                    ✓ Advantages of SM-2
                  </div>
                  <ul style={{ paddingLeft: '1rem', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <li>Simple, predictable mathematical model.</li>
                    <li>Low computational overhead.</li>
                    <li>Proven effectiveness for flashcards over 35+ years.</li>
                  </ul>
                </div>

                <div style={{ border: '2px solid var(--border-color)', padding: '0.85rem', backgroundColor: 'var(--bg-primary)' }}>
                  <div style={{ fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.4rem', color: '#ff4444' }}>
                    ⚠️ The &quot;Ease Hell&quot; Problem
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    Failing a problem drops Ease Factor down to 1.3. Once stuck in Ease Hell, SM-2 schedules reviews every few days forever even after you master the pattern.
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
                <p style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                  FSRS is a open-source, machine-learning-driven algorithm based on the scientific <strong>Three-Component Model of Memory</strong>. It reduces daily review load by <strong>20% to 30%</strong> while maintaining your desired retention rate.
                </p>

                {/* THREE COMPONENT MEMORY MODEL */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ border: '2px solid var(--border-color)', padding: '0.75rem', backgroundColor: 'var(--bg-primary)' }}>
                    <div style={{ fontWeight: 900, fontSize: '0.8rem', color: '#00f0ff' }}>
                      1. Difficulty ($D$)
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Inherent problem difficulty (1 to 10 scale). Dynamically adjusted based on your performance.
                    </div>
                  </div>

                  <div style={{ border: '2px solid var(--border-color)', padding: '0.75rem', backgroundColor: 'var(--bg-primary)' }}>
                    <div style={{ fontWeight: 900, fontSize: '0.8rem', color: '#00cc66' }}>
                      2. Stability (S)
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Days required for recall probability to drop from 100% down to 90%. Higher stability = longer intervals.
                    </div>
                  </div>

                  <div style={{ border: '2px solid var(--border-color)', padding: '0.75rem', backgroundColor: 'var(--bg-primary)' }}>
                    <div style={{ fontWeight: 900, fontSize: '0.8rem', color: '#ff79c6' }}>
                      3. Retrievability (R)
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Probability (0-100%) that you remember the pattern today: R(t, S) = (1 + t / (9 &times; S))⁻¹.
                    </div>
                  </div>
                </div>

                {/* FSRS RETRIEVABILITY DECAY SVG GRAPH */}
                <div style={{ backgroundColor: 'var(--bg-primary)', border: '2px solid var(--border-color)', padding: '0.75rem' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    FSRS RETRIEVABILITY CURVE & TARGET RETENTION (90%)
                  </div>
                  <svg viewBox="0 0 580 180" style={{ width: '100%', height: 'auto', display: 'block' }}>
                    {/* Target Retention 90% Line */}
                    <line x1="50" y1="50" x2="550" y2="50" stroke="#00cc66" strokeWidth="2" strokeDasharray="4 4" />
                    <text x="55" y="42" fill="#00cc66" fontSize="10" fontWeight="bold" fontFamily="monospace">
                      Target Retention Threshold (e.g. 90%)
                    </text>

                    {/* Axes */}
                    <line x1="50" y1="20" x2="50" y2="150" stroke="var(--border-color)" strokeWidth="2" />
                    <line x1="50" y1="150" x2="550" y2="150" stroke="var(--border-color)" strokeWidth="2" />

                    <text x="15" y="25" fill="var(--text-primary)" fontSize="9" fontWeight="bold" fontFamily="monospace">100%</text>
                    <text x="20" y="54" fill="#00cc66" fontSize="9" fontWeight="bold" fontFamily="monospace">90%</text>
                    <text x="25" y="154" fill="var(--text-primary)" fontSize="9" fontWeight="bold" fontFamily="monospace">0%</text>

                    {/* Decay Curve */}
                    <path d="M 50 20 Q 250 45 420 50" fill="none" stroke="var(--text-primary)" strokeWidth="3" />
                    
                    {/* Optimal Review Point */}
                    <circle cx="420" cy="50" r="6" fill="#00f0ff" stroke="var(--border-color)" strokeWidth="2" />
                    <line x1="420" y1="50" x2="420" y2="150" stroke="#00f0ff" strokeWidth="1.5" strokeDasharray="3 3" />
                    
                    <text x="420" y="166" fill="#00f0ff" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                      Scheduled Review Date (t = Interval)
                    </text>

                    <text x="240" y="85" fill="var(--text-secondary)" fontSize="9" fontFamily="monospace">
                      FSRS calculates exact day t when R(t, S) = Target Retention
                    </text>
                  </svg>
                </div>
              </div>

              {/* FSRS SUMMARY COMPARISON */}
              <div style={{ border: '2px solid var(--border-color)', padding: '1rem', backgroundColor: 'var(--bg-primary)' }}>
                <h4 style={{ fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  ⚙️ Customizable Target Retention Slider in Space A
                </h4>
                <p style={{ color: 'var(--text-primary)', fontSize: '0.8rem', lineHeight: '1.4' }}>
                  Unlike rigid legacy SM-2, FSRS lets you set your desired memory retention in Settings:
                </p>
                <ul style={{ paddingLeft: '1.25rem', marginTop: '0.4rem', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <li><strong>80% Retention:</strong> Casual review workload (cuts reviews by ~35%).</li>
                  <li><strong>90% Retention (Recommended):</strong> Standard balance of high retention & optimal review pacing.</li>
                  <li><strong>95% Retention:</strong> Intensive interview prep mode for upcoming FAANG OAs.</li>
                </ul>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
