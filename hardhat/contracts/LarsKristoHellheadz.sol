// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LarsKristoHellheadz is ERC721Enumerable, ERC721Royalty, Ownable {
  error ERC721ForbiddenMint(uint256 tokenId);

  address private _author; // larskristo.eth

  uint256 private _tokenLimit; // set to 666 at build time

  string[] private _tokenURIs;

  constructor(
    string memory name_,
    string memory symbol_,
    address author,
    uint256 tokenLimit
  ) ERC721(name_, symbol_) Ownable(author) {
    _author = author;
    _tokenLimit = tokenLimit;

    _setDefaultRoyalty(_author, 1000); // 10% royalty
  }

  function batchMint(string[] memory tokenURIs_) public onlyOwner {
    for (uint i = 0; i < tokenURIs_.length; i++) {
      uint256 tokenId = totalSupply();
      uint256 nextTokenId = tokenId + 1;

      if (nextTokenId > _tokenLimit) {
        revert ERC721ForbiddenMint(nextTokenId);
      }

      _safeMint(_author, tokenId);

      string memory tokenURI_ = tokenURIs_[i];
      _tokenURIs.push(tokenURI_);
    }
  }

  /**
   * @dev Returns the URI for a given token ID.
   *
   * Requirements:
   * - The caller must own the token.
   *
   * @param tokenId The ID of the token.
   * @return The URI for the given token ID.
   */
  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    _requireOwned(tokenId);

    string memory baseURI = _baseURI();
    string memory tokenURIhash = _tokenURIs[tokenId];

    return bytes(baseURI).length > 0 ? string.concat(baseURI, tokenURIhash) : "";
  }

  function _increaseBalance(address account, uint128 amount) internal override(ERC721, ERC721Enumerable) {
    super._increaseBalance(account, amount);
  }

  function _update(
    address to,
    uint256 tokenId,
    address auth
  ) internal override(ERC721, ERC721Enumerable) returns (address) {
    return super._update(to, tokenId, auth);
  }

  function supportsInterface(bytes4 interfaceId) public view override(ERC721Enumerable, ERC721Royalty) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  /**
   * @dev Returns the base URI for token metadata.
   * @return The base URI string.
   */
  function _baseURI() internal view virtual override returns (string memory) {
    return "https://blockchainassetregistry.infura-ipfs.io/ipfs/";
  }
}
