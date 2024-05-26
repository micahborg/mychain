"use client";
import React, { useState } from 'react'
import { 
  Box, Flex, Avatar, HStack,Text, IconButton, Button, 
  Menu, MenuButton, MenuList, MenuItem, MenuDivider, 
  useDisclosure, useColorModeValue, Stack, Image,
  Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, DrawerCloseButton, DrawerFooter
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { useXRP } from '../contexts/XrpContext';
import myChainLogo from './assets/myChain_logo_transparent.png';

import ProductMinter from './ProductMinter';

const NavLink = ({ children, href }) => {
  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
      href={href}>
      {children}
    </Box>
  )
}

function handleProductLink() {
  window.location.href = '/dashboard';
}

export default function Simple() {
  const { isOpen, onOpen, onClose,  } = useDisclosure();
  const mintProduct = useDisclosure();  
  const mintTaxon = useDisclosure();  

  const btnRef = React.useRef();

  const formRef = React.useRef();
  const handleSave = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  };
  const handleClose = () => {
    mintProduct.onClose();
  };

  const { connectWallet, walletConnected, currentWalletAddress } = useXRP();

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={10}>   
        <Flex h={75} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={4} alignItems={'center'}>
            <Box>
              <Image boxSize='60px' src={myChainLogo.src} alt='logo' />
            </Box>
            <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
              <NavLink href="/">Home</NavLink>  
              <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/about">About</NavLink>
              <NavLink href="/qr">QR Code Simulator</NavLink>
            </HStack>
          </HStack>


          <Flex alignItems={'center'}>
            {walletConnected && (
            <Menu>
              <Text pr={4}>Hey, {currentWalletAddress}!</Text>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}>
                <Avatar
                  size={'md'}
                  src={'src/components/assets/panda.png'}
                />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={handleProductLink}>My Products</MenuItem>
                <MenuDivider />
                <MenuItem ref={btnRef} onClick={mintProduct.onOpen}>Mint New Product</MenuItem>
                <MenuItem ref={btnRef} onClick={mintTaxon.onOpen}>Mint New Taxon</MenuItem>
              </MenuList>
            </Menu>
            )}

            <Drawer
            isOpen={mintProduct.isOpen}
            placement='right'
            onClose={mintProduct.onClose}
            finalFocusRef={btnRef}
            size={'md'}
            >
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                  <DrawerHeader borderBottomWidth='1px'>
                  Create a new product
                  </DrawerHeader>
                <DrawerBody>
                  <ProductMinter ref={formRef}/>
                </DrawerBody>
                <DrawerFooter borderTopWidth='1px'>
                  <Button variant='outline' mr={3} onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button colorScheme='blue' onClick={handleSave}>
                    Submit
                  </Button>
                </DrawerFooter>
                </DrawerContent>
            </Drawer>

            <Drawer
            isOpen={mintTaxon.isOpen}
            placement='right'
            onClose={mintTaxon.onClose}
            finalFocusRef={btnRef}
            size={'md'}
            >
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                  <DrawerHeader borderBottomWidth='1px'>
                  Create a new taxon
                  </DrawerHeader>
                <DrawerBody>
                  <ProductMinter ref={formRef}/>
                </DrawerBody>
                <DrawerFooter borderTopWidth='1px'>
                  <Button variant='outline' mr={3} onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button colorScheme='blue' onClick={handleSave}>
                    Submit
                  </Button>
                </DrawerFooter>
                </DrawerContent>
            </Drawer>

            {!walletConnected && (
              <Button
                onClick={connectWallet}
                colorScheme={'teal'}
                variant={'solid'}
                _hover={{
                  bg: 'teal.300',
                }}>
                Connect Wallet
              </Button>
            )}
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              <NavLink href="/">Home</NavLink>  
              <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/about">About</NavLink>
              <NavLink href="/qr">QR Code Simulator</NavLink>
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  )
}