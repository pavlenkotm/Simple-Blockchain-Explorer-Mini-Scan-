import { NextRequest, NextResponse } from 'next/server';
import { getTransaction } from '@/lib/blockchain';

export async function GET(
  request: NextRequest,
  { params }: { params: { hash: string } }
) {
  try {
    const { hash } = params;
    const searchParams = request.nextUrl.searchParams;
    const network = searchParams.get('network') || 'ethereum';

    const transaction = await getTransaction(hash, network);

    return NextResponse.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
