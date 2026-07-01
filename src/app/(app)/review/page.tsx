import { createClient } from '@/lib/supabase/server';
import ReviewClient from './ReviewClient';

export const dynamic = 'force-dynamic';

export default async function ReviewPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Unauthorized</div>;
  }

  // Fetch problems due today or earlier
  const { data: dueData, error } = await supabase
    .from('user_problems')
    .select(`
      id,
      problem_id,
      interval_days,
      ease_factor,
      repetitions,
      next_review_date,
      status,
      problems (
        id,
        title,
        category,
        difficulty,
        leetcode_url,
        ninja_url
      )
    `)
    .eq('user_id', user.id)
    .lte('next_review_date', new Date().toISOString());

  // Map database response to a flat type structure
  const dueProblems = (dueData || [])
    .map((item: any) => {
      const p = item.problems;
      if (!p) return null;
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
      <ReviewClient initialDueProblems={dueProblems as any[]} />
    </div>
  );
}
