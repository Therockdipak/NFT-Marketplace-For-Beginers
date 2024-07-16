# Sample Hardhat Project

The NFTmarketplace contract facilitates the listing, buying, and transferring of NFTs within a secure marketplace.
It uses the Ownable and ReentrancyGuard modules from OpenZeppelin to manage ownership and prevent reentrancy attacks, 
respectively. The contract maintains a mapping of Listing structures to store details of listed NFTs, including the
seller, price, listing status, and sale status. The listNFT function allows the owner to list an NFT for sale, the 
buyNFT function enables users to purchase listed NFTs by transferring funds to the seller, and the transferNFT function
allows for transferring ownership of an NFT to another address. The contract also includes events to log the listing, 
sale, and transfer of NFTs.
