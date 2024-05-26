"use client";
import React, { useImperativeHandle, forwardRef } from 'react';
import {
  Stack, Box, FormLabel, Input, InputGroup, InputLeftAddon, InputRightAddon,
  Select, Textarea, FormControl, Button,
  Alert
} from '@chakra-ui/react';
import SHA256 from 'crypto-js/sha256';
import { useXRP } from '../app/contexts/XrpContext';
import { useIPFS } from '../app/contexts/IpfsContext';
import { ethers } from 'ethers';
import ProductABI from '../abi/ProductNFT.json';

const ProductMinter = forwardRef((props, ref) => {
  const { connectWallet, walletConnected, currentWalletAddress, checkIsOnXRPLEVMSidechain, addXRPLEVMSidechain } = useXRP();
  const { uploadToIPFS } = useIPFS();

  // Expose the submit function to the parent component
  useImperativeHandle(ref, () => ({
    handleSubmit: handleFormSubmit
  }));

  async function handleFormSubmit() {
    const product_name = document.getElementById('product_name').value;
    const product_picture = document.getElementById('product_picture').files[0];
    const taxon = document.getElementById('taxon').value;
    const lot_number = document.getElementById('lot_number').value;
    const msrp = document.getElementById('msrp').value;
    const country_of_origin = document.getElementById('country_of_origin').value;
    const sell_by_date = document.getElementById('sell_by_date').value;
    const expiration_date = document.getElementById('expiration_date').value;
    const facts = document.getElementById('facts').files[0] || "";

    if (!walletConnected) {
      connectWallet();
      return;
    }
    if (!checkIsOnXRPLEVMSidechain) {
      console.error('Please switch to the XRPL EVM sidechain to mint Product NFTs');
      <Alert status='error'>Please switch to the XRPL EVM sidechain to mint Product NFTs</Alert>
      addXRPLEVMSidechain();
      return;
    }

    console.log('Submitting form...');

    
    // upload files to IPFS
    const productPictureUri = await uploadToIPFS(product_picture);
    console.log('productPictureUri:', productPictureUri);
    let factsUri = "";
    if (facts != "") {
      factsUri = await uploadToIPFS(facts);
    }
    console.log('factsUri:', factsUri);

  
    /*
    const metadataUrisJson = await JSON.stringify({ product_picture: `ipfs://QmSAmoa4dTXP61At544TiJYQai9NCnp6EotakuQ3BBrMx6`, facts: `ipfs://QmUhLtRqf5qar4yJQR8aP2tApb7W3rnvBmjdnbM7DtwBNg` }); 
    console.log('metadataUrisJson:', metadataUrisJson.product_picture);
    
    const product_picture_uri = `ipfs://QmSAmoa4dTXP61At544TiJYQai9NCnp6EotakuQ3BBrMx6`;
    const facts_uri = `ipfs://QmUhLtRqf5qar4yJQR8aP2tApb7W3rnvBmjdnbM7DtwBNg`;
    */

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contractAddress = `${import.meta.env.VITE_APP_PRODUCT_CONTRACT_ADDRESS}`; // Product NFT contract address
    const contract = new ethers.Contract(contractAddress, ProductABI.abi, signer);
    try {
      const userAddress = await signer.getAddress();
      const tx = await contract.safeMint(
        userAddress,
        product_name,
        productPictureUri,  // new
        taxon,
        lot_number,
        msrp,
        country_of_origin,
        sell_by_date,
        expiration_date,
        factsUri // new
      );
  
      await tx.wait();
      console.log('Transaction hash:', tx.hash);
      window.open(`https://evm-sidechain.xrpl.org/tx/${tx.hash}`, '_blank').focus();
    } catch (error) {
      console.error('Error minting NFT:', error);
    }

    // Log the form data
    console.log('Form data:', {
      product_name,
      product_picture,
      taxon,
      lot_number,
      msrp,
      country_of_origin,
      sell_by_date,
      expiration_date,
      facts_uri,
    });
  }

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Stack spacing='24px'>
        <Box>
          <FormControl isRequired>
          <FormLabel htmlFor='product_name'>Product Name</FormLabel>
          <Input
            id='product_name'
            placeholder='Please enter product name'
          />
          </FormControl>
        </Box>

        <Box>
        <FormControl isRequired>
          <FormLabel htmlFor='product_picture'>Product Picture</FormLabel>
          <Input
            type='file'
            id='product_picture'
          />
          </FormControl>
        </Box>

        <Box>
          <FormControl isRequired>
          <FormLabel htmlFor='taxon'>Taxon</FormLabel>
          <Input
            type='number'
            id='taxon'
            placeholder='Please enter taxon'
          />
          </FormControl>
        </Box>

        <Box>
        <FormControl isRequired>
          <FormLabel htmlFor='lot_number'>Lot Number</FormLabel>
          <Input
            type='number'
            id='lot_number'
            placeholder='Please enter lot number'
          />
          </FormControl>
        </Box>

        <Box>
          <FormLabel htmlFor='msrp'>MSRP</FormLabel>
          <Input
            id='msrp'
            placeholder='Please enter MSRP in XRP'
          />
        </Box>

        <Box>
          <FormLabel htmlFor='country_of_origin'>Country of Origin</FormLabel>
          <Input
            id='country_of_origin'
            placeholder='Please enter country of origin'
          />
        </Box>

        <Box>
          <FormLabel htmlFor='sell_by_date'>Sell By Date</FormLabel>
          <Input
            type='date'
            id='sell_by_date'
          />
        </Box>

        <Box>
          <FormLabel htmlFor='expiration_date'>Expiration Date</FormLabel>
          <Input
            type='date'
            id='expiration_date'
          />
        </Box>

        <Box>
          <FormLabel htmlFor='nutrition_facts'>Nutrition Facts/List of Materials</FormLabel>
          <Input
            type='file'
            id='facts'
          />
        </Box>
      </Stack>
    </form>
  );
});

ProductMinter.displayName = 'ProductMinter';

export default ProductMinter;