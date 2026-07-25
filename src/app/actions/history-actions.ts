'use server';

import { createClient } from '@/lib/supabase/server';

export async function fetchDetailedHistoryForDate(dateStr: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // Date bounds for the query: from dateStr 00:00:00 to dateStr 23:59:59 (UTC)
  // Wait, if the frontend used local time to group, we should probably fetch
  // a slightly wider range (e.g. dateStr -1 day to +1 day) and filter in JS to match
  // the exact `dateKey`.
  
  const targetDate = new Date(dateStr);
  const startDate = new Date(targetDate);
  startDate.setDate(startDate.getDate() - 2); // wider bound for timezone
  
  const endDate = new Date(targetDate);
  endDate.setDate(endDate.getDate() + 2);

  const { data, error } = await supabase
    .from('review_history')
    .select('*, problems(title, difficulty, category)')
    .eq('user_id', user.id)
    .gte('reviewed_at', startDate.toISOString())
    .lte('reviewed_at', endDate.toISOString());

  if (error) {
    console.error('Error fetching detailed history:', error);
    return [];
  }

  // Filter to exact local date key match
  const filteredData = (data || []).filter(h => {
    const d = new Date(h.reviewed_at);
    const hDateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return hDateKey === dateStr;
  });

  // Sort by reviewed_at descending (latest first for the day)
  filteredData.sort((a, b) => new Date(b.reviewed_at).getTime() - new Date(a.reviewed_at).getTime());

  return filteredData;
}
