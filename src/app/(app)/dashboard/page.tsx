import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Unauthorized</div>;
  }

  // Fetch profile (streak)
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch all problems (for sheet stats)
  const { data: problems } = await supabase
    .from('problems')
    .select('id', { count: 'exact' });

  // Fetch user problems progress
  const { data: userProblems } = await supabase
    .from('user_problems')
    .select('*')
    .eq('user_id', user.id);

  // Fetch review history (last 28 days for heatmap)
  const twentyEightDaysAgo = new Date();
  twentyEightDaysAgo.setDate(twentyEightDaysAgo.getDate() - 28);
  const { data: history } = await supabase
    .from('review_history')
    .select('reviewed_at')
    .eq('user_id', user.id)
    .gte('reviewed_at', twentyEightDaysAgo.toISOString());

  // === CALCULATE STATS ===
  const totalProblemsCount = 80; // Hardcoded fallback or use actual problems length
  const dbProblemsCount = problems?.length || 0;
  const activeProblems = userProblems || [];
  
  // Due Problems Count
  const now = new Date();
  const dueProblemsCount = activeProblems.filter(up => {
    return new Date(up.next_review_date) <= now;
  }).length;

  // Mastered count (ease factor >= 4.0 or status = 'mastered')
  const masteredCount = activeProblems.filter(up => up.status === 'mastered').length;
  const reviewingCount = activeProblems.length - masteredCount;

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
        // Today includes everything scheduled for today or past due
        return reviewDate < nextDate;
      } else {
        // Future days check within the 24 hour window
        return reviewDate >= targetDate && reviewDate < nextDate;
      }
    }).length;

    // Formatting label (e.g. "Thu 02")
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
    d.setDate(d.getDate() - (27 - i)); // From 27 days ago to today
    const dateStr = d.toDateString();
    const hasReviewed = historyDates.has(dateStr);
    return {
      dayNum: d.getDate(),
      hasReviewed,
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
  });

  // === TOPIC/CATEGORY PROGRESS ===
  // Fetch detailed categories count
  const { data: categoryProblems } = await supabase
    .from('problems')
    .select('id, category');

  const categoryStats: { [key: string]: { total: number; solved: number } } = {};
  if (categoryProblems) {
    categoryProblems.forEach(p => {
      if (!categoryStats[p.category]) {
        categoryStats[p.category] = { total: 0, solved: 0 };
      }
      categoryStats[p.category].total += 1;
      
      // Check if user has solved it (is in activeProblems list)
      const isSolved = activeProblems.some(up => up.problem_id === p.id);
      if (isSolved) {
        categoryStats[p.category].solved += 1;
      }
    });
  }

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
        <div className="card" style={{ backgroundColor: 'var(--bg-secondary)', borderStyle: 'dashed' }}>
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
              {activeProblems.length} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>/ {dbProblemsCount}</span>
            </div>
            <div className="stat-label" style={{ fontSize: '0.65rem' }}>Total Sheets Solved</div>
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

        {/* RIGHT COLUMN: PROGRESS BY TOPIC */}
        <div>
          <div className="card">
            <h3 className="card-title">Topic Progress</h3>
            <p className="mb-3" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Completion status across Striver categories
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {Object.keys(categoryStats).map(cat => {
                const stats = categoryStats[cat];
                const pct = Math.round((stats.solved / stats.total) * 100);
                return (
                  <div key={cat} style={{ fontSize: '0.8rem' }}>
                    <div className="flex-between mb-1" style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                      <span>{cat}</span>
                      <span>{stats.solved}/{stats.total} ({pct}%)</span>
                    </div>
                    <div className="progress-bar-container" style={{ height: '12px' }}>
                      <div 
                        className="progress-bar-fill" 
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {Object.keys(categoryStats).length === 0 && (
                <div className="text-center" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  No active progress. Start solving from the explorer!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
