// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import {IERC721Errors} from "@openzeppelin/contracts/interfaces/draft-IERC6093.sol";
import {Context} from "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC721Market is ReentrancyGuard, IERC721Errors, Context {
  error ERC721InvalidPrice(uint256 tokenId, uint256 price);
  error ERC721InvalidPurchaseAmount(uint256 tokenId, uint256 price, uint256 balance);

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

  address private _operator; // svpervnder.eth

  mapping(uint256 tokenId => uint256) private _tokenPrices;
  uint256 private _transactionFraction = 300; // 3%

  ERC721Royalty public collection;

  constructor(address collection_, address operator) {
    collection = ERC721Royalty(collection_);
    _operator = operator;
  }

  function buyToken(uint256 tokenId) public payable nonReentrant returns (uint256, uint256, uint256) {
    uint256 price = _requireTokenPriceSet(tokenId);
    uint256 balance = msg.value;

    if (balance != price) {
      revert ERC721InvalidPurchaseAmount(tokenId, price, balance);
    }

    address previousOwner = collection.ownerOf(tokenId);
    if (previousOwner == address(0)) {
      revert ERC721InvalidOwner(previousOwner);
    }

    (address royaltyReceiver, uint256 royaltyAmount) = collection.royaltyInfo(tokenId, price);
    uint256 transactionFee = getTransactionFee(tokenId);
    uint256 priceMinusFees = price - royaltyAmount - transactionFee;

    // pay royalties to author
    payable(royaltyReceiver).transfer(royaltyAmount);
    // charge the transaction fee
    payable(_operator).transfer(transactionFee);
    // transfer the payment to the previous owner
    payable(previousOwner).transfer(priceMinusFees);

    // transfer the token to the new owner
    collection.safeTransferFrom(previousOwner, _msgSender(), tokenId);

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

    uint256 _transactionFee = (_price * _transactionFraction) / collection._feeDenominator();

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
    address owner = collection.ownerOf(tokenId);

    collection._checkAuthorized(owner, _msgSender(), tokenId);

    _tokenPrices[tokenId] = price;

    emit SetTokenForSale(owner, tokenId, price);
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
