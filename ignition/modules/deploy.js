// deployments/deployMyNFT.js
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DeployMyNFT", (m) => {
  const myNFT = m.contract("MyNFT", ["MyNFT", "MNFT"]);
  return { myNFT };
});

module.exports = buildModule("deployNFTMarketplace",(m)=>{
  const erc721Contract = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const nftMarket = m.contract("NFTmarketplace",[erc721Contract]);
  return{nftMarket};
});