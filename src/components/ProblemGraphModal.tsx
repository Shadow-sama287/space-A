'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface ReviewRecord {
  rating: number;
  ease_factor: number;
  interval_days: number;
  reviewed_at: string;
}

interface ForecastPoint {
  label: string;
  intervalDays: number;
  type: 'past' | 'forecast';
}

interface ProblemGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  problemId: string;
  problemTitle: string;
  currentInterval?: number;
  currentStatus?: string;
  nextReviewDate?: string | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const RATING_LABELS: Record<number, string> = {
  0: 'AGAIN',
  1: 'HARD',
  2: 'GOOD',
  3: 'EASY',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, '0')}`;
}

function formatDateLong(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// ---------------------------------------------------------------------------
// Custom Tooltip components (brutalist, theme-aware)
// ---------------------------------------------------------------------------
function IntervalTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: 'var(--bg-primary)',
        border: '2px solid var(--border-color)',
        boxShadow: '3px 3px 0px var(--shadow-color)',
        padding: '0.5rem 0.75rem',
        fontFamily: 'monospace',
        fontSize: '0.75rem',
      }}
    >
      <div style={{ fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
        {label}
      </div>
      <div>
        INTERVAL: <span style={{ fontWeight: 700 }}>{payload[0].value}d</span>
      </div>
    </div>
  );
}

function RatingTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const rating = payload[0].value as number;
  return (
    <div
      style={{
        background: 'var(--bg-primary)',
        border: '2px solid var(--border-color)',
        boxShadow: '3px 3px 0px var(--shadow-color)',
        padding: '0.5rem 0.75rem',
        fontFamily: 'monospace',
        fontSize: '0.75rem',
      }}
    >
      <div style={{ fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
        {label}
      </div>
      <div>
        GRADE: <span style={{ fontWeight: 700 }}>{rating} — {RATING_LABELS[rating] ?? '—'}</span>
      </div>
    </div>
  );
}

function ForecastTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const isPast = payload[0]?.payload?.type === 'past';
  return (
    <div
      style={{
        background: 'var(--bg-primary)',
        border: '2px solid var(--border-color)',
        boxShadow: '3px 3px 0px var(--shadow-color)',
        padding: '0.5rem 0.75rem',
        fontFamily: 'monospace',
        fontSize: '0.75rem',
      }}
    >
      <div style={{ fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
        {label}
      </div>
      <div>
        INTERVAL: <span style={{ fontWeight: 700 }}>{payload[0].value}d</span>{' '}
        {isPast ? '[PAST]' : '[FORECAST]'}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------
type Tab = 'interval' | 'ratings' | 'forecast';

const TABS: { id: Tab; label: string }[] = [
  { id: 'interval', label: '[ INTERVAL GROWTH ]' },
  { id: 'ratings', label: '[ RATING HISTORY ]' },
  { id: 'forecast', label: '[ FORECAST ]' },
];

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export default function ProblemGraphModal({
  isOpen,
  onClose,
  problemId,
  problemTitle,
  currentInterval = 0,
  currentStatus = 'reviewing',
  nextReviewDate,
}: ProblemGraphModalProps) {
  const [tab, setTab] = useState<Tab>('interval');
  const [history, setHistory] = useState<ReviewRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!problemId) return;
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: qErr } = await supabase
        .from('review_history')
        .select('rating, ease_factor, interval_days, reviewed_at')
        .eq('problem_id', problemId)
        .order('reviewed_at', { ascending: true });

      if (qErr) throw qErr;
      setHistory(data ?? []);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load history');
    } finally {
      setLoading(false);
    }
  }, [problemId]);

  useEffect(() => {
    if (isOpen) fetchHistory();
    else {
      setHistory([]);
      setTab('interval');
    }
  }, [isOpen, fetchHistory]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // -------------------------------------------------------------------------
  // Derived data
  // -------------------------------------------------------------------------
  const totalReviews = history.length;
  const bestRating = totalReviews > 0 ? Math.max(...history.map((r) => r.rating)) : null;
  const avgRating =
    totalReviews > 0
      ? (history.reduce((s, r) => s + r.rating, 0) / totalReviews).toFixed(1)
      : null;

  const intervalData = history.map((r, i) => ({
    label: formatDate(r.reviewed_at),
    intervalDays: r.interval_days,
    reviewNum: i + 1,
  }));

  const ratingData = history.map((r, i) => ({
    label: formatDate(r.reviewed_at),
    rating: r.rating,
    reviewNum: i + 1,
  }));

  const ratingCounts = [0, 1, 2, 3].map((g) => ({
    grade: RATING_LABELS[g],
    count: history.filter((r) => r.rating === g).length,
  }));

  const forecastData: ForecastPoint[] = history.map((r) => ({
    label: formatDate(r.reviewed_at),
    intervalDays: r.interval_days,
    type: 'past' as const,
  }));

  if (history.length >= 2) {
    const last = history[history.length - 1];
    const prev = history[history.length - 2];
    const growthRatio = prev.interval_days > 0 ? last.interval_days / prev.interval_days : 2;
    const safeRatio = Math.max(1.2, Math.min(growthRatio, 4));

    let baseDate = nextReviewDate
      ? new Date(nextReviewDate)
      : new Date(Date.now() + last.interval_days * 86400000);
    let baseInterval = last.interval_days;

    for (let i = 0; i < 3; i++) {
      baseInterval = Math.round(baseInterval * safeRatio);
      forecastData.push({
        label: formatDate(baseDate.toISOString()),
        intervalDays: baseInterval,
        type: 'forecast',
      });
      baseDate = new Date(baseDate.getTime() + baseInterval * 86400000);
    }
  } else if (history.length === 1) {
    const last = history[0];
    let baseDate = nextReviewDate
      ? new Date(nextReviewDate)
      : new Date(Date.now() + last.interval_days * 86400000);
    let baseInterval = last.interval_days;
    for (let i = 0; i < 3; i++) {
      baseInterval = Math.round(baseInterval * 2);
      forecastData.push({
        label: formatDate(baseDate.toISOString()),
        intervalDays: baseInterval,
        type: 'forecast',
      });
      baseDate = new Date(baseDate.getTime() + baseInterval * 86400000);
    }
  }

  const forecastSplitIndex = history.length;

  function ratingFill(rating: number): string {
    const fills = ['var(--bg-tertiary)', '#888888', '#444444', 'var(--text-primary)'];
    return fills[rating] ?? 'var(--text-primary)';
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{ zIndex: 10000 }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '0',
          border: '3px solid var(--border-color)',
          boxShadow: '6px 6px 0px var(--shadow-color)',
        }}
      >
        {/* HEADER */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderBottom: '3px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1rem',
            background: 'var(--bg-secondary)',
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '0.65rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                letterSpacing: '0.1em',
                marginBottom: '0.25rem',
              }}
            >
              LEARNING GRAPH
            </div>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '1rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {problemTitle}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              fontWeight: 900,
              background: 'none',
              border: '2px solid var(--border-color)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: '0.2rem 0.5rem',
              flexShrink: 0,
            }}
          >
            [X]
          </button>
        </div>

        {/* STATS SUMMARY BAR */}
        {!loading && totalReviews > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              borderBottom: '3px solid var(--border-color)',
            }}
          >
            {[
              { label: 'REVIEWS', value: totalReviews.toString() },
              { label: 'BEST GRADE', value: bestRating !== null ? RATING_LABELS[bestRating] : '—' },
              { label: 'AVG GRADE', value: avgRating !== null ? avgRating : '—' },
              {
                label: 'INTERVAL',
                value:
                  currentInterval > 0
                    ? `${currentInterval}d`
                    : history.length > 0
                    ? `${history[history.length - 1].interval_days}d`
                    : '—',
              },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  padding: '0.75rem 1rem',
                  borderRight: i < 3 ? '2px solid var(--border-color)' : undefined,
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--text-secondary)',
                    marginBottom: '0.25rem',
                    letterSpacing: '0.08em',
                  }}
                >
                  {stat.label}
                </div>
                <div
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '1.05rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                  }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TABS */}
        {!loading && totalReviews > 0 && (
          <div
            style={{
              display: 'flex',
              borderBottom: '3px solid var(--border-color)',
              overflowX: 'auto',
            }}
          >
            {TABS.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  flex: 1,
                  minWidth: 'max-content',
                  padding: '0.6rem 0.75rem',
                  fontFamily: 'monospace',
                  fontSize: '0.65rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  border: 'none',
                  borderRight: idx < TABS.length - 1 ? '2px solid var(--border-color)' : 'none',
                  cursor: 'pointer',
                  background: tab === t.id ? 'var(--text-primary)' : 'var(--bg-primary)',
                  color: tab === t.id ? 'var(--bg-primary)' : 'var(--text-primary)',
                  transition: 'background 0.12s, color 0.12s',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {/* BODY */}
        <div style={{ padding: '1.25rem' }}>
          {loading && (
            <div
              style={{
                textAlign: 'center',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                fontWeight: 900,
                padding: '3rem 0',
                color: 'var(--text-secondary)',
              }}
            >
              LOADING REVIEW HISTORY...
            </div>
          )}

          {!loading && error && (
            <div
              style={{
                textAlign: 'center',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                fontWeight: 900,
                padding: '3rem 0',
              }}
            >
              ERROR: {error}
            </div>
          )}

          {!loading && !error && totalReviews === 0 && (
            <div
              style={{
                textAlign: 'center',
                fontFamily: 'monospace',
                padding: '3rem 0',
                color: 'var(--text-secondary)',
              }}
            >
              <div style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                [ NO DATA ]
              </div>
              <div style={{ fontSize: '0.8rem' }}>
                Review this problem at least once to see your learning graph.
              </div>
            </div>
          )}

          {/* TAB: INTERVAL GROWTH */}
          {!loading && !error && totalReviews > 0 && tab === 'interval' && (
            <div>
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  color: 'var(--text-secondary)',
                  marginBottom: '0.75rem',
                  fontWeight: 700,
                }}
              >
                DAYS UNTIL NEXT REVIEW — per session
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={intervalData} margin={{ top: 8, right: 8, bottom: 0, left: -10 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border-color)"
                    strokeOpacity={0.2}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fontFamily: 'monospace', fontSize: 10, fill: 'var(--text-secondary)' }}
                    axisLine={{ stroke: 'var(--border-color)' }}
                    tickLine={{ stroke: 'var(--border-color)' }}
                  />
                  <YAxis
                    tick={{ fontFamily: 'monospace', fontSize: 10, fill: 'var(--text-secondary)' }}
                    axisLine={{ stroke: 'var(--border-color)' }}
                    tickLine={{ stroke: 'var(--border-color)' }}
                    unit="d"
                  />
                  <Tooltip content={<IntervalTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="intervalDays"
                    stroke="var(--text-primary)"
                    strokeWidth={2}
                    dot={{ r: 4, fill: 'var(--text-primary)', stroke: 'var(--bg-primary)', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: 'var(--text-primary)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
              {totalReviews === 1 && (
                <p style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
                  — Review more sessions to see the growth curve.
                </p>
              )}
            </div>
          )}

          {/* TAB: RATING HISTORY */}
          {!loading && !error && totalReviews > 0 && tab === 'ratings' && (
            <div>
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  color: 'var(--text-secondary)',
                  marginBottom: '0.75rem',
                  fontWeight: 700,
                }}
              >
                SELF-GRADE PER SESSION — 0 AGAIN / 1 HARD / 2 GOOD / 3 EASY
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={ratingData} margin={{ top: 8, right: 8, bottom: 0, left: -10 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border-color)"
                    strokeOpacity={0.2}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fontFamily: 'monospace', fontSize: 10, fill: 'var(--text-secondary)' }}
                    axisLine={{ stroke: 'var(--border-color)' }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 3]}
                    ticks={[0, 1, 2, 3]}
                    tickFormatter={(v) => RATING_LABELS[v] ?? String(v)}
                    tick={{ fontFamily: 'monospace', fontSize: 9, fill: 'var(--text-secondary)' }}
                    axisLine={{ stroke: 'var(--border-color)' }}
                    tickLine={false}
                    width={42}
                  />
                  <Tooltip content={<RatingTooltip />} />
                  <ReferenceLine
                    y={2}
                    stroke="var(--text-secondary)"
                    strokeDasharray="4 4"
                    strokeOpacity={0.4}
                  />
                  <Bar dataKey="rating" radius={0} maxBarSize={32}>
                    {ratingData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={ratingFill(entry.rating)}
                        stroke="var(--border-color)"
                        strokeWidth={1}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Distribution summary */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '0.5rem',
                  marginTop: '1rem',
                  paddingTop: '0.75rem',
                  borderTop: '2px solid var(--border-color)',
                }}
              >
                {ratingCounts.map((rc, i) => (
                  <div
                    key={i}
                    style={{
                      textAlign: 'center',
                      padding: '0.4rem',
                      border: '2px solid var(--border-color)',
                      background: 'var(--bg-secondary)',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '0.6rem',
                        color: 'var(--text-secondary)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        marginBottom: '0.15rem',
                      }}
                    >
                      {i} — {rc.grade}
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 900 }}>
                      {rc.count}x
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: FORECAST */}
          {!loading && !error && totalReviews > 0 && tab === 'forecast' && (
            <div>
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  color: 'var(--text-secondary)',
                  marginBottom: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  gap: '1.5rem',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                }}
              >
                <span>INTERVAL TRAJECTORY + NEXT 3 PREDICTED REVIEWS</span>
                <span style={{ display: 'flex', gap: '0.75rem' }}>
                  <span>
                    <span
                      style={{
                        display: 'inline-block',
                        width: '10px',
                        height: '10px',
                        background: 'var(--text-primary)',
                        marginRight: '4px',
                        verticalAlign: 'middle',
                      }}
                    />
                    PAST
                  </span>
                  <span>
                    <span
                      style={{
                        display: 'inline-block',
                        width: '10px',
                        height: '10px',
                        background: 'var(--bg-tertiary)',
                        border: '2px dashed var(--border-color)',
                        marginRight: '4px',
                        verticalAlign: 'middle',
                      }}
                    />
                    PROJECTED
                  </span>
                </span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={forecastData} margin={{ top: 8, right: 8, bottom: 0, left: -10 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border-color)"
                    strokeOpacity={0.2}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fontFamily: 'monospace', fontSize: 10, fill: 'var(--text-secondary)' }}
                    axisLine={{ stroke: 'var(--border-color)' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontFamily: 'monospace', fontSize: 10, fill: 'var(--text-secondary)' }}
                    axisLine={{ stroke: 'var(--border-color)' }}
                    tickLine={false}
                    unit="d"
                  />
                  <Tooltip content={<ForecastTooltip />} />
                  {forecastSplitIndex > 0 && forecastSplitIndex < forecastData.length && (
                    <ReferenceLine
                      x={forecastData[forecastSplitIndex - 1]?.label}
                      stroke="var(--text-secondary)"
                      strokeDasharray="6 3"
                      strokeWidth={1.5}
                    />
                  )}
                  <Bar dataKey="intervalDays" radius={0} maxBarSize={36}>
                    {forecastData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.type === 'past' ? 'var(--text-primary)' : 'var(--bg-tertiary)'}
                        stroke="var(--border-color)"
                        strokeWidth={entry.type === 'forecast' ? 2 : 1}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {nextReviewDate && (
                <div
                  style={{
                    marginTop: '0.75rem',
                    paddingTop: '0.75rem',
                    borderTop: '2px solid var(--border-color)',
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                  }}
                >
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>
                    NEXT SCHEDULED REVIEW:{' '}
                  </span>
                  <span style={{ fontWeight: 900 }}>{formatDateLong(nextReviewDate)}</span>
                </div>
              )}
              {history.length < 2 && (
                <p style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
                  — Forecast improves accuracy with more review sessions.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
