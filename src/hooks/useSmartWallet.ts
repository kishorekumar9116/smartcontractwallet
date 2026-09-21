import { useMemo, useCallback } from 'react';
import { BrowserProvider, Contract, formatEther } from 'ethers';
import { useWallet } from '../context/WalletContext';
import { SMART_WALLET_ADDRESS } from '../config/contracts';
import { SmartWalletABI } from '../contracts/SmartWalletABI';

export interface TransactionDetails {
  to: string;
  value: string; // in ETH format
  data: string;
  executed: boolean;
  approvals: number;
}

export function useSmartWallet() {
  const { address } = useWallet();

  const contract = useMemo(() => {
    if (!window.ethereum) return null;
    const provider = new BrowserProvider(window.ethereum);
    // Use the provider for read-only calls (doesn't require signer)
    return new Contract(SMART_WALLET_ADDRESS, SmartWalletABI, provider);
  }, []);

  const getContractWithSigner = async () => {
    if (!window.ethereum) throw new Error("No ethereum provider found");
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new Contract(SMART_WALLET_ADDRESS, SmartWalletABI, signer);
  };

  const getWalletBalance = useCallback(async (): Promise<string> => {
    if (!contract) return "0";
    try {
      const balanceWei = await contract.getWalletBalance();
      const balanceEth = formatEther(balanceWei);
      const num = parseFloat(balanceEth);
      return num.toFixed(4);
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      return "0";
    }
  }, [contract]);

  const getOwners = useCallback(async (): Promise<string[]> => {
    if (!contract) return [];
    try {
      return await contract.getOwners();
    } catch (error) {
      console.error("Error fetching owners:", error);
      return [];
    }
  }, [contract]);

  const getRequiredSignatures = useCallback(async (): Promise<number> => {
    if (!contract) return 0;
    try {
      const required = await contract.requiredSignatures();
      return Number(required);
    } catch (error) {
      console.error("Error fetching required signatures:", error);
      return 0;
    }
  }, [contract]);

  const isFrozen = useCallback(async (): Promise<boolean> => {
    if (!contract) return false;
    try {
      return await contract.frozen();
    } catch (error) {
      console.error("Error fetching frozen status:", error);
      return false;
    }
  }, [contract]);

  const getTransactionCount = useCallback(async (): Promise<number> => {
    if (!contract) return 0;
    try {
      const count = await contract.getTransactionCount();
      return Number(count);
    } catch (error) {
      console.error("Error fetching transaction count:", error);
      return 0;
    }
  }, [contract]);

  const getTransactionDetails = useCallback(async (id: number): Promise<TransactionDetails | null> => {
    if (!contract) return null;
    try {
      const tx = await contract.getTransaction(id);
      return {
        to: tx.to,
        value: formatEther(tx.value),
        data: tx.data,
        executed: tx.executed,
        approvals: Number(tx.approvals),
      };
    } catch (error) {
      console.error(`Error fetching transaction ${id}:`, error);
      return null;
    }
  }, [contract]);

  const isOwner = useCallback(async (checkAddress: string): Promise<boolean> => {
    if (!contract || !checkAddress) return false;
    try {
      return await contract.isOwner(checkAddress);
    } catch (error) {
      console.error(`Error checking if ${checkAddress} is owner:`, error);
      return false;
    }
  }, [contract]);

  const isCurrentUserOwner = useCallback(async (): Promise<boolean> => {
    if (!address) return false;
    return await isOwner(address);
  }, [address, isOwner]);

  const createMultisigSwap = async (router: string, value: string, data: string) => {
    const contract = await getContractWithSigner();
    return await contract.createMultisigSwap(router, value, data);
  };

  const directSwap = async (router: string, data: string, value: string) => {
    const contract = await getContractWithSigner();
    return await contract.directSwap(router, data, { value });
  };

  const freezeWallet = async () => {
    const contract = await getContractWithSigner();
    return await contract.freezeWallet();
  };

  const createUnfreezeRequest = async () => {
    const contract = await getContractWithSigner();
    return await contract.createUnfreezeRequest();
  };

  return {
    contract,
    getContractWithSigner,
    getWalletBalance,
    getOwners,
    getRequiredSignatures,
    isFrozen,
    getTransactionCount,
    getTransactionDetails,
    isOwner,
    isCurrentUserOwner,
    createMultisigSwap,
    directSwap,
    freezeWallet,
    createUnfreezeRequest,
  };
}
