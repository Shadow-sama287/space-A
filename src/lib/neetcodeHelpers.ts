import { neetcodeProblems } from '@/data/neetcodeSheet';

// Static lookup map by lowercase problem title
const staticSubSheetsMap = new Map<string, string[]>(
  neetcodeProblems.map(p => [(p.title || '').toLowerCase(), p.sub_sheets || []])
);

export function getProblemSubSheets(p: { title?: string; sheet?: string; sub_sheets?: any } | null | undefined): string[] {
  if (!p) return [];

  // 1. If p.sub_sheets is a valid non-empty array
  if (Array.isArray(p.sub_sheets) && p.sub_sheets.length > 0) {
    return p.sub_sheets;
  }

  // 2. If p.sub_sheets is a JSON string or CSV string
  if (typeof p.sub_sheets === 'string' && p.sub_sheets.trim()) {
    try {
      const parsed = JSON.parse(p.sub_sheets);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      const split = p.sub_sheets.split(',').map(s => s.trim()).filter(Boolean);
      if (split.length > 0) return split;
    }
  }

  // 3. Fallback to static neetcodeProblems map matching by title
  const titleKey = (p.title || '').toLowerCase();
  const staticSubSheets = staticSubSheetsMap.get(titleKey);
  if (staticSubSheets && staticSubSheets.length > 0) {
    return staticSubSheets;
  }

  // 4. Fallback for any NeetCode problem
  if (p.sheet === 'neetcode_all' || p.sheet === 'neetcode_150' || p.sheet === 'blind_75' || p.sheet === 'neetcode_250') {
    return ['neetcode_all'];
  }

  return [];
}
