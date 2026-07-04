'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toggleSheetAction, resetSheetProgressAction } from '../app/actions/sheet-actions';

interface SheetProgress {
  sheetId: string;
  label: string;
  totalCount: number;
  solvedCount: number;
}

interface SheetManagementCardProps {
  enabledSheets: string[];
  sheetProgressList: SheetProgress[];
}

export default function SheetManagementCard({
  enabledSheets,
  sheetProgressList,
}: SheetManagementCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [togglingSheet, setTogglingSheet] = useState<string | null>(null);

  async function handleToggle(sheetId: string, currentEnabled: boolean) {
    setTogglingSheet(sheetId);
    try {
      await toggleSheetAction(sheetId, !currentEnabled);
      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      alert(`Error toggling sheet: ${err.message}`);
    } finally {
      setTogglingSheet(null);
    }
  }

  async function handleReset(sheetId: string, sheetLabel: string) {
    const confirmed = window.confirm(
      `ARE YOU SURE YOU WANT TO CLEAR ALL REVIEW PROGRESS FOR "${sheetLabel.toUpperCase()}"?\n\nThis will reset your SM-2 repetitions and intervals for this sheet. This action cannot be undone.`
    );
    if (!confirmed) return;

    setTogglingSheet(sheetId);
    try {
      await resetSheetProgressAction(sheetId);
      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      alert(`Error resetting progress: ${err.message}`);
    } finally {
      setTogglingSheet(null);
    }
  }

  return (
    <div className="card mb-4">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h3 className="card-title" style={{ margin: 0 }}>Active Sheets Management</h3>
        <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 'bold' }}>
          {enabledSheets.length} ACTIVE
        </span>
      </div>
      
      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
        Toggle sheets on/off anytime. Disabling a sheet hides its problems from Explorer & Queue while keeping your progress 100% saved.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {sheetProgressList.map((sp) => {
          const isEnabled = enabledSheets.includes(sp.sheetId);
          const isWorking = togglingSheet === sp.sheetId || isPending;
          const pct = sp.totalCount > 0 ? Math.round((sp.solvedCount / sp.totalCount) * 100) : 0;

          return (
            <div
              key={sp.sheetId}
              style={{
                border: '2px solid #000000',
                padding: '1rem',
                backgroundColor: isEnabled ? '#ffffff' : '#f5f5f5',
                boxShadow: isEnabled ? '3px 3px 0px 0px #000000' : 'none',
                opacity: isEnabled ? 1 : 0.75,
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem', fontFamily: 'monospace', textTransform: 'uppercase' }}>
                    {sp.label}
                  </div>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {sp.solvedCount} / {sp.totalCount} Problems Solved ({pct}%)
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleToggle(sp.sheetId, isEnabled)}
                    disabled={isWorking}
                    className="btn btn-sm"
                    style={{
                      backgroundColor: isEnabled ? '#000000' : '#ffffff',
                      color: isEnabled ? '#ffffff' : '#000000',
                      border: '2px solid #000000',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      fontFamily: 'monospace',
                    }}
                  >
                    {isWorking ? 'SAVING...' : isEnabled ? '✓ ENABLED' : 'ENABLE SHEET'}
                  </button>

                  {isEnabled && sp.solvedCount > 0 && (
                    <button
                      onClick={() => handleReset(sp.sheetId, sp.label)}
                      disabled={isWorking}
                      title="Clear review progress for this sheet"
                      style={{
                        background: 'transparent',
                        border: '1px solid #ff4444',
                        color: '#ff4444',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        padding: '0.2rem 0.4rem',
                        cursor: 'pointer',
                        fontFamily: 'monospace',
                      }}
                    >
                      CLEAR PROGRESS
                    </button>
                  )}
                </div>
              </div>

              {/* PROGRESS BAR */}
              <div className="progress-bar-container" style={{ height: '8px', marginTop: '0.5rem' }}>
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: isEnabled ? '#000000' : '#999999',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
