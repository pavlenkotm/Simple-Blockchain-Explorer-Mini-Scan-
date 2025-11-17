import { NextRequest, NextResponse } from 'next/server';
import { getBlockInfo } from '@/lib/blockchain';

export async function GET(
  request: NextRequest,
  { params }: { params: { block: string } }
) {
  try {
    const { block } = params;
    const searchParams = request.nextUrl.searchParams;
    const network = searchParams.get('network') || 'ethereum';

    const blockNumber = block === 'latest' ? 'latest' : parseInt(block);
    const blockInfo = await getBlockInfo(blockNumber, network);

    return NextResponse.json({
      success: true,
      data: blockInfo,
    });
  } catch (error) {
    console.error('Error fetching block info:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
