// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import"./MyNFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract NFTmarketplace is Ownable, ReentrancyGuard {
     
     ERC721 public nftContract;

     struct Listing {
        address seller;
        uint256 price;
        bool isListed;
        bool isSold;
     }

     mapping (uint256 => Listing) public listings;

     event NFTlisted(uint256 indexed tokenId, address indexed seller, uint256 price);
     event NFTSold(uint256 indexed tokenId, address indexed buyer, uint256 price);
     event NFTTransfer(uint256 tokenId,address indexed owner, address indexed to);

     constructor(address _nftContract) Ownable(msg.sender) {
        nftContract = ERC721(_nftContract);
     }

    function listNFT(uint256 _tokenId, uint256 _price) external nonReentrant {
        require(nftContract.ownerOf(_tokenId) == owner(), "Only the owner can list NFT");
        require(!listings[_tokenId].isListed, "NFT is already listed");
    
       listings[_tokenId] = Listing(msg.sender, _price, true, false);
       emit NFTlisted(_tokenId, msg.sender, _price);
   }

    function buyNFT(uint256 _tokenId) external payable nonReentrant {
        require(!listings[_tokenId].isSold,"NFT already sold");
        require(msg.value >= listings[_tokenId].price,"Insufficient funds");

        address prevOwner = listings[_tokenId].seller;
        payable(prevOwner).transfer(msg.value);

        nftContract.safeTransferFrom(listings[_tokenId].seller, msg.sender, _tokenId);
        listings[_tokenId].isSold = true;
        emit NFTSold(_tokenId, msg.sender, msg.value);
    }

    function transferNFT(uint256 _tokenId, address _to) external nonReentrant {
        require(listings[_tokenId].isListed == true, "This NFT is not listed");
        
        require(listings[_tokenId].isSold == false, "Token is already sold");
    
        nftContract.safeTransferFrom(msg.sender, _to, _tokenId); // Transfer NFT token
        emit NFTTransfer(_tokenId, msg.sender, _to);
      }

    function balance() view public returns(uint256) {
       return(address(this).balance);
    }
}
