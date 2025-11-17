import { NextRequest, NextResponse } from 'next/server';
import { getNFTsByOwner } from '@/lib/services/nft';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const contract = searchParams.get('contract');
    const owner = searchParams.get('owner');
    const network = searchParams.get('network') || 'ethereum';

    if (!contract || !owner) {
      return NextResponse.json(
        { success: false, error: 'Both contract and owner parameters are required' },
        { status: 400 }
      );
    }

    const nfts = await getNFTsByOwner(owner, contract, network);

    return NextResponse.json({
      success: true,
      data: nfts,
    });
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
