/* everything XRPL */

"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import RetailerABI from "../../abi/RetailerNFT.json";
import ManufacturerABI from "../../abi/ManufacturerNFT.json";

const XRPContext = createContext();

export const XRPProvider = ({ children }) => {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [currentChainId, setCurrentChainId] = useState(null);
  const [currentWalletAddress, setCurrentWalletAddress] = useState(null);
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);

  useEffect(() => {
    const checkMetaMask = async () => {
      if (typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask) {
        setIsMetaMaskInstalled(true);
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setWalletConnected(true);
          const chainId = await window.ethereum.request({ method: "eth_chainId" });
          setCurrentChainId(chainId);
          const walletAddress = accounts[0];
          setCurrentWalletAddress(walletAddress);
        }
        window.ethereum.on("chainChanged", (chainId) => {
          console.log("Chain changed to:", chainId);
          setCurrentChainId(chainId);
          window.location.reload();
        });
        window.ethereum.on("accountsChanged", (accounts) => {
          console.log("Accounts changed to:", accounts);
          setWalletConnected(accounts.length > 0);
        });
      }
    };
    checkMetaMask();
  }, []);

  const checkNFTOwnership = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const RetailerContractAddress = `0xE44e71BE8cdaB5A36E4556d6f2882F581847011e`; // Retailer NFT contract address
    const manufacturerContractAddress= `0x142d88f0ca0ccc9be036a22ee3a1d7969f4475e9`; // Manufacturer NFT contract address
    const retailerContract = new ethers.Contract(RetailerContractAddress, RetailerABI.abi, signer);
    const manufacturerContract = new ethers.Contract(manufacturerContractAddress, ManufacturerABI.abi, signer);
    
    let nftType = 'none';
    const isManufacturerNFT = await manufacturerContract.balanceOf(currentWalletAddress);
    if (isManufacturerNFT == 1) {
      nftType = 'manufacturer';
    }
    const isRetailerNFT = await retailerContract.balanceOf(currentWalletAddress);
    if (isRetailerNFT == 1) {
      if (nftType === 'manufacturer') {
        nftType = 'both';
      } else {
        nftType = 'retailer';
      }
    }
    return nftType;
  }

  const connectWallet = async () => {
    if (isMetaMaskInstalled) {
      try {
        const walletAddress = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletConnected(true);
        setCurrentWalletAddress(walletAddress);
        const chainId = await window.ethereum.request({ method: "eth_chainId" });
        setCurrentChainId(chainId);
        console.log("Connected to MetaMask");
        console.log("ChaidId: ", chainId);
        if (checkIsOnXRPLEVMSidechain() == false) {
            console.log("Adding XRPL EVM Sidechain");
            addXRPLEVMSidechain();
        }
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      window.open("https://metamask.io/download.html", "_blank");
    }
  };

  const addXRPLEVMSidechain = async () => {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });

      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
            chainName: "EVM Sidechain Devnet", 
            chainId: "0x15F902",
            nativeCurrency: {
                name: "XRP", 
                symbol: "XRP",
                decimals: 18,
            },
            rpcUrls: ["https://rpc-evm-sidechain.xrpl.org/"],
            blockExplorerUrls: ["https://evm-sidechain.xrpl.org/"]
        }],
      });

      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      setCurrentChainId(chainId);
    } catch (error) {
      console.error("Failed to add the XRPL EVM sidechain:", error);
    }
  };

  const toggleNetworkModal = () => {
    setIsNetworkModalOpen(!isNetworkModalOpen);
  };

  const checkIsOnXRPLEVMSidechain = () => {
    return currentChainId === "0x15F902";
  };

  return (
    <XRPContext.Provider
      value={{
        setCurrentWalletAddress,
        currentWalletAddress,
        isMetaMaskInstalled,
        walletConnected,
        currentChainId,
        addXRPLEVMSidechain,
        isNetworkModalOpen,
        setIsNetworkModalOpen,
        connectWallet,
        toggleNetworkModal,
        checkIsOnXRPLEVMSidechain,
        checkNFTOwnership,
      }}
    >
      {children}
    </XRPContext.Provider>
  );
};

export function useXRP() {
  return useContext(XRPContext);
}
