export const SMART_WALLET_ADDRESS = "0x5654183b4fa20EFaEC29BA95265D1606c084eCfa";

// Supported network chain IDs
export const SUPPORTED_CHAINS = {
  SEPOLIA: 11155111n,
  MAINNET: 1n,
};

// DEX Router Addresses per network
export const ROUTERS: Record<string, string> = {
  // Mainnet Uniswap V2 Router as an example
  [SUPPORTED_CHAINS.MAINNET.toString()]: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  
  // Keep Sepolia empty to prevent fake swaps until the actual router is deployed/configured
  [SUPPORTED_CHAINS.SEPOLIA.toString()]: "", 
};
