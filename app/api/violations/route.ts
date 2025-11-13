import { NextRequest, NextResponse } from 'next/server';
import { searchSocrataViolationDatasets, queryDatasetForViolations } from '@/lib/socrata';

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    const city: string | undefined = query?.city?.trim();
    const state: string | undefined = query?.state?.trim()?.toUpperCase();
    const address: string | undefined = query?.address?.trim();

    if (!city || !state) {
      return NextResponse.json({ items: [], error: 'city and state are required' }, { status: 400 });
    }

    const datasets = await searchSocrataViolationDatasets(city, state);

    const resultsArrays = await Promise.all(
      datasets.slice(0, 5).map((d) => queryDatasetForViolations(d, { city, state, address }))
    );

    const items = resultsArrays.flat();

    // De-duplicate by id+address
    const seen = new Set<string>();
    const unique = items.filter((it) => {
      const key = `${it.id}|${it.address}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return NextResponse.json({ items: unique });
  } catch (e: any) {
    return NextResponse.json({ items: [], error: e?.message || 'Server error' }, { status: 500 });
  }
}
