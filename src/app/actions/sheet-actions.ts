'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleSheetAction(sheetId: string, enable: boolean) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Get current profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('enabled_sheets')
    .eq('id', user.id)
    .single();

  const currentSheets: string[] = profile?.enabled_sheets || ['striver_sde', 'striver_a2z'];

  let updatedSheets: string[];
  if (enable) {
    updatedSheets = Array.from(new Set([...currentSheets, sheetId]));
  } else {
    updatedSheets = currentSheets.filter(s => s !== sheetId);
  }

  const { error } = await supabase
    .from('profiles')
    .update({ enabled_sheets: updatedSheets })
    .eq('id', user.id);

  if (error) {
    throw new Error(`Failed to update sheet settings: ${error.message}`);
  }

  revalidatePath('/dashboard');
  revalidatePath('/problems');
  revalidatePath('/review');

  return { success: true, enabledSheets: updatedSheets };
}

export async function resetSheetProgressAction(sheetId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Get problem IDs belonging to this sheet
  const { data: sheetProblems } = await supabase
    .from('problems')
    .select('id')
    .eq('sheet', sheetId)
    .range(0, 5000);

  if (sheetProblems && sheetProblems.length > 0) {
    const problemIds = sheetProblems.map(p => p.id);

    // Delete user_problems for this sheet for this user
    await supabase
      .from('user_problems')
      .delete()
      .eq('user_id', user.id)
      .in('problem_id', problemIds);
  }

  revalidatePath('/dashboard');
  revalidatePath('/problems');
  revalidatePath('/review');

  return { success: true };
}

export async function updatePreferencesAction(params: { defaultSheet?: string; dailyGoal?: number; theme?: string }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const updates: any = {};
  if (params.defaultSheet !== undefined) updates.default_sheet = params.defaultSheet;
  if (params.dailyGoal !== undefined) updates.daily_goal = params.dailyGoal;
  if (params.theme !== undefined) updates.theme = params.theme;

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id);

  if (error) {
    // If theme column isn't in remote DB yet, retry without theme so defaultSheet/dailyGoal updates still succeed
    if (params.theme !== undefined && error.message.includes("Could not find the 'theme' column")) {
      delete updates.theme;
      if (Object.keys(updates).length > 0) {
        await supabase.from('profiles').update(updates).eq('id', user.id);
      }
      return { success: true, warning: 'Theme saved locally (run SQL migration on Supabase to sync across devices).' };
    }
    throw new Error(`Failed to update preferences: ${error.message}`);
  }

  revalidatePath('/dashboard');
  revalidatePath('/problems');
  revalidatePath('/settings');

  return { success: true };
}

