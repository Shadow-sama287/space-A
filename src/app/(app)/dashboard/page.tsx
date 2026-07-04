import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import TopicProgressWidget from '@/components/TopicProgressWidget';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Unauthorized</div>;
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const enabledSheets: string[] = profile?.enabled_sheets || ['striver_sde', 'striver_a2z'];

  // Fetch all problems
  const { data: allProblems } = await supabase
    .from('problems')
    .select('id, sheet, category');

  const problems = allProblems || [];
  const dbProblemsCount = problems.length;

  // Filter problems to enabled sheets only for Dashboard metrics
  const enabledProblemIds = new Set(
    problems.filter(p => enabledSheets.includes(p.sheet)).map(p => p.id)
  );

  // Fetch user problems progress
  const { data: userProblems } = await supabase
    .from('user_problems')
    .select('*')
    .eq('user_id', user.id);

  const rawActiveProblems = userProblems || [];

  // Filter user progress to enabled sheets
  const activeProblems = rawActiveProblems.filter(up => enabledProblemIds.has(up.problem_id));

  // Fetch review history (last 28 days for heatmap)
  const twentyEightDaysAgo = new Date();
  twentyEightDaysAgo.setDate(twentyEightDaysAgo.getDate() - 28);
  const { data: history } = await supabase
    .from('review_history')
    .select('reviewed_at')
    .eq('user_id', user.id)
    .gte('reviewed_at', twentyEightDaysAgo.toISOString());

  // === CALCULATE STATS ===
  const now = new Date();
  const dueProblemsCount = activeProblems.filter(up => {
    return new Date(up.next_review_date) <= now;
  }).length;

  const masteredCount = activeProblems.filter(up => up.status === 'mastered').length;
  const reviewingCount = activeProblems.length - masteredCount;

  // === SHEET PROGRESS STATS ===
  const sheetProgressList = [
    {
      sheetId: 'striver_sde',
      label: 'Striver SDE Sheet',
      totalCount: problems.filter(p => p.sheet === 'striver_sde').length || 191,
      solvedCount: rawActiveProblems.filter(up => {
        const p = problems.find(prob => prob.id === up.problem_id);
        return p?.sheet === 'striver_sde';
      }).length,
    },
    {
      sheetId: 'striver_a2z',
      label: "Striver's A2Z Sheet",
      totalCount: problems.filter(p => p.sheet === 'striver_a2z').length || 474,
      solvedCount: rawActiveProblems.filter(up => {
        const p = problems.find(prob => prob.id === up.problem_id);
        return p?.sheet === 'striver_a2z';
      }).length,
    },
  ];

  // === 7-DAY FORECAST ===
  const forecast = Array.from({ length: 7 }).map((_, i) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + i);
    targetDate.setHours(0, 0, 0, 0);

    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const count = activeProblems.filter(up => {
      const reviewDate = new Date(up.next_review_date);
      if (i === 0) {
        return reviewDate < nextDate;
      } else {
        return reviewDate >= targetDate && reviewDate < nextDate;
      }
    }).length;

    const label = targetDate.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit' });
    return { label, count };
  });

  const maxForecastCount = Math.max(...forecast.map(f => f.count), 1);

  // === 28-DAY CALENDAR HEATMAP ===
  const historyDates = new Set(
    (history || []).map(h => {
      return new Date(h.reviewed_at).toDateString();
    })
  );

  const heatmapDays = Array.from({ length: 28 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (27 - i));
    const dateStr = d.toDateString();
    const hasReviewed = historyDates.has(dateStr);
    return {
      dayNum: d.getDate(),
      hasReviewed,
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
  });

  return (
    <div>
      <div className="flex-between mb-3" style={{ borderBottom: '3px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase' }}>
          Dashboard
        </h1>
        <div style={{ fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase' }}>
          User: {profile?.email}
        </div>
      </div>

      {/* NO PROBLEMS SEEDED WARNING */}
      {dbProblemsCount === 0 && (
        <div className="card" style={{ backgroundColor: 'var(--bg-secondary)', borderStyle: 'dashed', marginBottom: '2rem' }}>
          <h3 className="card-title">Setup Required</h3>
          <p className="mb-2">Your database contains no problems. Please navigate to the Explorer tab and seed the database first.</p>
          <Link href="/problems" className="btn btn-black">
            Go to Explorer
          </Link>
        </div>
      )}

      {/* ACTIVE SHEETS SUMMARY BANNER */}
      <div className="card mb-4" style={{ padding: '0.85rem 1.25rem', backgroundColor: 'var(--bg-secondary)', borderLeft: '6px solid #000' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 'bold' }}>
            ACTIVE SHEETS: {enabledSheets.length > 0 ? enabledSheets.map(s => s === 'striver_sde' ? 'STRIVER SDE (191)' : 'STRIVER A2Z (474)').join(' | ') : 'NONE ENABLED'}
          </div>
          <Link href="/settings" className="btn btn-sm btn-black" style={{ textTransform: 'uppercase', fontSize: '0.75rem', textDecoration: 'none' }}>
            MANAGE SHEETS
          </Link>
        </div>
      </div>

      {/* TOP STATS GRIDS */}
      <div className="grid-3 mb-4">
        {/* DUE COUNT */}
        <div className="card text-center" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="stat-value">{dueProblemsCount}</div>
            <div className="stat-label">Due Reviews Today</div>
          </div>
          <div className="mt-2">
            {dueProblemsCount > 0 ? (
              <Link href="/review" className="btn btn-black" style={{ width: '100%', textTransform: 'uppercase' }}>
                Start Review Session
              </Link>
            ) : (
              <button disabled className="btn btn-outline" style={{ width: '100%', textTransform: 'uppercase', cursor: 'not-allowed' }}>
                Queue Clear
              </button>
            )}
          </div>
        </div>

        {/* STREAK */}
        <div className="card text-center">
          <div className="stat-value">{profile?.streak || 0}d</div>
          <div className="stat-label">Daily Solve Streak</div>
          <p className="mt-2" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            {profile?.last_active_date 
              ? `Last active: ${new Date(profile.last_active_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
              : 'Start your streak today!'}
          </p>
        </div>

        {/* SOLVING SUMMARY */}
        <div className="card text-center" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '1rem' }}>
          <div className="stat-box">
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>{reviewingCount}</div>
            <div className="stat-label" style={{ fontSize: '0.65rem' }}>Reviewing</div>
          </div>
          <div className="stat-box">
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>{masteredCount}</div>
            <div className="stat-label" style={{ fontSize: '0.65rem' }}>Mastered</div>
          </div>
          <div className="stat-box" style={{ gridColumn: 'span 2' }}>
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>
              {activeProblems.length} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>/ {enabledProblemIds.size}</span>
            </div>
            <div className="stat-label" style={{ fontSize: '0.65rem' }}>Active Sheet Solved</div>
          </div>
        </div>
      </div>

      {/* DASHBOARD ANALYTICS ROWS */}
      <div className="grid-main">
        {/* LEFT COLUMN: CHARTS */}
        <div>
          {/* 7-DAY FORECAST */}
          <div className="card">
            <h3 className="card-title">7-Day Review Forecast</h3>
            <p className="mb-2" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Number of reviews scheduled for the upcoming week
            </p>
            <div className="bar-chart mt-1">
              {forecast.map((f, i) => {
                const pct = (f.count / maxForecastCount) * 100;
                return (
                  <div key={i} className="bar-container">
                    <div style={{ fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '2px' }}>
                      {f.count > 0 ? f.count : ''}
                    </div>
                    <div 
                      className="bar-fill" 
                      style={{ 
                        height: `${Math.max(pct, 4)}%`,
                        backgroundColor: i === 0 && f.count > 0 ? 'var(--text-primary)' : 'var(--bg-tertiary)',
                        borderWidth: f.count > 0 ? '2px' : '1px'
                      }}
                    />
                    <div className="bar-label">{f.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 28-DAY CALENDAR HEATMAP */}
          <div className="card">
            <h3 className="card-title">28-Day Review Activity</h3>
            <p className="mb-3" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Days you completed at least one spaced repetition review
            </p>
            <div className="heatmap-grid">
              {heatmapDays.map((d, index) => (
                <div 
                  key={index} 
                  title={d.label}
                  className={`heatmap-day ${d.hasReviewed ? 'heatmap-active' : ''}`}
                >
                  {d.dayNum}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PROGRESS BY TOPIC WIDGET */}
        <div>
          <TopicProgressWidget
            categoryProblems={problems}
            activeProblems={activeProblems}
            enabledSheets={enabledSheets}
          />
        </div>
      </div>
    </div>
  );
}
