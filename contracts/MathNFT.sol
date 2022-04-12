// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract MathNFT is ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    event NftMinted(address sender, uint256 tokenId);

    string baseSvg =
        "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    string[] firstWords = [
        "Satisfying",
        "Gullible",
        "Makeshift",
        "Annoyed",
        "Groovy",
        "Fallacious"
    ];
    string[] secondWords = [
        "Stupid",
        "Torpid",
        "Hot",
        "Tranquil",
        "Common",
        "Expensive"
    ];
    string[] thirdWords = [
        "Grateful",
        "Enchanting",
        "Concerned",
        "Majestic",
        "Picayune",
        "Scandalous"
    ];

    constructor() ERC721("MathNFT", "MATH") {
        console.log("MathNFT smart contract.");
    }

    function makeMathNFT() public {
        uint256 nftId = _tokenIds.current();

        string memory first = pickRandomWord(nftId, "FIRST");
        string memory second = pickRandomWord(nftId, "SECOND");
        string memory third = pickRandomWord(nftId, "THIRD");
        string memory combinedWord = string(
            abi.encodePacked(first, second, third)
        );
        string memory finalSvg = string(
            abi.encodePacked(baseSvg, combinedWord, "</text></svg>")
        );

        string memory svgBase64 = Base64.encode(bytes(finalSvg));
        string memory jsonSvg = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        combinedWord,
                        '", "description": "A collection of mathematical data.", "image": "data:image/svg+xml;base64,',
                        svgBase64,
                        '"}'
                    )
                )
            )
        );

        string memory nftUri = string(
            abi.encodePacked("data:application/json;base64,", jsonSvg)
        );
        _safeMint(msg.sender, nftId);
        _setTokenURI(nftId, nftUri);
        _tokenIds.increment();
        console.log(
            "A Math NFT with Id %s has been minted to %s",
            nftId,
            msg.sender
        );
        emit NftMinted(msg.sender, nftId);
    }

    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }

    function pickRandomWord(uint256 tokenId, string memory wordArray)
        public
        view
        returns (string memory)
    {
        uint256 rand = random(
            string(abi.encodePacked(wordArray, Strings.toString(tokenId)))
        );
        string[] memory words;
        if (
            keccak256(abi.encodePacked(wordArray)) ==
            keccak256(abi.encodePacked("FIRST"))
        ) {
            words = firstWords;
        }
        if (
            keccak256(abi.encodePacked(wordArray)) ==
            keccak256(abi.encodePacked("SECOND"))
        ) {
            words = secondWords;
        }
        if (
            keccak256(abi.encodePacked(wordArray)) ==
            keccak256(abi.encodePacked("THIRD"))
        ) {
            words = thirdWords;
        }

        rand = rand % words.length;
        return words[rand];
    }
}
