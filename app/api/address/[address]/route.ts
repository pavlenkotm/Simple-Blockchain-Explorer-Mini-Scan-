import { NextRequest, NextResponse } from 'next/server';
import { getAddressInfo, getRecentTransactions } from '@/lib/blockchain';

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const { address } = params;
    const searchParams = request.nextUrl.searchParams;
    const network = searchParams.get('network') || 'ethereum';

    const [addressInfo, transactions] = await Promise.all([
      getAddressInfo(address, network),
      getRecentTransactions(address, network, 20),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        ...addressInfo,
        transactions,
      },
    });
  } catch (error) {
    console.error('Error fetching address info:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
