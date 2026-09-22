import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { BrowserProvider, formatEther } from 'ethers';
import { handleWalletError } from '../lib/errors';
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import type { IProvider } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

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
  loginWithWeb3Auth: () => Promise<void>;
}

const WalletContext = createContext<WalletContextState | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [chainId, setChainId] = useState<bigint | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [web3authProvider, setWeb3authProvider] = useState<IProvider | null>(null);

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

  const loginWithWeb3Auth = async () => {
    if (!web3auth) {
      setError("Web3Auth not initialized. Please set your Client ID in WalletContext.tsx");
      return;
    }
    try {
      setIsConnecting(true);
      setError(null);
      const provider = await web3auth.connect();
      setWeb3authProvider(provider);
      if (provider) {
        const ethersProvider = new BrowserProvider(provider as any);
        const accounts = await ethersProvider.send("eth_accounts", []);
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          const network = await ethersProvider.getNetwork();
          setChainId(network.chainId);
          await fetchBalance(ethersProvider, accounts[0]);
        }
      }
    } catch (err: any) {
      setError(handleWalletError(err));
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    if (web3auth && web3auth.connected) {
      await web3auth.logout();
      setWeb3authProvider(null);
    }
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

  // Web3Auth Initialization
  useEffect(() => {
    const init = async () => {
      try {
        const clientId = "BMYOdt_d8CgW1oO3WgENzESRhhHSf6a1gHJUyu8Dyvu-IYbNRC5At370-efd_dp2dCbuTj51_WNP-PsHtOZqokk"; // Replace with your Web3Auth Client ID!
        
        const chainConfig = {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: SEPOLIA_CHAIN_ID_HEX,
          rpcTarget: "https://rpc.sepolia.org",
          displayName: "Sepolia Testnet",
          blockExplorerUrl: "https://sepolia.etherscan.io",
          ticker: "SEP",
          tickerName: "SepoliaETH",
        };

        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: { chainConfig }
        });

        const web3authInstance = new Web3Auth({
          clientId,
          web3AuthNetwork: "sapphire_devnet",
          privateKeyProvider,
        });

        setWeb3auth(web3authInstance);
        await web3authInstance.initModal();
        
        if (web3authInstance.provider) {
          setWeb3authProvider(web3authInstance.provider);
        }
      } catch (error) {
        console.error("Web3Auth init error:", error);
      }
    };
    init();
  }, []);

  // Eager connection - runs once on mount
  useEffect(() => {
    if (window.ethereum) {
      const provider = new BrowserProvider(window.ethereum);
      provider.listAccounts().then((accounts) => {
        if (accounts.length > 0) {
          setAddress(accounts[0].address);
          provider.getNetwork().then((net) => setChainId(net.chainId));
          fetchBalance(provider, accounts[0].address);
        }
      }).catch(() => {});
    }
  }, []);

  // Event listeners
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
        loginWithWeb3Auth,
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
