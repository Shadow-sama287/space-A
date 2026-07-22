import { createClient } from '@/lib/supabase/server';
import ProblemsClient from './ProblemsClient';
import { fetchAllProblems, fetchAllUserProblems } from '@/lib/supabase/queries';

export const dynamic = 'force-dynamic';

export default async function ProblemsPage() {
  const supabase = await createClient();

  // 1. Fetch user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch profile to get enabled sheets
  const { data: profile } = await supabase
    .from('profiles')
    .select('enabled_sheets')
    .eq('id', user?.id || '')
    .single();

  const enabledSheets: string[] = profile?.enabled_sheets || ['striver_sde', 'striver_a2z'];

  // 2. Fetch all problems (handles PostgREST 1000 limit)
  const problems = await fetchAllProblems(supabase);

  // 3. Fetch user progress (handles PostgREST 1000 limit)
  const userProgress = user?.id ? await fetchAllUserProblems(supabase, user.id) : [];

  return (
    <div>
      <h1 className="mb-2" style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase' }}>
        Problem Explorer
      </h1>
      <p className="mb-3" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        Explore sheets, solve problems randomly, or trigger a direct spaced repetition review.
      </p>
      <ProblemsClient
        problems={problems || []}
        userProgress={userProgress || []}
        enabledSheets={enabledSheets}
      />
    </div>
  );
}
