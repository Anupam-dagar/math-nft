const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory("MathNFT");
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);

  let transaction = await nftContract.makeMathNFT();
  await transaction.wait();
  console.log("Minted NFT #1");

  transaction = await nftContract.makeMathNFT();
  await transaction.wait();
  console.log("Minted NFT #2");
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
