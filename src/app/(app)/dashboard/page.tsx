import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import TopicProgressWidget from '@/components/TopicProgressWidget';
import Streak3DCanvas from '@/components/Streak3DCanvas';
import CoolOffDashboardCard from '@/components/CoolOffDashboardCard';
import { striverProblems } from '@/data/striverSheet';
import { striverA2ZProblems } from '@/data/striverA2ZSheet';
import { tle31Problems } from '@/data/tle31Sheet';
import { fetchAllUserProblems, fetchAllReviewHistory } from '@/lib/supabase/queries';
import { getProblemSubSheets } from '@/lib/neetcodeHelpers';
import DashboardChartsClient from '@/components/DashboardChartsClient';

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
    { count: dbProblemsCount },
    allHistory
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    fetchAllUserProblems(supabase, user.id),
    supabase.from('review_history').select('reviewed_at').eq('user_id', user.id).gte('reviewed_at', twentyEightDaysAgo.toISOString()).range(0, 5000),
    supabase.from('problems').select('*', { count: 'exact', head: true }),
    fetchAllReviewHistory(supabase, user.id)
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
      try {
        await supabase.from('profiles').update({ 
          streak: 0,
          max_streak: profile?.max_streak || 0
        }).eq('id', user.id);
      } catch (err) {
        console.error('Failed to reset streak:', err);
      }
    }
  }

  // Filter user progress to enabled sheets using the joined problem data
  const rawActiveProblems = userProblemsData || [];
  const activeProblems = rawActiveProblems.filter((up: any) => {
    if (!up.problems) return false;
    const subSheets = getProblemSubSheets(up.problems);
    return enabledSheets.includes(up.problems.sheet) || enabledSheets.some(s => subSheets.includes(s));
  });

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
        const subSheets = getProblemSubSheets(up.problems);
        return up.problems.sheet === sheetId || subSheets.includes(sheetId);
      }).length,
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

  // === DAILY GOAL CALCULATIONS ===
  const dailyGoal = profile?.daily_goal;
  const todayDateStr = new Date().toDateString();
  const problemsSolvedTodayCount = new Set(
    (allHistory || [])
      .filter((h: any) => new Date(h.reviewed_at).toDateString() === todayDateStr)
      .map((h: any) => h.problem_id)
  ).size;

  return (
    <div>
      <div className="flex-between mb-3 border-b-brutal">
        <h1 className="text-2xl font-black text-uppercase">
          Dashboard
        </h1>
        <div className="font-bold text-sm text-uppercase">
          User: {profile?.email}
        </div>
      </div>

      {/* NO PROBLEMS SEEDED WARNING */}
      {dbProblemsCount === 0 && (
        <div className="card bg-secondary border-dashed mb-4">
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
        <div className="card text-center flex-col-center h-full gap-1 p-5">
          
          {dueProblemsCount > 0 && (
            <div className="flex-col-center">
              <div className="stat-value">{dueProblemsCount}</div>
              <div className="stat-label">Due Reviews Today</div>
            </div>
          )}

          {/* DAILY GOAL WIDGET */}
          <div className={`daily-goal-wrapper ${dueProblemsCount > 0 ? 'daily-goal-active' : 'daily-goal-empty'}`}>
            {!dailyGoal ? (
              <div className="flex-col-center gap-xs">
                <span className={`text-uppercase text-secondary ${dueProblemsCount === 0 ? 'text-sm' : 'text-xs'}`}>Daily Goal Not Set</span>
                <Link href="/settings" className="btn btn-outline btn-small" className={`${dueProblemsCount === 0 ? 'text-sm mt-1' : 'text-xxs'}`}>
                  SET GOAL
                </Link>
              </div>
            ) : (
              <div className="flex-col-center">
                {problemsSolvedTodayCount === dailyGoal ? (
                  <div className="stat-value glitch-text" className={`${dueProblemsCount === 0 ? 'text-huge' : 'text-xl'} leading-none`}>
                    0
                  </div>
                ) : problemsSolvedTodayCount > dailyGoal ? (
                  <div className="stat-value glitch-text" className={`${dueProblemsCount === 0 ? 'text-huge' : 'text-xl'} leading-none`}>
                    {problemsSolvedTodayCount}
                  </div>
                ) : (
                  <div className="flex-baseline">
                    <div className="stat-value" className={`${dueProblemsCount === 0 ? 'text-huge' : 'text-xl'} leading-none`}>{problemsSolvedTodayCount}</div>
                    <div className={`font-bold text-secondary ${dueProblemsCount === 0 ? 'text-xl' : 'text-sm'}`}>/ {dailyGoal}</div>
                  </div>
                )}
                <div className="stat-label" className={`${dueProblemsCount === 0 ? 'text-sm mt-1' : 'text-xxs my-sm'}`}>
                  {problemsSolvedTodayCount > dailyGoal ? 'Total Solved Today' : 'Daily Goal Progress'}
                </div>
              </div>
            )}
          </div>

          <div className="w-full mt-auto">
            {dueProblemsCount > 0 ? (
              <Link href="/review" className="btn btn-black w-full text-uppercase no-underline">
                Start Review Session
              </Link>
            ) : (
              <button disabled className="btn btn-outline w-full text-uppercase cursor-not-allowed">
                Queue Clear
              </button>
            )}
          </div>
        </div>

        {/* STREAK */}
        <div className="card text-center flex-col-center h-full gap-sm p-5">
          <div className="flex-col-center">
            <div className="stat-value">{effectiveStreak}d</div>
            <div className="stat-label">Daily Solve Streak</div>
          </div>

          <div className="my-sm">
            <Streak3DCanvas streak={effectiveStreak} lastActiveDate={profile?.last_active_date} />
          </div>

          <p suppressHydrationWarning className="text-xs text-secondary text-uppercase">
            {profile?.last_active_date 
              ? `Last active: ${profile.last_active_date.split('T')[0]}`
              : 'Start your streak today!'}
          </p>
        </div>

        {/* SOLVING SUMMARY */}
        <div className="card text-center flex-col-center gap-2 p-5 h-full">
          <div className="grid-cols-2 gap-2">
            <div className="stat-box flex-col-center p-2">
              <div className="stat-value text-xl">{reviewingCount}</div>
              <div className="stat-label text-xxs">Reviewing</div>
            </div>
            <div className="stat-box flex-col-center p-2">
              <div className="stat-value text-xl">{masteredCount}</div>
              <div className="stat-label text-xxs">Mastered</div>
            </div>
          </div>
          <div className="stat-box w-full flex-col-center p-2">
            <div className="stat-value text-xl">
              {activeProblems.length} <span className="text-sm text-secondary">/ {enabledSheets.reduce((acc, sheet) => acc + (SHEET_TOTALS[sheet]?.total || 0), 0)}</span>
            </div>
            <div className="stat-label text-xxs">Active Sheet Solved</div>
          </div>
        </div>
      </div>

      {/* MENTAL RECOVERY & COOL-OFF CORNER */}
      <CoolOffDashboardCard
        items={rawActiveProblems.filter((up: any) => up.status === 'cooling')}
        allProblemsMap={new Map(rawActiveProblems.filter((up: any) => up.problems).map((up: any) => [up.problem_id, up.problems.category ? `${up.problems.title} (${up.problems.category})` : up.problems.title]))}
      />

      {/* ACTIVE SHEETS SUMMARY BANNER */}
      <div className="card mb-4 p-5 bg-secondary border-l-brutal">
        <div className="flex-between flex-wrap gap-2">
          <div className="font-mono text-sm font-bold">
            ACTIVE SHEETS: {enabledSheets.length > 0 ? enabledSheets.map(s => (SHEET_TOTALS[s]?.label || s.toUpperCase())).join(' | ') : 'NONE ENABLED'}
          </div>
          <Link href="/settings" className="btn btn-sm btn-black text-uppercase text-xs no-underline">
            MANAGE SHEETS
          </Link>
        </div>
      </div>

      {/* DASHBOARD ANALYTICS ROWS */}
      <div className="grid-main">
        {/* LEFT COLUMN: CHARTS */}
        <DashboardChartsClient 
          activeProblems={activeProblems}
          history={history || []}
          allHistory={allHistory || []}
        />

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
