'use server';

import { createClient } from '@/lib/supabase/server';

export async function loadScratchpad(problemId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data, error } = await supabase
    .from('scratchpads')
    .select('state')
    .eq('user_id', user.id)
    .eq('problem_id', problemId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows found
    console.error('Error loading scratchpad:', error);
    return null;
  }

  return data?.state;
}

export async function saveScratchpad(problemId: string, state: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { success: false, error: 'Unauthorized' };

  const { error } = await supabase
    .from('scratchpads')
    .upsert(
      { 
        user_id: user.id, 
        problem_id: problemId, 
        state, 
        updated_at: new Date().toISOString() 
      },
      { onConflict: 'user_id, problem_id' }
    );

  if (error) {
    console.error('Error saving scratchpad:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
