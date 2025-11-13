import { NextRequest, NextResponse } from 'next/server';
import { findDriveImageByAddress, streetViewUrl } from '@/lib/google';

export async function POST(req: NextRequest) {
  try {
    const { address, city, state } = await req.json();
    const fullAddress = [address, city, state].filter(Boolean).join(', ');

    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    const driveUrl = await findDriveImageByAddress(fullAddress, folderId);

    if (driveUrl) {
      return NextResponse.json({ provider: 'google_drive', url: driveUrl });
    }

    const streetUrl = streetViewUrl(fullAddress);
    if (streetUrl) {
      return NextResponse.json({ provider: 'street_view', url: streetUrl });
    }

    return NextResponse.json({ provider: 'none', url: null });
  } catch (e: any) {
    return NextResponse.json({ provider: 'error', error: e?.message || 'Server error' }, { status: 500 });
  }
}
