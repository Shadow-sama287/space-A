'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function coolOffProblemAction(problemId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Fetch current cooling problems for user
  const { data: coolingProblems } = await supabase
    .from('user_problems')
    .select('id, cooling_queue_tier')
    .eq('user_id', user.id)
    .eq('status', 'cooling');

  const primaryCount = (coolingProblems || []).filter(p => p.cooling_queue_tier === 'primary').length;
  const secondaryCount = (coolingProblems || []).filter(p => p.cooling_queue_tier === 'secondary').length;

  let assignedTier: 'primary' | 'secondary' = 'primary';
  let coolingUntil: string | null = null;

  if (primaryCount < 3) {
    assignedTier = 'primary';
    const d = new Date();
    d.setDate(d.getDate() + 3); // 3-day cooling period
    coolingUntil = d.toISOString();
  } else if (secondaryCount < 10) {
    assignedTier = 'secondary';
    coolingUntil = null; // Waits in secondary queue until promoted to primary
  } else {
    return {
      success: false,
      error: 'COOL-OFF QUEUE FULL: You have 3 Primary and 10 Secondary problems snoozed (Max 13). Re-attempt or un-pause a problem first!',
    };
  }

  // Fetch existing user_problem row if any
  const { data: userProblem } = await supabase
    .from('user_problems')
    .select('id, repetitions, last_reviewed_at')
    .eq('user_id', user.id)
    .eq('problem_id', problemId)
    .maybeSingle();

  // Enforce post-first attempt rule: Only allow snoozing after at least 1 attempt
  if (!userProblem || (userProblem.repetitions === 0 && !userProblem.last_reviewed_at)) {
    return {
      success: false,
      error: 'You can only snooze a problem after attempting it at least once in your daily reviews!',
    };
  }

  // Upsert user_problem row
  const { error } = await supabase.from('user_problems').upsert(
    {
      id: userProblem?.id,
      user_id: user.id,
      problem_id: problemId,
      status: 'cooling',
      cooling_queue_tier: assignedTier,
      cooling_until: coolingUntil,
    },
    { onConflict: 'user_id,problem_id' }
  );

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/dashboard');
  revalidatePath('/problems');
  revalidatePath('/review');
  revalidatePath('/timeline');

  return {
    success: true,
    tier: assignedTier,
    message:
      assignedTier === 'primary'
        ? 'Problem placed in 3-Day Cool-Off Queue! It will stay away from your daily reviews until you feel ready.'
        : 'Primary Cool-Off Queue is full (3/3). Problem placed in Secondary Waiting Queue.',
  };
}

export async function resumeProblemAction(problemId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // 1. Resume target problem back into active reviewing
  const { error: resumeErr } = await supabase
    .from('user_problems')
    .update({
      status: 'reviewing',
      cooling_queue_tier: null,
      cooling_until: null,
      next_review_date: new Date().toISOString(),
    })
    .eq('user_id', user.id)
    .eq('problem_id', problemId);

  if (resumeErr) {
    throw new Error(resumeErr.message);
  }

  // 2. Promote oldest Secondary problem to Primary if space freed up
  const { data: secondaryProblems } = await supabase
    .from('user_problems')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'cooling')
    .eq('cooling_queue_tier', 'secondary')
    .order('created_at', { ascending: true })
    .limit(1);

  if (secondaryProblems && secondaryProblems.length > 0) {
    const oldestSecondaryId = secondaryProblems[0].id;
    const d = new Date();
    d.setDate(d.getDate() + 3);

    await supabase
      .from('user_problems')
      .update({
        cooling_queue_tier: 'primary',
        cooling_until: d.toISOString(),
      })
      .eq('id', oldestSecondaryId);
  }

  revalidatePath('/dashboard');
  revalidatePath('/problems');
  revalidatePath('/review');
  revalidatePath('/timeline');

  return { success: true, message: 'Problem returned to active Review Queue!' };
}
