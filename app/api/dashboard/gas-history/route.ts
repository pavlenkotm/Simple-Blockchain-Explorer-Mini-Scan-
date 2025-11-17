import { NextRequest, NextResponse } from 'next/server';
import { getGasPriceHistory } from '@/lib/services/analytics';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const network = searchParams.get('network') || 'ethereum';
    const hours = parseInt(searchParams.get('hours') || '24');

    const history = await getGasPriceHistory(network, hours);

    return NextResponse.json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error('Error fetching gas price history:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
