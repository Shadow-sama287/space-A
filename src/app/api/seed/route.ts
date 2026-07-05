import { createClient } from '@/lib/supabase/server';
import { striverProblems } from '@/data/striverSheet';
import { striverA2ZProblems } from '@/data/striverA2ZSheet';
import { tle31Problems } from '@/data/tle31Sheet';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = await createClient();

    // Ensure the request is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rawProblems = [...striverProblems, ...striverA2ZProblems, ...tle31Problems];

    // Deduplicate array by (sheet, title) key to prevent ON CONFLICT DO UPDATE batch error
    const seenKeys = new Set<string>();
    const uniqueProblems = rawProblems.filter((p) => {
      const key = `${p.sheet}___${p.title}`;
      if (seenKeys.has(key)) return false;
      seenKeys.add(key);
      return true;
    });

    // Safe upsert problems into database without deleting existing rows
    // This preserves problem UUIDs and prevents cascading deletions on user_problems

    // Seed/upsert problems into database
    let { data, error } = await supabase
      .from('problems')
      .upsert(
        uniqueProblems.map(p => ({
          sheet: p.sheet,
          title: p.title,
          category: p.category,
          difficulty: p.difficulty,
          rating: (p as any).rating || null,
          leetcode_url: p.leetcode_url,
          ninja_url: p.ninja_url || null,
        })),
        { onConflict: 'sheet,title' }
      )
      .select();

    // Graceful fallback if remote DB schema lacks 'rating' column
    if (error && (error.message.includes('rating') || error.message.includes('schema cache'))) {
      const fallbackResult = await supabase
        .from('problems')
        .upsert(
          uniqueProblems.map(p => ({
            sheet: p.sheet,
            title: p.title,
            category: p.category,
            difficulty: p.difficulty,
            leetcode_url: p.leetcode_url,
            ninja_url: p.ninja_url || null,
          })),
          { onConflict: 'sheet,title' }
        )
        .select();

      data = fallbackResult.data;
      error = fallbackResult.error;
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: data?.length || 0 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
