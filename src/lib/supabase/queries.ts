import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Fetches all problems from Supabase, handling PostgREST's 1,000-row limit
 * by making paged chunk requests until all problems are loaded.
 */
export async function fetchAllProblems(supabase: SupabaseClient): Promise<any[]> {
  const allProblems: any[] = [];
  const PAGE_SIZE = 1000;
  let page = 0;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)
      .order('sheet', { ascending: true })
      .order('category', { ascending: true })
      .order('title', { ascending: true });

    if (error || !data || data.length === 0) {
      hasMore = false;
    } else {
      allProblems.push(...data);
      if (data.length < PAGE_SIZE) {
        hasMore = false;
      } else {
        page++;
      }
    }
  }

  return allProblems;
}

/**
 * Fetches all user_problems for a user, handling PostgREST's 1,000-row limit
 * by making paged chunk requests.
 */
export async function fetchAllUserProblems(supabase: SupabaseClient, userId: string): Promise<any[]> {
  if (!userId) return [];

  const allUserProblems: any[] = [];
  const PAGE_SIZE = 1000;
  let page = 0;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase
      .from('user_problems')
      .select('*, problems(*)')
      .eq('user_id', userId)
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (error || !data || data.length === 0) {
      hasMore = false;
    } else {
      allUserProblems.push(...data);
      if (data.length < PAGE_SIZE) {
        hasMore = false;
      } else {
        page++;
      }
    }
  }

  return allUserProblems;
}
