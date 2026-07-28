'use client';

import React, { useState } from 'react';
import { DesignADemo, DesignBDemo, DesignCDemo } from '@/components/review-demos/DemoReviewLayouts';

export default function ReviewDemoPage() {
  const [activeVariant, setActiveVariant] = useState<'A' | 'B' | 'C'>('A');

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* HEADER BAR */}
      <div style={{ marginBottom: '1.5rem', borderBottom: '3px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 900, fontFamily: 'monospace', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
          SPACE A • INTERACTIVE HYBRID DEMO PLAYGROUND
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase', margin: '4px 0 8px 0' }}>
          HYBRID SIDEBAR QUEUE DEMO DESIGNS
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Test the 3 new hybrid designs combining a Queue Drawer toggle button with slide-out sidebar layouts and safe two-step grading.
        </p>
      </div>

      {/* VARIANT SWITCHER TABS */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'A', title: 'HYBRID 1: SLIDE-OVER SIDEBAR', desc: 'Click [📁 QUEUE SIDEBAR] to slide out search & filter panel' },
          { id: 'B', title: 'HYBRID 2: PUSH-GRID SIDEBAR', desc: 'Click [COLLAPSE/EXPAND] to push content side-by-side' },
          { id: 'C', title: 'HYBRID 3: COMMAND RAIL', desc: 'Click [⚡ COMMAND RAIL] to open sidebar + keyboard guide' },
        ].map((v) => {
          const isActive = activeVariant === v.id;
          return (
            <button
              key={v.id}
              onClick={() => setActiveVariant(v.id as 'A' | 'B' | 'C')}
              style={{
                flex: '1 1 260px',
                padding: '0.75rem 1rem',
                fontFamily: 'monospace',
                textAlign: 'left',
                border: isActive ? '3px solid var(--text-primary)' : '2px solid var(--border-color)',
                backgroundColor: isActive ? 'var(--text-primary)' : 'var(--bg-primary)',
                color: isActive ? 'var(--bg-primary)' : 'var(--text-primary)',
                boxShadow: isActive ? '4px 4px 0px var(--shadow-color)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.1s ease',
              }}
            >
              <div style={{ fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '4px' }}>
                {v.title}
              </div>
              <div style={{ fontSize: '0.7rem', opacity: 0.85 }}>
                {v.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* ACTIVE DEMO COMPONENT */}
      <div>
        {activeVariant === 'A' && <DesignADemo />}
        {activeVariant === 'B' && <DesignBDemo />}
        {activeVariant === 'C' && <DesignCDemo />}
      </div>
    </div>
  );
}
