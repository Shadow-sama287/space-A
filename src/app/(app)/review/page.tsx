import { createClient } from '@/lib/supabase/server';
import ReviewClient from './ReviewClient';
import { getProblemSubSheets } from '@/lib/neetcodeHelpers';

export const dynamic = 'force-dynamic';

export default async function ReviewPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Unauthorized</div>;
  }

  // Fetch profile to get enabled sheets and algorithm preferences
  const { data: profile } = await supabase
    .from('profiles')
    .select('enabled_sheets, algorithm, target_retention')
    .eq('id', user.id)
    .single();

  const enabledSheets: string[] = profile?.enabled_sheets || ['striver_sde', 'striver_a2z'];
  const algorithm: 'sm2' | 'fsrs' = (profile?.algorithm as 'sm2' | 'fsrs') || 'sm2';
  const targetRetention: number = profile?.target_retention !== undefined ? Number(profile.target_retention) : 0.90;

  // Fetch problems due today or earlier
  const { data: dueData } = await supabase
    .from('user_problems')
    .select(`
      id,
      problem_id,
      interval_days,
      ease_factor,
      repetitions,
      stability,
      difficulty,
      last_reviewed_at,
      next_review_date,
      status,
      problems (
        id,
        sheet,
        title,
        category,
        difficulty,
        leetcode_url,
        ninja_url
      )
    `)
    .eq('user_id', user.id)
    .neq('status', 'cooling')
    .lte('next_review_date', new Date().toISOString())
    .range(0, 5000);

  // Map database response to a flat type structure, filtering by enabled sheets
  const dueProblems = (dueData || [])
    .map((item: any) => {
      const p = item.problems;
      if (!p) return null;
      const subSheets = getProblemSubSheets(p);
      const isEnabled = enabledSheets.includes(p.sheet) || enabledSheets.some(s => subSheets.includes(s));
      if (!isEnabled) return null;
      return {
        id: p.id,
        user_problem_id: item.id,
        title: p.title,
        category: p.category,
        difficulty: p.difficulty,
        leetcode_url: p.leetcode_url,
        ninja_url: p.ninja_url,
        interval_days: item.interval_days,
        ease_factor: parseFloat(item.ease_factor),
        repetitions: item.repetitions,
        stability: item.stability ? parseFloat(item.stability) : null,
        difficulty_fsrs: item.difficulty ? parseFloat(item.difficulty) : null,
        last_reviewed_at: item.last_reviewed_at || null,
      };
    })
    .filter(Boolean);

  return (
    <div>
      <h1 className="mb-2" style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase' }}>
        Review Queue
      </h1>
      <p className="mb-3" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        Revise due problems using Anki-style SM-2 rating buttons to schedule future review points.
      </p>
      <ReviewClient
        initialDueProblems={dueProblems as any[]}
        algorithm={algorithm}
        targetRetention={targetRetention}
      />
    </div>
  );
}
