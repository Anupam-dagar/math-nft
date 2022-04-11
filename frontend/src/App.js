import "./styles/App.css";
import React from "react";

// Constants
const OPENSEA_LINK = "";
const TOTAL_MINT_COUNT = 50;

const App = () => {
  // Render Methods
  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Math NFT Collection</p>
          <p className="sub-text">
            Discover your unique mathematically generated NFT today.
          </p>
          {renderNotConnectedContainer()}
        </div>
      </div>
    </div>
  );
};

export default App;
