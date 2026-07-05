'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { resumeProblemAction } from '@/app/actions/cool-off-actions';

interface CoolOffItem {
  id: string;
  problem_id: string;
  cooling_queue_tier: string;
  cooling_until: string | null;
  problemTitle?: string;
}

interface CoolOffDashboardCardProps {
  items: CoolOffItem[];
  allProblemsMap: Map<string, string>; // problem_id -> title
}

export default function CoolOffDashboardCard({ items, allProblemsMap }: CoolOffDashboardCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (items.length === 0) return null;

  const nowISO = new Date().toISOString();
  const readyItems = items.filter(
    item => item.cooling_queue_tier === 'primary' && item.cooling_until && item.cooling_until <= nowISO
  );
  const primaryCount = items.filter(item => item.cooling_queue_tier === 'primary').length;
  const secondaryCount = items.filter(item => item.cooling_queue_tier === 'secondary').length;

  async function handleResume(problemId: string) {
    setLoadingId(problemId);
    try {
      await resumeProblemAction(problemId);
      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      alert(`Resume failed: ${err.message}`);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="card mb-3" style={{ border: '3px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <div>
          <div style={{ fontSize: '0.7rem', fontWeight: 900, fontFamily: 'monospace', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
            MENTAL RECOVERY & SNOOZE SYSTEM
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase', margin: '2px 0 0 0' }}>
            COOL-OFF CORNER (PRIMARY: {primaryCount}/3 | SECONDARY: {secondaryCount}/10)
          </h3>
        </div>

        {readyItems.length > 0 && (
          <span style={{ fontSize: '0.7rem', fontWeight: 900, fontFamily: 'monospace', backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)', padding: '0.2rem 0.5rem' }}>
            {readyItems.length} READY FOR FRESH MIND ATTEMPT
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {items.map((item) => {
          const title = allProblemsMap.get(item.problem_id) || 'Problem';
          const isReady = item.cooling_queue_tier === 'primary' && item.cooling_until && item.cooling_until <= nowISO;

          return (
            <div
              key={item.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.6rem 0.8rem',
                border: '2px solid var(--border-color)',
                backgroundColor: isReady ? 'var(--bg-primary)' : 'var(--bg-secondary)',
              }}
            >
              <div>
                <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{title}</span>
                <div suppressHydrationWarning style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                  TIER: {item.cooling_queue_tier.toUpperCase()} |{' '}
                  {isReady
                    ? '🧊 3-DAY COOL OFF COMPLETED! FRESH MIND READY'
                    : item.cooling_until
                    ? `SNOOZED UNTIL ${item.cooling_until.split('T')[0]}`
                    : 'WAITING IN SECONDARY QUEUE'}
                </div>
              </div>

              <button
                disabled={loadingId === item.problem_id}
                onClick={() => handleResume(item.problem_id)}
                className="btn btn-black btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
              >
                {loadingId === item.problem_id ? 'RE-ENTERING...' : 'RE-ENTER QUEUE ⚡'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
