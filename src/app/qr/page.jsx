/*
    A portion of this code is taken from the following repository:
    https://github.com/SurajanShrestha/qr-scanner-in-react.git
*/
"use client";
import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import QrFrame from "../components/assets/qr-frame.svg";
import { ethers } from 'ethers';
import ProductABI from '../../abi/ProductNFT.json';
import RetailerABI from "../../abi/RetailerNFT.json";
import ManufacturerABI from "../../abi/ManufacturerNFT.json"
import { useDisclosure } from '@chakra-ui/react';
import {
  Box, Flex, Heading, Text, Image, Button, Divider,
  VStack, Select, Stack, Divide, Card, CardHeader, CardBody, CardFooter, ButtonGroup,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody,ModalCloseButton,
} from '@chakra-ui/react'

const Qr = () => {
  const videoRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [product, setProduct] = useState(null);
  const [tokenId, setTokenId] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const contractAddress = `${process.env.VITE_APP_PRODUCT_CONTRACT_ADDRESS}`;
    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);
    const productContract = new ethers.Contract(contractAddress, ProductABI.abi, provider);

    async function fetchProduct(tokenId) {
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
        setIsCameraOn(false); // Stop the camera after fetching the product data
      } catch (error) {
        console.error("Failed to fetch product data:", error);
      }
    }
    const qrScanner = new QrScanner(videoRef.current, (result) => {
      console.log("Scanned result:", result);
      setTokenId(result.data); // Assuming the QR code directly contains the tokenId
      fetchProduct(result.data);
    }, {
      highlightScanRegion: true,
      highlightCodeOutline: true,
    });

    qrScanner.start().catch((error) => {
      console.error('Error starting QR scanner:', error);
      alert("Camera access denied!");
      setIsCameraOn(false);
    });

    return () => qrScanner.stop();
  }, []);
  

  const modelPage = useDisclosure();
  const qrCode = useDisclosure();

  if (!isCameraOn) {
    return (
      <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" p={5}>
      {product ? (
        <>
        {/* <Image src={nftData.imageUrl.replace('ipfs://', 'https://ipfs.io/ipfs/')} alt="NFT Image" />
        <Box p="6">
          <Box display="flex" alignItems="baseline">
          <Heading size="lg" fontWeight="semibold" lineHeight="tight" isTruncated>
            {nftD</Stack>ata.name}
          </Heading>
          </Box>
          <Text mt={2}>{nftData.additionalInfo}</Text>
        </Box> */}
        <Box justifyContent="center">
        <Card maxW='xs'>
        <CardBody>
          <Image objectFit="cover" src={product.product_picture} alt={product.product_name} boxSize="250px" />
          <Stack mt='1' spacing='3'>
            <Heading size='md'>{product.product_name}</Heading>
            <Text>UPK: hey</Text>
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
        </Box>
        <Button margin="15px" onClick={() => {
          setIsCameraOn(true);
          window.location.reload();
        }}>Scan Again</Button>

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
            <Image src={product.facts.replace} alt={product.facts} />
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
            <Image src='https://api.qrserver.com/v1/create-qr-code/?size=150x150&data={product.tokenId}' alt={product.product_name} boxSize="250px" />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={qrCode.onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
        </Modal>
        </>
      ) : (
        <Text>Loading NFT data...</Text>
      )}
      </Box>
    );
  }

  return (
    <Box p={1}>
      <Flex h={75} align="center" justify="center">
        <Heading>Scan QR Code</Heading>
      </Flex>
      <div className="qr-reader">
        <video ref={videoRef}></video>
        <div className="qr-box">
          <Image src={QrFrame} alt="QR Frame" width={256} height={256} className="qr-frame" />
        </div>
      </div>
    </Box>
  );
};

export default Qr;
