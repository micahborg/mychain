"use client";
import React from 'react';
import { Box, Container, Stack, Text, useColorModeValue } from '@chakra-ui/react';

const Footer = () => {
  return (
    <div className="footer" color={useColorModeValue('gray.700', 'gray.200')}>
      <Text>© 2024 Micah Borghese. Built for HackKU 2024.</Text>
    </div>
  )
}

export default Footer;
