// Dashboard.tsx
"use client";
import React, { useEffect, useState } from 'react';
import {
  Box, Flex, VStack, Heading, Text, Select, Stack, Divider, SimpleGrid,
  Modal, Card, CardHeader, CardBody, CardFooter, Image, ButtonGroup, Button, Input,
  ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
} from '@chakra-ui/react'
import { ethers } from 'ethers';
import ProductABI from '../../abi/ProductNFT.json';
import RetailerABI from "../../abi/RetailerNFT.json";
import ManufacturerABI from "../../abi/ManufacturerNFT.json";
import { useDisclosure } from '@chakra-ui/react';
import Buffer from 'buffer';
import SHA256 from 'crypto-js/sha256';

function DisplayProductInCard(tokenId) {
  const [product, setProduct] = useState(null);
  const modelPage = useDisclosure();
  const qrCode = useDisclosure();
  const [upk, setUpk] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);
    const productContractAddress = `0x78c6fd6930193d515890726e034692770c57b965`;
    const productContract = new ethers.Contract(productContractAddress, ProductABI.abi, provider);
    
    async function fetchProduct() {
      try {
        const data = {
          name: await productContract.getName(tokenId),
          product_picture: await productContract.tokenURI(tokenId),
          taxon: await productContract.getTaxon(tokenId),
          lotNumber: await productContract.getLotNumber(tokenId),
          msrp: await productContract.getMsrp(tokenId),
          countryOfOrigin: await productContract.getCountryOfOrigin(tokenId),
          sellByDate: await productContract.getSellByDate(tokenId),
          expirationDate: await productContract.getExpirationDate(tokenId),
          facts: await productContract.getFactsUri(tokenId),
        };
        setProduct({
          product_name: data.name,
          product_picture: data.product_picture.replace('ipfs://', 'https://ipfs.io/ipfs/'),
          taxon: data.taxon.toString(),
          lot_number: data.lotNumber.toString(),
          msrp: data.msrp.toString(),
          country_of_origin: data.countryOfOrigin,
          sell_by_date: data.sellByDate,
          expiration_date: data.expirationDate,
          facts: data.facts.replace('ipfs://', 'https://ipfs.io/ipfs/'),
        });
      } catch (error) {
        console.error("Failed to fetch product data:", error);
      }
    }
    fetchProduct();

    const calculateUPK = async () => {
      const signer = await provider.getSigner();
      const manufacturerContractAddress= `0x142d88f0ca0ccc9be036a22ee3a1d7969f4475e9`; // Manufacturer NFT contract address
      const manufacturerContract = new ethers.Contract(manufacturerContractAddress, ManufacturerABI.abi, signer);
      const userAddress = await signer.getAddress();
      const manufacturerTokenId = await manufacturerContract.tokenOfOwnerByIndex(userAddress, 0);
      // Create a unique input string combining the manufacturer's token ID and the taxon
      const input = `${manufacturerTokenId}${product.taxon}`;
      // Calculate the SHA256 hash
      const hash = SHA256(input).toString();
      setUpk(hash);
    };
    calculateUPK();
  }, [tokenId]);


  if (!product) {
    return <Text>Loading...</Text>;
  }

  return (
    <div>
      <Card maxW='xs'>
      <CardBody>
        <Image objectFit="cover" src={product.product_picture} alt={product.product_name} boxSize="250px" />
        <Stack mt='1' spacing='3'>
          <Heading size='md'>{product.product_name}</Heading>
          <Text>UPK: {upk}</Text>
          <Text>MSRP: {product.msrp} XRP</Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <ButtonGroup spacing='2'>
        <Button variant='solid' colorScheme='blue' onClick={modelPage.onOpen}>
          More Info
        </Button>
        <Button variant='ghost' colorScheme='blue' onClick={qrCode.onOpen}>
          QR Code
        </Button>
        </ButtonGroup>
      </CardFooter>
      </Card>

      <Modal isOpen={modelPage.isOpen} onClose={modelPage.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{product.product_name} Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Lot Number: {product.lot_number}</Text>
          <Text>Taxon: {product.taxon}</Text>
          <Text>Category: {product.msrp}</Text>
          <Text>Country of Origin: {product.country_of_origin}</Text>
          <Text>Sell By Date: {product.sell_by_date}</Text>
          <Text>Expiration Date: {product.expiration_date}</Text>
          <Image src={product.facts} alt={product.facts} />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={modelPage.onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
      </Modal>

      <Modal isOpen={qrCode.isOpen} onClose={qrCode.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{product.product_name} QR Code</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Image src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${tokenId}`} alt={product.product_name} boxSize="250px" />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={qrCode.onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
      </Modal>
      </div>
  );
}


function Dashboard() {
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);
    const productContractAddress = `0x78c6fd6930193d515890726e034692770c57b965`;
    const productContract = new ethers.Contract(productContractAddress, ProductABI.abi, provider);
  }, []);

  const cards = [];
    for (let i = 1; i <= 13; i++) {
      cards.push(DisplayProductInCard(13 - i));
    }

  return (
    <Flex>
      <Box width="20%" bg="gray.100" p={5} height="100vh">
        <Heading p="5" size="md" textAlign="center">myChain</Heading>
        <VStack>
          <Select placeholder='Select option'>
            <option value='option1'>Manufacturer</option>
            <option value='option2'>Retailer</option>
          </Select>
          <Input type="text" placeholder="Search by taxon number" />
        </VStack>
      </Box>

      {/* Main content */}
      <Box width="80%" p={5}>
          <Heading p={2} >Dashboard</Heading>
          <SimpleGrid columns={3} spacing={5}>
            {cards.map((card, index) => (
              <Box key={index} p={1} shadow='md' borderWidth='1px'>
                {card}
              </Box>
            ))}
          </SimpleGrid>
      </Box>
    </Flex>
  );
}

export default Dashboard;
