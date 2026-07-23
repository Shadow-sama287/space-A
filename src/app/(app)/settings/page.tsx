import { createClient } from '@/lib/supabase/server';
import SettingsClient from './SettingsClient';
import { fetchAllUserProblems } from '@/lib/supabase/queries';

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
  const algorithm: 'sm2' | 'fsrs' = (profile?.algorithm as 'sm2' | 'fsrs') || 'sm2';
  const targetRetention: number = profile?.target_retention !== undefined ? Number(profile.target_retention) : 0.90;
  const maxStreak: number = profile?.max_streak || profile?.streak || 0;

  // Fetch user progress for calculation using joined problem data
  const userProblemsData = await fetchAllUserProblems(supabase, user.id);

  const activeProblems = userProblemsData || [];

  const solvedCount = activeProblems.length;
  const masteredCount = activeProblems.filter(up => up.status === 'mastered').length;

  const SHEET_TOTALS: Record<string, { label: string, total: number }> = {
    'striver_sde': { label: 'Striver SDE Sheet (191 Problems)', total: 191 },
    'striver_a2z': { label: "Striver's A2Z Sheet (474 Problems)", total: 474 },
    'tle_31': { label: "TLE Eliminators CP (372 Problems)", total: 372 },
    'neetcode_all': { label: "NeetCode All Practice (973 Problems)", total: 973 },
    'neetcode_250': { label: "NeetCode 250 (250 Problems)", total: 250 },
    'neetcode_150': { label: "NeetCode 150 (150 Problems)", total: 150 },
    'blind_75': { label: "Blind 75 (75 Problems)", total: 75 },
  };

  const sheetProgressList = ['striver_sde', 'striver_a2z', 'tle_31', 'neetcode_all', 'neetcode_250', 'neetcode_150', 'blind_75'].map(sheetId => {
    const info = SHEET_TOTALS[sheetId];
    return {
      sheetId,
      label: info.label,
      totalCount: info.total,
      solvedCount: activeProblems.filter((up: any) => {
        if (!up.problems) return false;
        if (['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'].includes(sheetId)) {
          return up.problems.sheet === 'neetcode_all' || up.problems.sheet === sheetId || (up.problems.sub_sheets && up.problems.sub_sheets.includes(sheetId));
        }
        return up.problems.sheet === sheetId;
      }).length,
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
        algorithm={algorithm}
        targetRetention={targetRetention}
        sheetProgressList={sheetProgressList}
      />
    </div>
  );
}
