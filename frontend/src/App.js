import "./styles/App.css";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import mathNft from "./utils/MathNFT.json";

// Constants
const OPENSEA_LINK = "https://testnets.opensea.io/assets/";
const TOTAL_MINT_COUNT = 50;

const App = () => {
  const CONTRACT_ADDRESS = "0xCDc8ACCf7c884C6834155e9849b4577566d18111";

  const [currentAccount, setCurrentAccount] = useState("");
  const [mintCount, setMintCount] = useState(0);

  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="cta-button connect-wallet-button"
    >
      Connect to Wallet
    </button>
  );

  const isWalletConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("metamask not installed.");
      return;
    }
    console.log("metamask is installed", ethereum);
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found accounts: ", account);
      setCurrentAccount(account);
      setupNftMintedEventListener();
      setMintedNftsCount();
      return;
    }

    console.log("no metamask account found.");
  };

  const setMintedNftsCount = async () => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, mathNft.abi, signer);
    const nftsMintCount = await contract.mintCount();
    setMintCount(nftsMintCount.toNumber());
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Please install metamask to continue.");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected accounts:", accounts[0]);
      setCurrentAccount(accounts[0]);
      setupNftMintedEventListener();
      setMintedNftsCount();
    } catch (error) {
      console.log(error);
    }
  };

  const setupNftMintedEventListener = () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("metamask not present.");
        return;
      }
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        mathNft.abi,
        signer
      );
      contract.on("NftMinted", (from, tokenId) => {
        console.log(from, tokenId.toNumber());
        setMintedNftsCount();
        alert(
          `MathNft has been minted. Here's the link: ${OPENSEA_LINK}${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
        );
      });
      console.log("NftMinted listener setup complete.");
    } catch (error) {
      console.log("Metamask not present.");
    }
  };

  const mintNft = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Metamask not installed");
        return;
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        mathNft.abi,
        signer
      );

      console.log("Opening wallet to confirm transaction.");
      let transaction = await connectedContract.makeMathNFT();
      console.log("Mining NFT...");
      await transaction.wait();
      console.log(
        `Math NFT mined. View transaction at: https://rinkeby.etherscan.io/tx/${transaction.hash}`
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    isWalletConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Math NFT Collection</p>
          <p className="sub-text">
            Discover your unique mathematically generated NFT today.
          </p>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <>
              <h3 className="sub-text">
                {mintCount}/{TOTAL_MINT_COUNT} Nft Minted
              </h3>
              <button
                onClick={mintNft}
                className="cta-button connect-wallet-button"
              >
                Mint NFT
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
