"use client"; 
import React, { useState, useEffect } from 'react'
import './globals.css'
import { Heading, Box, Flex, Button, ButtonGroup, Alert, Image, AlertDescription, AlertTitle } from '@chakra-ui/react'
import { useXRP } from './contexts/XrpContext';
import ManufacturerABI from '../abi/ManufacturerNFT.json';
import RetailerABI from '../abi/RetailerNFT.json';
import { ethers } from 'ethers';
import myChainLogo from './components/assets/myChain_logo_transparent.png';

export default function Home() {
  const { connectWallet, walletConnected, currentWalletAddress } = useXRP();
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  useEffect (() => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);
  }, []);

  const retailerContractAddress = `0xE44e71BE8cdaB5A36E4556d6f2882F581847011e`; // Retailer NFT contract address
  const manufacturerContractAddress = `0x142d88f0ca0ccc9be036a22ee3a1d7969f4475e9`; // Manufacturer NFT contract address
  console.log('Retailer contract address:', retailerContractAddress);
  console.log('Manufacturer contract address:', manufacturerContractAddress);

  const handleRetailerClick = async () => {
    console.log('Retailer button clicked');
    if (!walletConnected) {
      connectWallet();
    }
    else if (provider != null) {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(retailerContractAddress, RetailerABI.abi, signer);
      try {
        const userAddress = await signer.getAddress();
        const tx = await contract.mintNFT( currentWalletAddress );
        await tx.wait();
        console.log('Transaction hash:', tx.hash);
      } catch (error) {
        alert("You already have a Retailer NFT");
        console.error('Failed to mint Retailer NFT:', error);
      }
    }
  }

  const handleManufacturerClick = async () => {
    console.log('Manufacturer button clicked');
    if (!walletConnected) {
      connectWallet();
    }
    else if (provider != null) {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(manufacturerContractAddress, ManufacturerABI.abi, signer);
      try {
        const userAddress = await signer.getAddress();
        const tx = await contract.mintNFT( currentWalletAddress );
        await tx.wait();
        console.log('Transaction hash:', tx.hash);
      } catch (error) {
        alert("You already have a Manufacturer NFT");
        console.error('Failed to mint Manufacturer NFT:', error);
      }
    }
  }

  const handleBothClick = async () => {
    console.log('Both button clicked');
    if (!walletConnected) {
      connectWallet();
    }
    await handleRetailerClick();
    await handleManufacturerClick();
  }

  return (
    <>
      <Box>
        <Flex h={75} align="center" justify="center">
          <Heading>Welcome to myChain</Heading>
        </Flex>
        <Flex h={5} align="center" justify="center">
          <Heading as='h3' size='md'>Next-Generation Product Identification and Information System</Heading>
        </Flex>
      </Box>
      <Box>
        <Flex direction="column" align="center">
          <Image src={myChainLogo.src} alt="Logo" style={{ width: '200px' }} />
        </Flex>
      </Box>
      <Box py={5}>
        <Flex direction="column" align="center">
          <Heading as="h2" size="lg" mb={4}>Get started. Choose an affiliation:</Heading>
          <Flex>
            <Button variant="outline" mr={4} onClick={handleRetailerClick}>Im a Retailer</Button>
            <Button variant="outline" mr={4} onClick={handleManufacturerClick}>Im a Manufacturer</Button>
            <Button variant="outline" onClick={handleBothClick}>I do Both</Button>
          </Flex>
        </Flex>
      </Box>
        <Box mt={35} px={10}>
          <Flex direction="row" justify="space-between">
            <Box w="30%">
              <Heading as="h3" size="md" mb={2}>Inventory Management</Heading>
              <p>Keep track of your inventory levels, manage stock, see everything in one place.</p>
            </Box>
            <Box w="30%">
              <Heading as="h3" size="md" mb={2}>Out with the old, in with new</Heading>
              <p>UPCs are too short and requires overhead to store data, why not decentralize?</p>
            </Box>
            <Box w="30%">
              <Heading as="h3" size="md" mb={2}>Safe, Secure, Transparent</Heading>
              <p>myChain uses 90% on-chain, 100% decentralized technology to ensure the authenticity and integrity of products.</p>
            </Box>
          </Flex>
        </Box>
    </>
  )
}
