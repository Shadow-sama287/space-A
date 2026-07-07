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
  const maxStreak: number = profile?.max_streak || profile?.streak || 0;

  // Fetch user progress for calculation using joined problem data
  const { data: userProblemsData } = await supabase
    .from('user_problems')
    .select('problem_id, status, problems(sheet)')
    .eq('user_id', user.id);

  const activeProblems = userProblemsData || [];

  const solvedCount = activeProblems.length;
  const masteredCount = activeProblems.filter(up => up.status === 'mastered').length;

  const SHEET_TOTALS: Record<string, { label: string, total: number }> = {
    'striver_sde': { label: 'Striver SDE Sheet (191 Problems)', total: 191 },
    'striver_a2z': { label: "Striver's A2Z Sheet (474 Problems)", total: 474 },
    'tle_31': { label: "TLE Eliminators CP (372 Problems)", total: 372 },
  };

  const sheetProgressList = ['striver_sde', 'striver_a2z', 'tle_31'].map(sheetId => {
    const info = SHEET_TOTALS[sheetId];
    return {
      sheetId,
      label: info.label,
      totalCount: info.total,
      solvedCount: activeProblems.filter((up: any) => up.problems?.sheet === sheetId).length,
    };
  });

  return (
    <div>
      <h1 className="mb-2" style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase' }}>
        Settings & Preferences
      </h1>
      <SettingsClient
        userEmail={user.email || profile?.email || 'User'}
        joinedDate={profile?.created_at || new Date().toISOString()}
        streak={profile?.streak || 0}
        maxStreak={maxStreak}
        solvedCount={solvedCount}
        masteredCount={masteredCount}
        enabledSheets={enabledSheets}
        defaultSheet={defaultSheet}
        dailyGoal={dailyGoal}
        currentTheme={currentTheme}
        sheetProgressList={sheetProgressList}
      />
    </div>
  );
}
