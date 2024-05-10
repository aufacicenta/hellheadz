// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract LarsKristoHellheadz is ERC721Enumerable, ERC721Royalty, ReentrancyGuard {
  error ERC721InvalidPrice(uint256 tokenId, uint256 price);
  error ERC721InvalidPurchaseAmount(uint256 tokenId, uint256 price, uint256 balance);
  error ERC721ForbiddenMint(uint256 tokenId);

  event Purchase(
    address indexed from,
    address indexed to,
    uint256 indexed tokenId,
    uint256 price,
    uint256 royaltyAmount,
    uint256 transactionFee,
    uint256 amount
  );

  event SetTokenForSale(address indexed owner, uint256 indexed tokenId, uint256 price);

  modifier onlyAuthor() {
    if (_msgSender() != _author) {
      revert ERC721InvalidOwner(_msgSender());
    }
    _;
  }

  address private _author; // larskristo.eth
  address private _operator; // svpervnder.eth

  uint256 private _tokenLimit; // set to 666 at build time

  mapping(uint256 tokenId => uint256) private _tokenPrices;
  uint256 private _transactionFraction = 300; // 3%

  string[] private _tokenURIs;

  constructor(
    string memory name_,
    string memory symbol_,
    address author,
    address operator,
    uint256 tokenLimit
  ) ERC721(name_, symbol_) {
    _author = author;
    _operator = operator;
    _tokenLimit = tokenLimit;

    _setDefaultRoyalty(_author, 1000); // 10% royalty
  }

  function mintUntilDoomsday(string[] memory tokenURIs_) public onlyAuthor {
    for (uint i = 0; i < tokenURIs_.length; i++) {
      uint256 tokenId = totalSupply();
      uint256 nextTokenId = tokenId + 1;

      if (nextTokenId > _tokenLimit) {
        revert ERC721ForbiddenMint(nextTokenId);
      }

      _safeMint(_author, tokenId);

      string memory tokenURI_ = tokenURIs_[i];
      _tokenURIs.push(tokenURI_);

      _tokenPrices[tokenId] = 0.5 ether; // initial token price
    }
  }

  function buyToken(uint256 tokenId) public payable nonReentrant returns (uint256, uint256, uint256) {
    uint256 price = _requireTokenPriceSet(tokenId);
    uint256 balance = msg.value;

    if (balance != price) {
      revert ERC721InvalidPurchaseAmount(tokenId, price, balance);
    }

    address previousOwner = ownerOf(tokenId);
    if (previousOwner == address(0)) {
      revert ERC721InvalidOwner(previousOwner);
    }

    (address royaltyReceiver, uint256 royaltyAmount) = royaltyInfo(tokenId, price);
    uint256 transactionFee = getTransactionFee(tokenId);
    uint256 priceMinusFees = price - royaltyAmount - transactionFee;

    // pay royalties to author
    payable(royaltyReceiver).transfer(royaltyAmount);
    // charge the transaction fee
    payable(_operator).transfer(transactionFee);
    // transfer the payment to the previous owner
    payable(previousOwner).transfer(priceMinusFees);

    // transfer the token to the new owner
    _safeTransfer(previousOwner, _msgSender(), tokenId);

    // reset the token price
    _tokenPrices[tokenId] = 0;

    emit Purchase(previousOwner, _msgSender(), tokenId, price, royaltyAmount, transactionFee, priceMinusFees);

    return (tokenId, price, balance);
  }

  /**
   * @dev Retrieves the price of a token.
   * @param tokenId The ID of the token.
   * @return The price of the token.
   */
  function getTokenPrice(uint256 tokenId) public view returns (uint256) {
    _requireTokenPriceSet(tokenId);

    return _tokenPrices[tokenId];
  }

  /**
   * @dev Retrieves the transaction fee for a given token ID.
   * @param tokenId The ID of the token.
   * @return The transaction fee amount.
   */
  function getTransactionFee(uint256 tokenId) public view returns (uint256) {
    uint256 _price = _requireTokenPriceSet(tokenId);

    uint256 _transactionFee = (_price * _transactionFraction) / _feeDenominator();

    return _transactionFee;
  }

  /**
   * @dev Sets the token for sale with the specified price.
   *
   * Requirements:
   * - The caller must be the owner of the token.
   *
   * @param tokenId The ID of the token to set for sale.
   * @param price The price at which to sell the token.
   */
  function setTokenForSale(uint256 tokenId, uint256 price) public {
    address owner = ownerOf(tokenId);

    _checkAuthorized(owner, _msgSender(), tokenId);

    _tokenPrices[tokenId] = price;

    emit SetTokenForSale(owner, tokenId, price);
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

  /**
   * @dev Checks if the token price is set for a given token ID.
   * @param tokenId The ID of the token to check the price for.
   * @return The price of the token.
   * @dev Throws an error if the token price is not set.
   */
  function _requireTokenPriceSet(uint256 tokenId) internal view returns (uint256) {
    uint256 _price = _tokenPrices[tokenId];

    if (_price <= 0) {
      revert ERC721InvalidPrice(tokenId, _price);
    }

    return _price;
  }
}
