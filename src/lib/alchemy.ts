import { Alchemy, Network } from "alchemy-sdk";
import { ethers } from "ethers";

const networkMap: Record<string, Network> = {
  ethereum: Network.ETH_MAINNET,
  polygon: Network.MATIC_MAINNET,
  bsc: Network.BNB_MAINNET,
  avalanche: Network.AVAX_MAINNET,
  optimism: Network.OPT_MAINNET,
  arbitrum: Network.ARB_MAINNET,
  base: Network.BASE_MAINNET,
  bitcoin: Network.ETH_MAINNET, // Fallback to ETH for API compatibility
  soneium: Network.SONEIUM_MAINNET,
};

export const getAlchemyInstance = (chainId: string = "ethereum"): Alchemy => {
  const settings = {
    apiKey: "3QJFS2G0dgV9o3q4xUtvD",
    network: networkMap[chainId] || Network.ETH_MAINNET,
  };
  
  return new Alchemy(settings);
};

export const getNetworkName = (chainId: string): string => {
  const names: Record<string, string> = {
    ethereum: "Ethereum",
    polygon: "Polygon",
    bsc: "BNB Chain",
    avalanche: "Avalanche",
    optimism: "Optimism",
    arbitrum: "Arbitrum",
    base: "Base",
    bitcoin: "Bitcoin",
    soneium: "Soneium",
  };
  
  return names[chainId] || "Ethereum";
};

export const getNativeCurrency = (chainId: string): string => {
  const currencies: Record<string, string> = {
    ethereum: "ETH",
    polygon: "MATIC",
    bsc: "BNB",
    avalanche: "AVAX",
    optimism: "ETH",
    arbitrum: "ETH",
    base: "ETH",
    bitcoin: "BTC",
    soneium: "SONEIUM",
  };
  
  return currencies[chainId] || "ETH";
};

export const fetchBitcoinBlockHeight = async (): Promise<number> => {
  try {
    const response = await fetch('https://blockstream.info/api/blocks/tip/height');
    const height = await response.json();
    return height;
  } catch (error) {
    console.error('Error fetching Bitcoin block height:', error);
    return 870000; // Fallback
  }
};

const COINGECKO_API_KEY = "CG-yEvznEJTbv5DABjYwP5gfaU9";

export const fetchTokenPrice = async (chainId: string): Promise<string> => {
  try {
    const coinIds: Record<string, string> = {
      ethereum: "ethereum",
      polygon: "matic-network",
      bsc: "binancecoin",
      avalanche: "avalanche-2",
      optimism: "ethereum",
      arbitrum: "ethereum",
      base: "ethereum",
      bitcoin: "bitcoin",
      soneium: "ethereum",
    };
    
    const coinId = coinIds[chainId] || "ethereum";
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&x_cg_demo_api_key=${COINGECKO_API_KEY}`);
    const data = await response.json();
    
    const price = data[coinId]?.usd;
    return price ? `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : "N/A";
  } catch (error) {
    console.error("Error fetching price:", error);
    return "N/A";
  }
};

