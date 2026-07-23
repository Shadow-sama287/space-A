'use server';

import { createClient } from '@/lib/supabase/server';
import { calculateNextReview } from '@/lib/scheduler';
import { revalidatePath } from 'next/cache';

export async function submitReview(problemId: string, rating: number, clientLocalDate?: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // 0. Fetch user profile for algorithm preference
  const { data: profile } = await supabase
    .from('profiles')
    .select('algorithm, target_retention, streak, last_active_date, max_streak')
    .eq('id', user.id)
    .maybeSingle();

  const algorithm = profile?.algorithm || 'sm2';
  const targetRetention = profile?.target_retention || 0.90;

  // 1. Fetch current progress if any
  const { data: userProblem } = await supabase
    .from('user_problems')
    .select('*')
    .eq('user_id', user.id)
    .eq('problem_id', problemId)
    .maybeSingle();

  const currentInterval = userProblem?.interval_days || 0;
  const currentEF = userProblem ? parseFloat(userProblem.ease_factor) : 2.5;
  const currentReps = userProblem?.repetitions || 0;
  const currentStability = userProblem?.stability ? parseFloat(userProblem.stability) : null;
  const currentDifficulty = userProblem?.difficulty ? parseFloat(userProblem.difficulty) : null;

  // 2. Compute next parameters via Unified Scheduler (SM-2 or FSRS v5)
  const {
    intervalDays,
    nextReviewDate,
    easeFactor,
    repetitions,
    stability,
    difficulty,
    status,
  } = calculateNextReview({
    algorithm,
    targetRetention,
    rating,
    currentInterval,
    currentEF,
    currentReps,
    stability: currentStability,
    difficulty: currentDifficulty,
    lastReviewedAt: userProblem?.last_reviewed_at,
  });

  // 3. Upsert progress (with schema fallback if stability/difficulty columns are missing on remote DB)
  const upsertPayload: Record<string, any> = {
    id: userProblem?.id, // Keep ID to update existing row
    user_id: user.id,
    problem_id: problemId,
    interval_days: intervalDays,
    ease_factor: easeFactor,
    repetitions: repetitions,
    next_review_date: nextReviewDate.toISOString(),
    last_reviewed_at: new Date().toISOString(),
    status,
  };

  if (stability !== null) upsertPayload.stability = stability;
  if (difficulty !== null) upsertPayload.difficulty = difficulty;

  let { error: upsertError } = await supabase.from('user_problems').upsert(upsertPayload);

  // If DB lacks stability/difficulty columns, strip them and retry
  if (upsertError && upsertError.message.includes('column')) {
    delete upsertPayload.stability;
    delete upsertPayload.difficulty;
    const retry = await supabase.from('user_problems').upsert(upsertPayload);
    upsertError = retry.error;
  }

  if (upsertError) throw new Error(upsertError.message);

  // 4. Log in review_history
  await supabase.from('review_history').insert({
    user_id: user.id,
    problem_id: problemId,
    rating,
    ease_factor: easeFactor,
    interval_days: intervalDays,
  });

  // 5. Update Streak (Timezone-aware)
  const localDateStr = clientLocalDate || (() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  })();

  if (profile) {
    let newStreak = profile.streak || 0;
    const currentMax = profile.max_streak || 0;
    const lastActive = profile.last_active_date;

    if (!lastActive) {
      newStreak = 1;
    } else if (lastActive !== localDateStr) {
      const todayDate = new Date(localDateStr);
      const lastActiveDate = new Date(lastActive);
      const diffDays = Math.round((todayDate.getTime() - lastActiveDate.getTime()) / (1000 * 3600 * 24));

      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    }

    const newMax = Math.max(currentMax, newStreak);

    await supabase
      .from('profiles')
      .update({
        streak: newStreak,
        max_streak: newMax,
        last_active_date: localDateStr,
      })
      .eq('id', user.id);
  }

  revalidatePath('/dashboard');
  revalidatePath('/problems');
  revalidatePath('/review');

  return { success: true };
}
