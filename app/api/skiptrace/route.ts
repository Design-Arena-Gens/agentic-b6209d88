import { NextRequest, NextResponse } from 'next/server';
import { skipTraceByAddress } from '@/lib/skiptrace';

export async function POST(req: NextRequest) {
  try {
    const { address, city, state } = await req.json();
    if (!address && !city) {
      return NextResponse.json({ error: 'address or city required' }, { status: 400 });
    }
    const result = await skipTraceByAddress(address || `${city}, ${state || ''}`.trim(), city, state);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}
