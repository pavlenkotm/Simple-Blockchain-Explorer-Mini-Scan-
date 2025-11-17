import { NextRequest, NextResponse } from 'next/server';
import { getTransactionVolumeHistory } from '@/lib/services/analytics';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const network = searchParams.get('network') || 'ethereum';
    const days = parseInt(searchParams.get('days') || '7');

    const history = await getTransactionVolumeHistory(network, days);

    return NextResponse.json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
