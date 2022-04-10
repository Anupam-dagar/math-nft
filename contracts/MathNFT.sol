// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract MathNFT is ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    constructor() ERC721("MathNFT", "MATH") {
        console.log("MathNFT smart contract.");
    }

    function makeMathNFT() public {
        uint256 nftId = _tokenIds.current();
        _safeMint(msg.sender, nftId);
        _setTokenURI(nftId, "https://jsonkeeper.com/b/Y92E");
        _tokenIds.increment();
        console.log(
            "A Math NFT with Id %s has been minted to %s",
            nftId,
            msg.sender
        );
    }
}
