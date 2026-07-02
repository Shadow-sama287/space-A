import { createClient } from '@/lib/supabase/server';
import { striverProblems } from '@/data/striverSheet';
import { striverA2ZProblems } from '@/data/striverA2ZSheet';
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

    const allProblems = [...striverProblems, ...striverA2ZProblems];

    // Clear existing problems for striver_sde and striver_a2z
    await supabase
      .from('problems')
      .delete()
      .in('sheet', ['striver_sde', 'striver_a2z']);

    // Seed/upsert problems into database
    const { data, error } = await supabase
      .from('problems')
      .upsert(
        allProblems.map(p => ({
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

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: data?.length || 0 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
