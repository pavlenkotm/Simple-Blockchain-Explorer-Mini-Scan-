import { NextRequest, NextResponse } from 'next/server';
import { getTopTokens } from '@/lib/services/tokens';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const network = searchParams.get('network') || 'ethereum';

    const tokens = await getTopTokens(network);

    return NextResponse.json({
      success: true,
      data: tokens,
    });
  } catch (error) {
    console.error('Error fetching top tokens:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
