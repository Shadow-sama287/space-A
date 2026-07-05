'use client';

import { useState, useEffect } from 'react';

interface TourStep {
  title: string;
  badge: string;
  description: string;
  tip?: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    badge: 'STEP 1 OF 6 • WELCOME TO SPACE A',
    title: 'SPACED REPETITION DSA & CP ENGINE',
    description:
      'space A applies the Anki SM-2 memory algorithm to software engineering problems. Instead of grinding 500 random problems once, space A schedules optimal review intervals (1d, 3d, 7d, 21d) so you achieve 100% long-term recall!',
    tip: 'Key Rule: Never memorize solutions. Grade your performance honestly after each attempt.',
  },
  {
    badge: 'STEP 2 OF 6 • 3D STREAK CORE',
    title: 'INTERACTIVE GEOMETRY STREAK EVOLUTION',
    description:
      'Your daily solve streak powers a live 3D wireframe mesh on your dashboard! Maintain your streak to evolve your core: Cube (0d) -> Octahedron (1-3d) -> Icosahedron (4-6d) -> 4D Tesseract (7-14d) -> Star Polyhedron (15-29d) -> Quantum Geodesic (30d+).',
    tip: 'Warning: Missing a daily solve fractures your core into a Shattered state and resets streak to 0d.',
  },
  {
    badge: 'STEP 3 OF 6 • EXPLORER & PROBLEM SHEETS',
    title: '1,037 CURATED PROBLEMS & CP RATING TIERS',
    description:
      'Explore 3 master sheets: Striver SDE Sheet (191), Striver A2Z Sheet (474), and TLE Eliminators CP Sheet (372). Filter CP problems by exact Codeforces rating tiers (800 to 1900).',
    tip: 'Pro Tip: Toggle active sheets in Settings to customize your personal study catalog.',
  },
  {
    badge: 'STEP 4 OF 6 • COMPETITIVE PROGRAMMING GUIDE',
    title: 'COMMUNITY LOGIC ROADMAP & WALKTHROUGH',
    description:
      'Access built-in advice from top competitive programmers! Learn the 15-20 minute stuck rule, contest strategy, topic milestones, and editorial upsolving guidelines.',
    tip: 'Click the [ CP WALKTHROUGH & ROADMAP ] button on Explorer to open the full guide.',
  },
  {
    badge: 'STEP 5 OF 6 • SNOOZE & COOL-OFF SYSTEM',
    title: 'PROTECT MENTAL ENERGY & PREVENT BURNOUT',
    description:
      'Stuck on a frustrating problem? Click [ SNOOZE ] during review to move it to a 3-Day Cool-Off Queue (Primary max 3, Secondary max 10). It stays away from daily reviews until your mind is fresh!',
    tip: 'After 3 days, a Fresh Mind banner appears on your Dashboard allowing one-click re-entry.',
  },
  {
    badge: 'STEP 6 OF 6 • EYE-CARE THEMES & CUSTOMIZATION',
    title: '10 BRUTALIST COLOR PALETTES',
    description:
      'Switch between 10 brutalist eye-care themes in Settings: Obsidian Dark, Cyber Matrix, Crimson Blood, Solarized Warm, Nord Arctic, Gruvbox, Catppuccin Mocha, and Grayscale Neutral.',
    tip: 'Your 3D Streak Core automatically recolors to sync with your active theme!',
  },
];

export default function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    // Auto-trigger on first visit if not completed
    const completed = localStorage.getItem('space_a_onboarding_completed');
    if (!completed) {
      setIsOpen(true);
    }

    // Custom event listener for re-triggering from Settings
    const handleReplay = () => {
      setStepIndex(0);
      setIsOpen(true);
    };

    window.addEventListener('open_space_a_onboarding', handleReplay);
    return () => window.removeEventListener('open_space_a_onboarding', handleReplay);
  }, []);

  const handleNext = () => {
    if (stepIndex < TOUR_STEPS.length - 1) {
      setStepIndex(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('space_a_onboarding_completed', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[stepIndex];
  const progressPercent = Math.round(((stepIndex + 1) / TOUR_STEPS.length) * 100);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '650px',
          width: '100%',
          backgroundColor: 'var(--bg-primary)',
          border: '3px solid var(--border-color)',
          boxShadow: '10px 10px 0px 0px var(--shadow-color)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {/* HEADER & BADGE */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 900, fontFamily: 'monospace', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              {currentStep.badge}
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', margin: '2px 0 0 0' }}>
              {currentStep.title}
            </h2>
          </div>

          <button
            onClick={handleComplete}
            className="btn btn-black btn-sm"
            style={{ padding: '0.3rem 0.6rem', fontFamily: 'monospace', fontSize: '0.75rem' }}
          >
            SKIP [X]
          </button>
        </div>

        {/* PROGRESS BAR */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 900, fontFamily: 'monospace', marginBottom: '0.3rem' }}>
            <span>PROGRESS: {progressPercent}%</span>
            <span>{stepIndex + 1} / {TOUR_STEPS.length}</span>
          </div>
          <div style={{ width: '100%', height: '8px', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                backgroundColor: 'var(--text-primary)',
                transition: 'width 0.2s ease',
              }}
            />
          </div>
        </div>

        {/* DESCRIPTION BODY */}
        <div style={{ fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: '1.5', padding: '0.5rem 0' }}>
          <p style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            {currentStep.description}
          </p>

          {currentStep.tip && (
            <div style={{ border: '2px solid var(--border-color)', padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', fontSize: '0.8rem' }}>
              <strong>GUIDELINE:</strong> {currentStep.tip}
            </div>
          )}
        </div>

        {/* ACTION CONTROLS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem' }}>
          <button
            disabled={stepIndex === 0}
            onClick={handlePrev}
            className="btn btn-outline btn-sm"
            style={{
              padding: '0.4rem 0.8rem',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              opacity: stepIndex === 0 ? 0.4 : 1,
              cursor: stepIndex === 0 ? 'not-allowed' : 'pointer',
              border: '2px solid var(--border-color)',
            }}
          >
            [ ◀ PREVIOUS ]
          </button>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {TOUR_STEPS.map((_, i) => (
              <span
                key={i}
                style={{
                  width: '10px',
                  height: '10px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: i === stepIndex ? 'var(--text-primary)' : 'var(--bg-secondary)',
                }}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="btn btn-black btn-sm"
            style={{ padding: '0.4rem 1rem', fontFamily: 'monospace', fontSize: '0.75rem' }}
          >
            {stepIndex === TOUR_STEPS.length - 1 ? 'FINISH TOUR 🚀' : 'NEXT ▶'}
          </button>
        </div>
      </div>
    </div>
  );
}
