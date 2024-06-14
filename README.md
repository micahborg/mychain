# HackKU 2024 Project

**"myChain: Next-Generation Product Identification and Information System"**

A use case for NFTs on the supply chain.

Deployed ERC 721 Smart Contracts:
- [Products Contract](https://evm-sidechain.xrpl.org/address/0x78c6FD6930193D515890726e034692770C57B965)
- [Manufacturers Contract](https://evm-sidechain.xrpl.org/token/0x142d88F0CA0ccC9be036A22EE3A1D7969f4475E9)
- [Retailers Contract](https://evm-sidechain.xrpl.org/address/0xE44e71BE8cdaB5A36E4556d6f2882F581847011e)

# **Executive Summary**

myChain seeks to overhaul traditional barcode systems by introducing a blockchain-powered QR code technology. This innovation aims to standardize and enrich product data across the supply chain and retail environment. By embedding detailed product information, including nutritional data, expiration dates, and sourcing details directly into QR codes stored on a blockchain, myChain ensures data integrity, transparency, and accessibility.

# **Background**

### The Problem with UPC Barcodes

Barcodes have been the go-to method of product identification in supply chains and supermarkets since the ‘70s. Since the beginning, the entire process of creating a Universal Product Code (UPC) and converting it to a barcode has been completely centralized. First, you must [purchase or license a UPC](https://www.nerdwallet.com/article/small-business/what-is-upc-barcode) from a trusted UPC seller. On top of this, data for UPCs is stored multiple on databases managed by different parties, which increases the possibility of incorrect and/or outdated information regarding a product’s name, size, and supply chain history. On the right is an example of a barcode.



Today, many retailers utilized the UPC-A barcode. A UPC-A barcode is composed of 12 numerical digits. It starts with a single-digit system character, indicating the category of the product, such as a regular product, a weighted item, pharmaceuticals, coupons, and so on. This is followed by a five-digit number assigned to the manufacturer, a five-digit product identifier, and concludes with a checksum digit for verification. Each digit is uniquely represented by a pattern comprising two bars and two spaces of variable widths. Only numerical digits are permitted; letters and special characters are excluded.


### UPCs vs SKUs vs Serial Numbers, what?

A Universal Product Code (UPC) and a Stock-Keeping Unit (SKU) essentially serve the same purpose: to identify products for inventory and tracking reasons. If we were talking about clothes, all red size eight blouses would have the exact same SKU and UPS from the maker for a particular style. Cars and appliances such as TVs and refrigerators would also share skus and upcs, but each would have a unique serial number that is used when requesting repair or other related services.: **Why do we need three codes to identify the same product in different contexts?**

# Solution

<aside>
💡 Develop a secure, transparent, and scalable QR-code blockchain-backed system capable of simplifying supply chain and retail interactions.

</aside>

## Capturing and Separating Product Data in Groups

This section shows the different data collected depending on the context in which the product is observed: for all products (ex. all “Marketside Organic Cage-Free Large Brown Eggs”) and for each product specifically (ex. picking up and looking at one container of “Marketside Organic Cage-Free Large Brown Eggs” at Walmart specifically). It is also divided into static vs dynamic data, where static is specific to the immutable manufacturer and distributer information of the product and dynamic is specific to mainly the retailer selling the product.

### Static Data Appl. to All Products:

- Product Name
- Universal Product Key (UPK): See later section
- Manufacturer/Brand Name
- Product Category
- Ingredients/Nutrition/List of Materials
- Certifications
- Batch/Lot Number

### Dynamic Data Appl. to All Products:

- Retail Price
- Stock Levels
- Shipment Information
- Product Location and Placement

### Static Data Appl. to a Product:

- Country of Origin
- Sell By Date
- Expiration Date
- Supply Chain Path

### Dynamic Data Appl. to a Product:

- Quality Inspection Results

## Product Lines and Individual Products

Product Lines = NFT Taxons/Collections

Individual Products = The NFT 

## What if Product QR Codes Were Mapped to an NFT?


Leveraging the power of storing data within a QR code, we can store an entire NFT ID inside of it. On the NFT itself, we can store metadata linked to most of the static Product Data listed above. Scanning a product’s QR will essentially return the NFT ID, which contains identifying information:

1. ***The Product’s UPK*** (See next section. Identifies the product line, like the UPC/SKU)
2. ***The Product’s NFT ID*** (Identifies the Individual Product)

Products, including food items, don’t need the extra overhead that comes with barcodes, as much of their data is static anyway. There’s no need to store this metadata in a database. Rather, **we can store it on a blockchain!**

## Introducing the Universal Product Key (UPK)

$$
UPK = SHA256(Manufacturer\ NFT\ ID \ + \ Product\ NFT\ Taxon)
$$

The UPK is a unique approach to solving the UPC vs SKU problem. UPK harnesses the security and immutability of the blockchain to generate universally unique codes for product lines. With this solution, a unique “key” is generated for any product stored on the blockchain, replacing the need for two separate codes. Serial numbers, however, well they’re just the Product’s NFT ID or Hash!

## Scannable NFTs: Tracking Ownership Along The Supply Chain

As a product moves along the supply chain, an NFT should be able to change ownership through simply and quickly scanning the QR code at the next destination. But there are considerations:

1. We don’t want anyone to be able to scan a QR code and receive ownership
2. A retailer might buy thousands of products at a time (thousands of individual NFTs)

We can solve this by implementing functions into smart contract logic that allow the current owner to transfer or sell either one or many NFTs in a collection to an entity (a distributer, a retail store, a buyer, etc.). 

# **Project Description**

### Technology Stack

- **Blockchain Backend**: Use of Ripple’s Ethereum Virtual Machine (EVM) compatible XRP Ledger sidechain for programmability, smart controls, and cross-chain interoperability.
- **QR Code Simulation and Generation**: QR code generation built with QRCode.js library capable of encoding the products NFT into a scannable asset.
- **API Integration**: A native Python Flask API for seamless data retrieval and updates by manufacturers, distributers, and retailers.

### Features

1. **Dynamic Data Encoding**: Each product will have a unique QR code containing static data for each product and a UPK for handling off-chain, retailer-specific dynamically updated data. 
2. **90% on-chain, 100% decentralized**: All static product data will be recorded on the XRPL blockchain, ensuring data integrity and traceability. Relating-product images, including an image of the product and the national facts image are stored on IPFS with Pinata.
3. **Standardized Information Schema**: Development of a universal schema for product information to ensure consistency across the board.
4. **Consumer Access**: A mobile-friendly web interface allowing consumers to scan QR codes and access detailed product information.
5. **Supply Chain Tools**: Tools for manufacturers and retailers to easily create, update, and manage product information on the blockchain.

## How you might use the web app

- Going onto the site for the first time, you have the option to connect your wallet (the wallet is usually associated with a company). After connecting your wallet, you have four options:
    1. **Obtain a “Manufacturer NFT”**
        - This is for companies that create products and will be minting their own QR-code NFTs for their products
        - Wallets with this NFT will be allowed to mint NFTs for their products and store them in collections. Products can be identified by their collection ID.
    2. **Obtain a “Retailer NFT”**
        - This is for companies that sell products to consumers. For this project, transfer to a retailer is the final stage of the supply chain. Therefore, retailers do not have the option to transfer ownership.
    3. **Use the QR Code Simulator**
        - Anyone, without connecting a wallet, can use the simulator to view QR codes based on products as well as scan QR codes to retrieve metadata about the product from the blockchain.

# Future Implementations

- Instead of capturing nutritional or material facts about a product via an image, utilize a json
- Utilize The Graph or related library for faster server-side rendering for scalability