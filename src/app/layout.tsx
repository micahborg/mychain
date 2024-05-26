import React from "react";
import Metadata from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { XRPProvider } from "./contexts/XrpContext";
import { IPFSProvider } from "./contexts/IpfsContext";
import Header from "./components/Header";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ChakraProvider>
          <XRPProvider>
            <IPFSProvider>
              <Header />
                {children}
              <Footer />
            </IPFSProvider>
          </XRPProvider>
      </ChakraProvider>
      </body>
    </html>
  );
}
