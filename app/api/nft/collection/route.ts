import { NextRequest, NextResponse } from 'next/server';
import { getNFTCollectionInfo } from '@/lib/services/nft';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get('address');
    const network = searchParams.get('network') || 'ethereum';

    if (!address) {
      return NextResponse.json(
        { success: false, error: 'Address parameter is required' },
        { status: 400 }
      );
    }

    const collection = await getNFTCollectionInfo(address, network);

    return NextResponse.json({
      success: true,
      data: collection,
    });
  } catch (error) {
    console.error('Error fetching NFT collection:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
