import { createClient } from '@/lib/supabase/server';
import SettingsClient from './SettingsClient';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
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
  const defaultSheet: string = profile?.default_sheet || 'striver_sde';
  const dailyGoal: number = profile?.daily_goal || 10;
  const currentTheme: string = profile?.theme || 'monochrome';

  // Fetch problems & user progress for calculation
  const { data: allProblems } = await supabase
    .from('problems')
    .select('id, sheet');

  const { data: userProblems } = await supabase
    .from('user_problems')
    .select('problem_id')
    .eq('user_id', user.id);

  const problems = allProblems || [];
  const activeProblems = userProblems || [];

  const sheetProgressList = [
    {
      sheetId: 'striver_sde',
      label: 'Striver SDE Sheet (191 Problems)',
      totalCount: problems.filter(p => p.sheet === 'striver_sde').length || 191,
      solvedCount: activeProblems.filter(up => {
        const p = problems.find(prob => prob.id === up.problem_id);
        return p?.sheet === 'striver_sde';
      }).length,
    },
    {
      sheetId: 'striver_a2z',
      label: "Striver's A2Z Sheet (474 Problems)",
      totalCount: problems.filter(p => p.sheet === 'striver_a2z').length || 474,
      solvedCount: activeProblems.filter(up => {
        const p = problems.find(prob => prob.id === up.problem_id);
        return p?.sheet === 'striver_a2z';
      }).length,
    },
  ];

  return (
    <div>
      <h1 className="mb-2" style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase' }}>
        Settings & Preferences
      </h1>
      <SettingsClient
        userEmail={user.email || profile?.email || 'User'}
        joinedDate={profile?.created_at || new Date().toISOString()}
        streak={profile?.streak || 0}
        enabledSheets={enabledSheets}
        defaultSheet={defaultSheet}
        dailyGoal={dailyGoal}
        currentTheme={currentTheme}
        sheetProgressList={sheetProgressList}
      />
    </div>
  );
}
