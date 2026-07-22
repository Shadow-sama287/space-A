import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import TopicProgressWidget from '@/components/TopicProgressWidget';
import Streak3DCanvas from '@/components/Streak3DCanvas';
import CoolOffDashboardCard from '@/components/CoolOffDashboardCard';
import { striverProblems } from '@/data/striverSheet';
import { striverA2ZProblems } from '@/data/striverA2ZSheet';
import { tle31Problems } from '@/data/tle31Sheet';
import { fetchAllUserProblems } from '@/lib/supabase/queries';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Unauthorized</div>;
  }

  const twentyEightDaysAgo = new Date();
  twentyEightDaysAgo.setDate(twentyEightDaysAgo.getDate() - 28);

  // Parallel database queries for 4x faster page loading
  const [
    { data: profile },
    userProblemsData,
    { data: history },
    { count: dbProblemsCount }
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    fetchAllUserProblems(supabase, user.id),
    supabase.from('review_history').select('reviewed_at').eq('user_id', user.id).gte('reviewed_at', twentyEightDaysAgo.toISOString()).range(0, 5000),
    supabase.from('problems').select('*', { count: 'exact', head: true })
  ]);

  const enabledSheets: string[] = profile?.enabled_sheets || ['striver_sde', 'striver_a2z'];

  // Streak Expiration Evaluation (Timezone-safe)
  let effectiveStreak = profile?.streak || 0;
  const lastActive = profile?.last_active_date;

  if (lastActive) {
    const todayLocal = new Date();
    const lastActiveDateObj = new Date(lastActive);
    const diffInTime = todayLocal.getTime() - lastActiveDateObj.getTime();
    const diffInDays = diffInTime / (1000 * 3600 * 24);

    // If more than 48 hours have passed without activity, reset streak
    if (diffInDays > 2.0) {
      effectiveStreak = 0;
      supabase.from('profiles').update({ streak: 0 }).eq('id', user.id).then(() => {});
    }
  }

  // Filter user progress to enabled sheets using the joined problem data
  const rawActiveProblems = userProblemsData || [];
  const activeProblems = rawActiveProblems.filter((up: any) => up.problems && enabledSheets.includes(up.problems.sheet));

  // === CALCULATE STATS ===
  const now = new Date();
  const dueProblemsCount = activeProblems.filter((up: any) => {
    return up.status !== 'cooling' && new Date(up.next_review_date) <= now;
  }).length;

  const masteredCount = activeProblems.filter((up: any) => up.status === 'mastered').length;
  const reviewingCount = activeProblems.filter((up: any) => up.status === 'reviewing').length;

  // === SHEET PROGRESS STATS ===
  const SHEET_TOTALS: Record<string, { label: string, total: number }> = {
    'striver_sde': { label: 'Striver SDE Sheet', total: 191 },
    'striver_a2z': { label: "Striver's A2Z Sheet", total: 474 },
    'tle_31': { label: "TLE Eliminators CP", total: 372 },
    'neetcode_all': { label: "NeetCode All Practice", total: 973 },
    'neetcode_250': { label: "NeetCode 250", total: 250 },
    'neetcode_150': { label: "NeetCode 150", total: 150 },
    'blind_75': { label: "Blind 75", total: 75 },
  };

  const sheetProgressList = enabledSheets.map(sheetId => {
    const info = SHEET_TOTALS[sheetId] || { label: sheetId.toUpperCase(), total: 0 };
    return {
      sheetId,
      label: info.label,
      totalCount: info.total,
      solvedCount: rawActiveProblems.filter((up: any) => {
        if (!up.problems) return false;
        if (['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'].includes(sheetId)) {
          return up.problems.sheet === 'neetcode_all' || up.problems.sheet === sheetId || (up.problems.sub_sheets && up.problems.sub_sheets.includes(sheetId));
        }
        return up.problems.sheet === sheetId;
      }).length,
    };
  });

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

  // === COMPUTE CATEGORY STATS ===
  const categoryStatsMap = new Map<string, { category: string, total: number, solved: number, sheet: string }>();

  const allStaticProblems = [...striverProblems, ...striverA2ZProblems, ...tle31Problems];
  allStaticProblems.forEach(p => {
    const key = `${p.sheet}::${p.category}`;
    if (!categoryStatsMap.has(key)) {
      categoryStatsMap.set(key, { category: p.category, total: 0, solved: 0, sheet: p.sheet });
    }
    categoryStatsMap.get(key)!.total += 1;
  });

  rawActiveProblems.forEach((up: any) => {
    if (up.problems) {
      const key = `${up.problems.sheet}::${up.problems.category}`;
      if (categoryStatsMap.has(key)) {
        categoryStatsMap.get(key)!.solved += 1;
      }
    }
  });

  const categoryStats = Array.from(categoryStatsMap.values());

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

      {/* TOP STATS GRIDS */}
      <div className="grid-3 mb-4">
        {/* DUE COUNT */}
        <div className="card text-center" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="stat-value">{dueProblemsCount}</div>
            <div className="stat-label">Due Reviews Today</div>
          </div>
          <div style={{ width: '100%' }}>
            {dueProblemsCount > 0 ? (
              <Link href="/review" className="btn btn-black" style={{ width: '100%', textTransform: 'uppercase', textDecoration: 'none' }}>
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
        <div className="card text-center" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', padding: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="stat-value">{effectiveStreak}d</div>
            <div className="stat-label">Daily Solve Streak</div>
          </div>

          <div style={{ margin: '0.2rem 0' }}>
            <Streak3DCanvas streak={effectiveStreak} lastActiveDate={profile?.last_active_date} />
          </div>

          <p suppressHydrationWarning style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            {profile?.last_active_date 
              ? `Last active: ${profile.last_active_date.split('T')[0]}`
              : 'Start your streak today!'}
          </p>
        </div>

        {/* SOLVING SUMMARY */}
        <div className="card text-center" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', width: '100%' }}>
            <div className="stat-box" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0.6rem' }}>
              <div className="stat-value" style={{ fontSize: '1.5rem' }}>{reviewingCount}</div>
              <div className="stat-label" style={{ fontSize: '0.65rem' }}>Reviewing</div>
            </div>
            <div className="stat-box" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0.6rem' }}>
              <div className="stat-value" style={{ fontSize: '1.5rem' }}>{masteredCount}</div>
              <div className="stat-label" style={{ fontSize: '0.65rem' }}>Mastered</div>
            </div>
          </div>
          <div className="stat-box" style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0.6rem' }}>
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>
              {activeProblems.length} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>/ {enabledSheets.reduce((acc, sheet) => acc + (SHEET_TOTALS[sheet]?.total || 0), 0)}</span>
            </div>
            <div className="stat-label" style={{ fontSize: '0.65rem' }}>Active Sheet Solved</div>
          </div>
        </div>
      </div>

      {/* MENTAL RECOVERY & COOL-OFF CORNER */}
      <CoolOffDashboardCard
        items={rawActiveProblems.filter((up: any) => up.status === 'cooling')}
        allProblemsMap={new Map(rawActiveProblems.filter((up: any) => up.problems).map((up: any) => [up.problem_id, up.problems.category ? `${up.problems.title} (${up.problems.category})` : up.problems.title]))}
      />

      {/* ACTIVE SHEETS SUMMARY BANNER */}
      <div className="card mb-4" style={{ padding: '0.85rem 1.25rem', backgroundColor: 'var(--bg-secondary)', borderLeft: '6px solid #000' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 'bold' }}>
            ACTIVE SHEETS: {enabledSheets.length > 0 ? enabledSheets.map(s => (SHEET_TOTALS[s]?.label || s.toUpperCase())).join(' | ') : 'NONE ENABLED'}
          </div>
          <Link href="/settings" className="btn btn-sm btn-black" style={{ textTransform: 'uppercase', fontSize: '0.75rem', textDecoration: 'none' }}>
            MANAGE SHEETS
          </Link>
        </div>
      </div>

      {/* DASHBOARD ANALYTICS ROWS */}
      <div className="grid-main">
        {/* LEFT COLUMN: CHARTS */}
        <div>
          {/* 7-DAY FORECAST */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <h3 className="card-title" style={{ margin: 0 }}>7-Day Review Forecast</h3>
              <Link href="/timeline" style={{ fontSize: '0.7rem', fontWeight: 900, fontFamily: 'monospace', textTransform: 'uppercase', textDecoration: 'underline' }}>
                FULL TIMELINE ➔
              </Link>
            </div>
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
            categoryStats={categoryStats}
            enabledSheets={enabledSheets}
          />
        </div>
      </div>
    </div>
  );
}
