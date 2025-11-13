import { NextRequest, NextResponse } from 'next/server';
import { checkMortgageStatus } from '@/lib/mortgage';

export async function POST(req: NextRequest) {
  try {
    const { address, city, state } = await req.json();
    if (!city && !address) {
      return NextResponse.json({ error: 'address or city required' }, { status: 400 });
    }
    const status = await checkMortgageStatus(address || `${city}, ${state || ''}`.trim(), city, state);
    return NextResponse.json(status);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}
