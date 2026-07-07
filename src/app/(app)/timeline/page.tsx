import { createClient } from '@/lib/supabase/server';
import TimelineClient from './TimelineClient';

export const dynamic = 'force-dynamic';

export default async function TimelinePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Unauthorized</div>;
  }

  // Parallel database queries
  const [{ data: profile }, { data: userProblemsData }] =
    await Promise.all([
      supabase.from('profiles').select('enabled_sheets').eq('id', user.id).single(),
      supabase.from('user_problems').select('*, problems(*)').eq('user_id', user.id),
    ]);

  const userProblems: any[] = [];
  const allProblems: any[] = [];
  const seenProblems = new Set();

  (userProblemsData || []).forEach((item: any) => {
    const p = item.problems;
    delete item.problems; // Remove nested object to match flat structure expected
    userProblems.push(item);
    
    if (p && !seenProblems.has(p.id)) {
      allProblems.push(p);
      seenProblems.add(p.id);
    }
  });

  const enabledSheets: string[] = profile?.enabled_sheets || ['striver_sde', 'striver_a2z'];

  return (
    <div>
      <h1 className="mb-2" style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase' }}>
        Revision Schedule Timeline
      </h1>
      <p className="mb-3" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        Explore scheduled spaced repetition milestones, upcoming review dates, and SM-2 retention projections.
      </p>
      <TimelineClient
        problems={allProblems || []}
        userProgress={userProblems || []}
        enabledSheets={enabledSheets}
      />
    </div>
  );
}
