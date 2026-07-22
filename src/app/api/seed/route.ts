import { createClient } from '@/lib/supabase/server';
import { striverProblems } from '@/data/striverSheet';
import { striverA2ZProblems } from '@/data/striverA2ZSheet';
import { tle31Problems } from '@/data/tle31Sheet';
import { neetcodeProblems } from '@/data/neetcodeSheet';
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

    // 1. Purge legacy corrupted neetcode problem records and placeholder entries if any
    await supabase
      .from('problems')
      .delete()
      .or("sheet.eq.neetcode_all,sheet.eq.neetcode_150,sheet.eq.neetcode_250,sheet.eq.blind_75,title.ilike.%Problem %");

    // Combine all problem sheets
    const rawProblems = [
      ...striverProblems,
      ...striverA2ZProblems,
      ...tle31Problems,
      ...neetcodeProblems,
    ];

    // Deduplicate array by (sheet, title) key
    const seenKeys = new Set<string>();
    const uniqueProblems = rawProblems.filter((p) => {
      const key = `${p.sheet}___${p.title}`;
      if (seenKeys.has(key)) return false;
      seenKeys.add(key);
      return true;
    });

    // 2. Batch upsert in chunks of 200 items to avoid HTTP timeouts
    const BATCH_SIZE = 200;
    let totalUpserted = 0;

    for (let i = 0; i < uniqueProblems.length; i += BATCH_SIZE) {
      const chunk = uniqueProblems.slice(i, i + BATCH_SIZE);
      const payload = chunk.map((p) => ({
        sheet: p.sheet,
        sub_sheets: (p as any).sub_sheets || [],
        title: p.title,
        category: p.category,
        difficulty: p.difficulty,
        rating: (p as any).rating || null,
        leetcode_url: p.leetcode_url,
        ninja_url: (p as any).ninja_url || null,
      }));

      const { data, error } = await supabase
        .from('problems')
        .upsert(payload, { onConflict: 'sheet,title' })
        .select('id');

      if (error) {
        // Fallback without sub_sheets column if schema not migrated yet
        const fallbackPayload = chunk.map((p) => ({
          sheet: p.sheet,
          title: p.title,
          category: p.category,
          difficulty: p.difficulty,
          leetcode_url: p.leetcode_url,
          ninja_url: (p as any).ninja_url || null,
        }));
        const fallbackRes = await supabase
          .from('problems')
          .upsert(fallbackPayload, { onConflict: 'sheet,title' })
          .select('id');

        if (fallbackRes.error) {
          return NextResponse.json({ error: fallbackRes.error.message }, { status: 500 });
        }
        totalUpserted += fallbackRes.data?.length || 0;
      } else {
        totalUpserted += data?.length || 0;
      }
    }

    return NextResponse.json({
      success: true,
      count: totalUpserted,
      message: `Preseeded ${totalUpserted} problems across SDE (${striverProblems.length}), A2Z (${striverA2ZProblems.length}), TLE CP (${tle31Problems.length}), and NeetCode All (${neetcodeProblems.length})!`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
