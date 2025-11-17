import { NextRequest, NextResponse } from 'next/server';
import { getContractInfo } from '@/lib/blockchain';

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const { address } = params;
    const searchParams = request.nextUrl.searchParams;
    const network = searchParams.get('network') || 'ethereum';

    const contractInfo = await getContractInfo(address, network);

    return NextResponse.json({
      success: true,
      data: contractInfo,
    });
  } catch (error) {
    console.error('Error fetching contract info:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
