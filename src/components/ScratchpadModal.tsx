'use client';

import dynamic from 'next/dynamic';
import React, { useState } from 'react';

const DynamicTldrawCanvas = dynamic(() => import('./TldrawCanvas'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontFamily: 'var(--font-mono, monospace)',
        letterSpacing: '1px',
        color: 'var(--text-primary, #000)',
      }}
    >
      [ Loading Interactive tldraw Whiteboard... ]
    </div>
  ),
});

interface ScratchpadModalProps {
  isOpen: boolean;
  problemId: string;
  problemTitle: string;
  onClose: () => void;
  onSave?: () => void;
}

export default function ScratchpadModal({
  isOpen,
  problemId,
  problemTitle,
  onClose,
  onSave,
}: ScratchpadModalProps) {
  const [showConfirmClose, setShowConfirmClose] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
    setShowConfirmClose(false);
    onClose();
  };

  const handleDiscard = () => {
    setShowConfirmClose(false);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          width: '92vw',
          height: '88vh',
          backgroundColor: 'var(--bg-primary, #ffffff)',
          color: 'var(--text-primary, #000000)',
          border: '4px solid var(--border-color, #000000)',
          boxShadow: '8px 8px 0px var(--shadow-color, #000000)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: '0px',
          position: 'relative',
        }}
      >
        {/* HEADER BAR */}
        <div
          style={{
            padding: '0.75rem 1.25rem',
            borderBottom: '3px solid var(--border-color, #000000)',
            backgroundColor: 'var(--bg-secondary, #f0f0f0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span
                style={{
                  backgroundColor: 'var(--text-primary, #000)',
                  color: 'var(--bg-primary, #fff)',
                  padding: '2px 8px',
                  fontWeight: 900,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                TLDRAW CANVAS
              </span>
              <h3
                style={{
                  margin: 0,
                  fontSize: '1.1rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                }}
              >
                {problemTitle}
              </h3>
            </div>
            <p
              style={{
                margin: '2px 0 0 0',
                fontSize: '0.75rem',
                color: 'var(--text-secondary, #555)',
                fontWeight: 600,
              }}
            >
              Draw diagrams, dry-run code, or map pointers. Auto-saved per problem.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={handleSave}
              className="btn btn-black"
              style={{
                padding: '0.5rem 1.25rem',
                fontSize: '0.85rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              SAVE SCRATCHPAD
            </button>
            <button
              type="button"
              onClick={() => setShowConfirmClose(true)}
              className="btn"
              style={{
                padding: '0.5rem 1.25rem',
                fontSize: '0.85rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                backgroundColor: 'var(--bg-primary, #fff)',
                color: 'var(--text-primary, #000)',
                border: '2px solid var(--border-color, #000)',
                cursor: 'pointer',
              }}
            >
              CLOSE [X]
            </button>
          </div>
        </div>

        {/* TL-DRAW CANVAS CONTAINER */}
        <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%' }}>
          <DynamicTldrawCanvas problemId={problemId} />
        </div>

        {/* KEEP OR DISCARD CONFIRMATION MODAL */}
        {showConfirmClose && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10000,
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
            }}
          >
            <div
              style={{
                backgroundColor: 'var(--bg-primary, #ffffff)',
                color: 'var(--text-primary, #000000)',
                border: '4px solid var(--border-color, #000000)',
                boxShadow: '8px 8px 0px var(--shadow-color, #000000)',
                padding: '2rem',
                maxWidth: '480px',
                width: '100%',
                textAlign: 'center',
              }}
            >
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  marginTop: 0,
                  marginBottom: '0.75rem',
                }}
              >
                CLOSE SCRATCHPAD
              </h3>
              <p
                style={{
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary, #555)',
                  marginBottom: '1.5rem',
                  fontWeight: 600,
                }}
              >
                Would you like to KEEP (save drawing to memory) or DISCARD unsaved edits?
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={handleSave}
                  className="btn btn-black"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  KEEP & SAVE SCRATCHPAD
                </button>
                <button
                  type="button"
                  onClick={handleDiscard}
                  className="btn"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    fontSize: '0.85rem',
                    backgroundColor: 'var(--bg-secondary, #eee)',
                    color: 'var(--text-primary, #000)',
                    border: '2px solid var(--border-color, #000)',
                    cursor: 'pointer',
                  }}
                >
                  DISCARD EDITS & CLOSE
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmClose(false)}
                  className="btn"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    fontSize: '0.85rem',
                    backgroundColor: 'transparent',
                    color: 'var(--text-secondary, #666)',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  [ CANCEL ]
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
