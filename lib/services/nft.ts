import { ethers } from 'ethers';
import { getProvider, ERC721_ABI } from '../blockchain';
import { NFTCollection, NFTItem } from '@/types/ecosystem';

export async function getNFTCollectionInfo(
  contractAddress: string,
  networkId: string
): Promise<NFTCollection> {
  const provider = getProvider(networkId);
  const contract = new ethers.Contract(contractAddress, ERC721_ABI, provider);

  try {
    const [name, symbol] = await Promise.all([
      contract.name(),
      contract.symbol(),
    ]);

    // Try to get total supply (not all ERC721 have this)
    let totalSupply = 0;
    try {
      const supply = await contract.totalSupply();
      totalSupply = Number(supply);
    } catch {
      // totalSupply not available
    }

    return {
      address: contractAddress,
      name,
      symbol,
      totalSupply,
    };
  } catch (error) {
    console.error('Error fetching NFT collection info:', error);
    throw error;
  }
}

export async function getNFTMetadata(
  contractAddress: string,
  tokenId: string,
  networkId: string
): Promise<NFTItem> {
  const provider = getProvider(networkId);
  const contract = new ethers.Contract(contractAddress, ERC721_ABI, provider);

  try {
    const [owner, tokenURI] = await Promise.all([
      contract.ownerOf(tokenId),
      contract.tokenURI(tokenId).catch(() => null),
    ]);

    const nftItem: NFTItem = {
      tokenId,
      contractAddress,
      owner,
    };

    // Fetch metadata from tokenURI if available
    if (tokenURI) {
      try {
        // Handle IPFS URIs
        let metadataUrl = tokenURI;
        if (tokenURI.startsWith('ipfs://')) {
          metadataUrl = `https://ipfs.io/ipfs/${tokenURI.slice(7)}`;
        }

        const response = await fetch(metadataUrl);
        if (response.ok) {
          const metadata = await response.json();
          nftItem.name = metadata.name;
          nftItem.description = metadata.description;
          nftItem.image = metadata.image?.startsWith('ipfs://')
            ? `https://ipfs.io/ipfs/${metadata.image.slice(7)}`
            : metadata.image;
          nftItem.attributes = metadata.attributes;
        }
      } catch (error) {
        console.error('Error fetching NFT metadata:', error);
      }
    }

    return nftItem;
  } catch (error) {
    console.error('Error fetching NFT:', error);
    throw error;
  }
}

export async function getNFTsByOwner(
  ownerAddress: string,
  contractAddress: string,
  networkId: string,
  limit: number = 10
): Promise<NFTItem[]> {
  const provider = getProvider(networkId);
  const contract = new ethers.Contract(
    contractAddress,
    [
      ...ERC721_ABI,
      'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
    ],
    provider
  );

  try {
    const currentBlock = await provider.getBlockNumber();
    const fromBlock = Math.max(0, currentBlock - 10000);

    // Get Transfer events to this address
    const filter = contract.filters.Transfer(null, ownerAddress);
    const events = await contract.queryFilter(filter, fromBlock, currentBlock);

    const tokenIds = new Set<string>();
    events.forEach((event: any) => {
      if (event.args) {
        tokenIds.add(event.args[2].toString());
      }
    });

    const nfts: NFTItem[] = [];
    let count = 0;

    for (const tokenId of tokenIds) {
      if (count >= limit) break;

      try {
        const owner = await contract.ownerOf(tokenId);
        if (owner.toLowerCase() === ownerAddress.toLowerCase()) {
          nfts.push({
            tokenId,
            contractAddress,
            owner,
          });
          count++;
        }
      } catch {
        // Token might have been transferred
      }
    }

    return nfts;
  } catch (error) {
    console.error('Error fetching NFTs by owner:', error);
    return [];
  }
}
