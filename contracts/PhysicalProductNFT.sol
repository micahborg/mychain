// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.19;

import "@openzeppelin/contracts@4.8.2/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.8.2/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts@4.8.2/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts@4.8.2/access/Ownable.sol";
import "@openzeppelin/contracts@4.8.2/utils/Counters.sol";
import "@openzeppelin/contracts@4.8.2/utils/cryptography/ECDSA.sol";

interface IManufacturerNFT {
    function balanceOf(address owner) external view returns (uint256);
    function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256 tokenId);
}

contract ProductNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    using ECDSA for bytes32;

    address manufacturerNFT;
    address retailerNFT;

    // Event for when a new product NFT is minted
    event ProductMinted(uint256 indexed tokenId, string productKey);

    // Struct to hold product metadata
    struct ProductMetadata {
        string name;
        string productPicture;
        uint256 manufacturerNFTId;
        uint256 taxon;
        string universalProductKey;
        uint256 lotNumber;
        uint256 msrp;
        string countryOfOrigin;
        string sellByDate;
        string expirationDate;
        string factsUri; // IPFS URI ingredients/nutrition/list of materials (as an image)
    }

    // Mapping from tokenId to ProductMetadata
    mapping(uint256 => ProductMetadata) public productMetadata;

    constructor(address manufacturerNFTAddress)
        ERC721("ProductNFT", "PNFT")
    {
        manufacturerNFT = manufacturerNFTAddress;
    }

    function safeMint(
            address to,
            string memory name, 
            string memory productPicture,
            uint256 taxon,
            uint256 lotNumber,
            uint256 msrp,
            string memory countryOfOrigin,
            string memory sellByDate,
            string memory expirationDate,
            string memory factsUri
        )
        public
    {
        require(IManufacturerNFT(manufacturerNFT).balanceOf(msg.sender) == 1, "Caller is not a manufacturer.");
        uint256 manufacturerNFTId = IManufacturerNFT(manufacturerNFT).tokenOfOwnerByIndex(msg.sender, 0);

        // Increment tokenIds
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();

        // Calculate Universal Product Key
        string memory universalProductKey = calculateUPK(manufacturerNFTId, taxon);

        _mint(to, tokenId);
        _setTokenURI(tokenId, productPicture); // Utilizing the IPFS URI for the tokenURI

        productMetadata[tokenId].name = name;
        productMetadata[tokenId].productPicture = productPicture;
        productMetadata[tokenId].manufacturerNFTId = manufacturerNFTId;
        productMetadata[tokenId].taxon = taxon;
        productMetadata[tokenId].universalProductKey = universalProductKey;
        productMetadata[tokenId].lotNumber = lotNumber;
        productMetadata[tokenId].msrp = msrp;
        productMetadata[tokenId].countryOfOrigin = countryOfOrigin;
        productMetadata[tokenId].sellByDate = sellByDate;
        productMetadata[tokenId].expirationDate = expirationDate;
        productMetadata[tokenId].factsUri = factsUri;

        emit ProductMinted(tokenId, universalProductKey);
    }

    // Helper function to calculate the Universal Product Key //
    function calculateUPK(uint256 manufacturerNFTId, uint256 taxon) private pure returns (string memory) {
    bytes32 hash = keccak256(abi.encodePacked(manufacturerNFTId, taxon));
    return bytes32ToString(hash);
    }

    function bytes32ToString(bytes32 _bytes32) private pure returns (string memory) {
        bytes memory bytesArray = new bytes(64);
        for (uint256 i; i < 32; i++) {
            bytesArray[i*2] = byteToHexChar(byte(uint8(_bytes32[i] >> 4)));
            bytesArray[1+i*2] = byteToHexChar(byte(uint8(_bytes32[i] & 0x0F)));
        }
        return string(bytesArray);
    }

    function byteToHexChar(byte b) private pure returns (byte c) {
        if (uint8(b) < 10) return byte(uint8(b) + 0x30);
        else return byte(uint8(b) + 0x57);
    }


    // GET functions supported for front end applications //
    function getName(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Query for nonexistent token");
        return productMetadata[tokenId].name;
    }
    function getManufacturerNFTId(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "Query for nonexistent token");
        return productMetadata[tokenId].manufacturerNFTId;
    }
    function getTaxon(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "Query for nonexistent token");
        return productMetadata[tokenId].taxon;
    }
    function getUniversalProductKey(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Query for nonexistent token");
        return productMetadata[tokenId].universalProductKey;
    }
    function getLotNumber(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "Query for nonexistent token");
        return productMetadata[tokenId].lotNumber;
    }
    function getMsrp(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "Query for nonexistent token");
        return productMetadata[tokenId].msrp;
    }
    function getCountryOfOrigin(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Query for nonexistent token");
        return productMetadata[tokenId].countryOfOrigin;
    }
    function getSellByDate(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Query for nonexistent token");
        return productMetadata[tokenId].sellByDate;
    }
    function getExpirationDate(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Query for nonexistent token");
        return productMetadata[tokenId].expirationDate;
    }
    function getFactsUri(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Query for nonexistent token");
        return productMetadata[tokenId].factsUri;
    }

    // The following functions are overrides required by Solidity //
    function _beforeTokenTransfer(
    address from,
    address to,
    uint256 firstTokenId,
    uint256 batchSize
    ) internal virtual override (ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal virtual override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    // Override the supportsInterface function to resolve the conflict
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        string memory _tokenURI = super.tokenURI(tokenId);
        return _tokenURI;
    }

}