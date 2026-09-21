export function handleWalletError(error: any): string {
  if (!error) return "An unknown error occurred.";
  
  const errorMessage = error?.message?.toLowerCase() || "";
  const errorCode = error?.code;

  if (errorCode === 4001 || errorMessage.includes("user rejected")) {
    return "Transaction was cancelled by the user.";
  }

  if (errorMessage.includes("execution reverted")) {
    return "Transaction could not be completed. Please check your balance and try again.";
  }
  
  if (errorMessage.includes("insufficient funds")) {
    return "You don't have enough Sepolia ETH for this transaction.";
  }

  if (errorMessage.includes("already processing")) {
    return "Please check your wallet, a request is already pending.";
  }
  
  if (errorMessage.includes("missing provider")) {
    return "No wallet detected. Please install MetaMask or another compatible wallet.";
  }

  return "Something went wrong. Please try again later.";
}
