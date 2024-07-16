const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTmarketplace", async () => {
  let NFTmarketplace;
  let myNFT;
  let owner;
  let addr1;
  let addr2;
  
  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
    myNFT = await ethers.deployContract("MyNFT", ["MyNFT", "MNFT"]);
    console.log(await myNFT.getAddress());

    NFTmarketplace = await ethers.deployContract("NFTmarketplace", [await myNFT.getAddress()]);
    
    // Mint an NFT and transfer to owner
    await myNFT.connect(owner).mint(await owner.getAddress(), 1);
    await myNFT.connect(owner).setApprovalForAll(await NFTmarketplace.getAddress(), true);
    console.log(await NFTmarketplace.getAddress());
  });

  describe("Deployment", function () {
    it("Should set the correct NFT contract address", async function () {
      expect(await NFTmarketplace.nftContract()).to.equal(await myNFT.getAddress());
    });
  });
   
  describe("listNFT", ()=>{
    it("should list an NFT for sell", async ()=>{
       await NFTmarketplace.connect(owner).listNFT(1, ethers.parseEther("1"));
       const listing = await NFTmarketplace.listings(1);

       expect(listing.seller).to.equal(await owner.getAddress());
       expect(listing.price).to.equal(ethers.parseEther("1"));
       expect(listing.isListed).to.be.true;
       expect(listing.isSold).to.be.false;
    });
  });

     describe("buyNFT", ()=>{
        beforeEach(async ()=> {
          await NFTmarketplace.connect(owner).listNFT(1,ethers.parseEther("1"));
        });

        it("should allow someone to buy NFT", async ()=> {
           await NFTmarketplace.connect(addr1).buyNFT(1, {value:ethers.parseEther("1")});
           const listing = await NFTmarketplace.listings(1);

           expect(listing.isSold).to.be.true;
           expect(await myNFT.ownerOf(1)).to.equal(await addr1.getAddress());
        });
    

     it("should fail if the buyer sends insufficient funds", async ()=>{
      await expect(NFTmarketplace.connect(addr1).buyNFT(1, { value: ethers.parseEther("0.5") })).to.be.revertedWith("Insufficient funds");
     });
    });

    describe("TransferNFT", async ()=>{
       beforeEach( async ()=>{
        await NFTmarketplace.connect(owner).listNFT(1,ethers.parseEther("1"));
      });

       it("should transfer an NFT", async ()=> {
          await NFTmarketplace.connect(owner).transferNFT(1, addr1.getAddress());
          expect(await myNFT.ownerOf(1)).to.equal(await addr1.getAddress());
       });

       it("should fail to transfer if NFT is already sold", async ()=> {
          await NFTmarketplace.connect(addr1).buyNFT(1, {value:ethers.parseEther("1")});
          await expect(NFTmarketplace.connect(owner).transferNFT(1, addr2.getAddress())).to.be.revertedWith("Token is already sold");
       });
    });

    describe("balance", async ()=> {
      it("should return the contract balance", async ()=>{
         expect(await NFTmarketplace.balance()).to.equal(0);
      })
    })
});
