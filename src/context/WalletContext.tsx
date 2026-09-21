import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { BrowserProvider, formatEther } from 'ethers';
import { handleWalletError } from '../lib/errors';

export const SEPOLIA_CHAIN_ID = 11155111n; // 0xaa36a7
export const SEPOLIA_CHAIN_ID_HEX = '0xaa36a7';

interface WalletContextState {
  address: string | null;
  balance: string | null;
  chainId: bigint | null;
  isConnecting: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: () => Promise<void>;
}

const WalletContext = createContext<WalletContextState | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [chainId, setChainId] = useState<bigint | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async (provider: BrowserProvider, account: string) => {
    try {
      const balanceWei = await provider.getBalance(account);
      const balanceEth = formatEther(balanceWei);
      // Format to max 4 decimal places safely
      const num = parseFloat(balanceEth);
      setBalance(num.toFixed(4));
    } catch (err) {
      console.error("Failed to fetch balance:", err);
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      if (!window.ethereum) {
        throw new Error("missing provider");
      }

      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      
      if (accounts.length > 0) {
        const account = accounts[0];
        setAddress(account);
        
        const network = await provider.getNetwork();
        setChainId(network.chainId);
        
        await fetchBalance(provider, account);
      }
    } catch (err: any) {
      setError(handleWalletError(err));
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setBalance(null);
    setChainId(null);
  };

  const switchNetwork = async () => {
    setError(null);
    try {
      if (!window.ethereum) throw new Error("missing provider");
      
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
      });
    } catch (err: any) {
      if (err.code === 4902) {
        // Network not added to MetaMask, we should try adding it
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: SEPOLIA_CHAIN_ID_HEX,
                chainName: 'Sepolia test network',
                nativeCurrency: { name: 'SepoliaETH', symbol: 'SEP', decimals: 18 },
                rpcUrls: ['https://rpc.sepolia.org'],
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
        } catch (addError) {
          setError(handleWalletError(addError));
        }
      } else {
        setError(handleWalletError(err));
      }
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          const provider = new BrowserProvider(window.ethereum);
          fetchBalance(provider, accounts[0]);
        } else {
          disconnectWallet();
        }
      };

      const handleChainChanged = (newChainIdHex: string) => {
        setChainId(BigInt(newChainIdHex));
        if (address) {
          const provider = new BrowserProvider(window.ethereum);
          fetchBalance(provider, address);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Try eager connection
      const provider = new BrowserProvider(window.ethereum);
      provider.listAccounts().then((accounts) => {
        if (accounts.length > 0) {
          setAddress(accounts[0].address);
          provider.getNetwork().then((net) => setChainId(net.chainId));
          fetchBalance(provider, accounts[0].address);
        }
      }).catch(() => {});

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [address]);

  return (
    <WalletContext.Provider
      value={{
        address,
        balance,
        chainId,
        isConnecting,
        error,
        connectWallet,
        disconnectWallet,
        switchNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
