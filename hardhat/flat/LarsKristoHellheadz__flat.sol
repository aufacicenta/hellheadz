// Sources flattened with hardhat v2.20.1 https://hardhat.org

// SPDX-License-Identifier: MIT

// File @openzeppelin/contracts/utils/introspection/IERC165.sol@v5.0.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (utils/introspection/IERC165.sol)

pragma solidity ^0.8.20;

/**
 * @dev Interface of the ERC165 standard, as defined in the
 * https://eips.ethereum.org/EIPS/eip-165[EIP].
 *
 * Implementers can declare support of contract interfaces, which can then be
 * queried by others ({ERC165Checker}).
 *
 * For an implementation, see {ERC165}.
 */
interface IERC165 {
    /**
     * @dev Returns true if this contract implements the interface defined by
     * `interfaceId`. See the corresponding
     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
     * to learn more about how these ids are created.
     *
     * This function call must use less than 30 000 gas.
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}


// File @openzeppelin/contracts/interfaces/IERC2981.sol@v5.0.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (interfaces/IERC2981.sol)

pragma solidity ^0.8.20;

/**
 * @dev Interface for the NFT Royalty Standard.
 *
 * A standardized way to retrieve royalty payment information for non-fungible tokens (NFTs) to enable universal
 * support for royalty payments across all NFT marketplaces and ecosystem participants.
 */
interface IERC2981 is IERC165 {
    /**
     * @dev Returns how much royalty is owed and to whom, based on a sale price that may be denominated in any unit of
     * exchange. The royalty amount is denominated and should be paid in that same unit of exchange.
     */
    function royaltyInfo(
        uint256 tokenId,
        uint256 salePrice
    ) external view returns (address receiver, uint256 royaltyAmount);
}


// File @openzeppelin/contracts/utils/introspection/ERC165.sol@v5.0.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (utils/introspection/ERC165.sol)

pragma solidity ^0.8.20;

/**
 * @dev Implementation of the {IERC165} interface.
 *
 * Contracts that want to implement ERC165 should inherit from this contract and override {supportsInterface} to check
 * for the additional interface id that will be supported. For example:
 *
 * ```solidity
 * function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
 *     return interfaceId == type(MyInterface).interfaceId || super.supportsInterface(interfaceId);
 * }
 * ```
 */
abstract contract ERC165 is IERC165 {
    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual returns (bool) {
        return interfaceId == type(IERC165).interfaceId;
    }
}


// File @openzeppelin/contracts/token/common/ERC2981.sol@v5.0.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/common/ERC2981.sol)

pragma solidity ^0.8.20;


/**
 * @dev Implementation of the NFT Royalty Standard, a standardized way to retrieve royalty payment information.
 *
 * Royalty information can be specified globally for all token ids via {_setDefaultRoyalty}, and/or individually for
 * specific token ids via {_setTokenRoyalty}. The latter takes precedence over the first.
 *
 * Royalty is specified as a fraction of sale price. {_feeDenominator} is overridable but defaults to 10000, meaning the
 * fee is specified in basis points by default.
 *
 * IMPORTANT: ERC-2981 only specifies a way to signal royalty information and does not enforce its payment. See
 * https://eips.ethereum.org/EIPS/eip-2981#optional-royalty-payments[Rationale] in the EIP. Marketplaces are expected to
 * voluntarily pay royalties together with sales, but note that this standard is not yet widely supported.
 */
abstract contract ERC2981 is IERC2981, ERC165 {
    struct RoyaltyInfo {
        address receiver;
        uint96 royaltyFraction;
    }

    RoyaltyInfo private _defaultRoyaltyInfo;
    mapping(uint256 tokenId => RoyaltyInfo) private _tokenRoyaltyInfo;

    /**
     * @dev The default royalty set is invalid (eg. (numerator / denominator) >= 1).
     */
    error ERC2981InvalidDefaultRoyalty(uint256 numerator, uint256 denominator);

    /**
     * @dev The default royalty receiver is invalid.
     */
    error ERC2981InvalidDefaultRoyaltyReceiver(address receiver);

    /**
     * @dev The royalty set for an specific `tokenId` is invalid (eg. (numerator / denominator) >= 1).
     */
    error ERC2981InvalidTokenRoyalty(uint256 tokenId, uint256 numerator, uint256 denominator);

    /**
     * @dev The royalty receiver for `tokenId` is invalid.
     */
    error ERC2981InvalidTokenRoyaltyReceiver(uint256 tokenId, address receiver);

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165, ERC165) returns (bool) {
        return interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
     * @inheritdoc IERC2981
     */
    function royaltyInfo(uint256 tokenId, uint256 salePrice) public view virtual returns (address, uint256) {
        RoyaltyInfo memory royalty = _tokenRoyaltyInfo[tokenId];

        if (royalty.receiver == address(0)) {
            royalty = _defaultRoyaltyInfo;
        }

        uint256 royaltyAmount = (salePrice * royalty.royaltyFraction) / _feeDenominator();

        return (royalty.receiver, royaltyAmount);
    }

    /**
     * @dev The denominator with which to interpret the fee set in {_setTokenRoyalty} and {_setDefaultRoyalty} as a
     * fraction of the sale price. Defaults to 10000 so fees are expressed in basis points, but may be customized by an
     * override.
     */
    function _feeDenominator() internal pure virtual returns (uint96) {
        return 10000;
    }

    /**
     * @dev Sets the royalty information that all ids in this contract will default to.
     *
     * Requirements:
     *
     * - `receiver` cannot be the zero address.
     * - `feeNumerator` cannot be greater than the fee denominator.
     */
    function _setDefaultRoyalty(address receiver, uint96 feeNumerator) internal virtual {
        uint256 denominator = _feeDenominator();
        if (feeNumerator > denominator) {
            // Royalty fee will exceed the sale price
            revert ERC2981InvalidDefaultRoyalty(feeNumerator, denominator);
        }
        if (receiver == address(0)) {
            revert ERC2981InvalidDefaultRoyaltyReceiver(address(0));
        }

        _defaultRoyaltyInfo = RoyaltyInfo(receiver, feeNumerator);
    }

    /**
     * @dev Removes default royalty information.
     */
    function _deleteDefaultRoyalty() internal virtual {
        delete _defaultRoyaltyInfo;
    }

    /**
     * @dev Sets the royalty information for a specific token id, overriding the global default.
     *
     * Requirements:
     *
     * - `receiver` cannot be the zero address.
     * - `feeNumerator` cannot be greater than the fee denominator.
     */
    function _setTokenRoyalty(uint256 tokenId, address receiver, uint96 feeNumerator) internal virtual {
        uint256 denominator = _feeDenominator();
        if (feeNumerator > denominator) {
            // Royalty fee will exceed the sale price
            revert ERC2981InvalidTokenRoyalty(tokenId, feeNumerator, denominator);
        }
        if (receiver == address(0)) {
            revert ERC2981InvalidTokenRoyaltyReceiver(tokenId, address(0));
        }

        _tokenRoyaltyInfo[tokenId] = RoyaltyInfo(receiver, feeNumerator);
    }

    /**
     * @dev Resets royalty information for the token id back to the global default.
     */
    function _resetTokenRoyalty(uint256 tokenId) internal virtual {
        delete _tokenRoyaltyInfo[tokenId];
    }
}


// File @openzeppelin/contracts/interfaces/draft-IERC6093.sol@v5.0.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (interfaces/draft-IERC6093.sol)
pragma solidity ^0.8.20;

/**
 * @dev Standard ERC20 Errors
 * Interface of the https://eips.ethereum.org/EIPS/eip-6093[ERC-6093] custom errors for ERC20 tokens.
 */
interface IERC20Errors {
    /**
     * @dev Indicates an error related to the current `balance` of a `sender`. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     * @param balance Current balance for the interacting account.
     * @param needed Minimum amount required to perform a transfer.
     */
    error ERC20InsufficientBalance(address sender, uint256 balance, uint256 needed);

    /**
     * @dev Indicates a failure with the token `sender`. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     */
    error ERC20InvalidSender(address sender);

    /**
     * @dev Indicates a failure with the token `receiver`. Used in transfers.
     * @param receiver Address to which tokens are being transferred.
     */
    error ERC20InvalidReceiver(address receiver);

    /**
     * @dev Indicates a failure with the `spender`’s `allowance`. Used in transfers.
     * @param spender Address that may be allowed to operate on tokens without being their owner.
     * @param allowance Amount of tokens a `spender` is allowed to operate with.
     * @param needed Minimum amount required to perform a transfer.
     */
    error ERC20InsufficientAllowance(address spender, uint256 allowance, uint256 needed);

    /**
     * @dev Indicates a failure with the `approver` of a token to be approved. Used in approvals.
     * @param approver Address initiating an approval operation.
     */
    error ERC20InvalidApprover(address approver);

    /**
     * @dev Indicates a failure with the `spender` to be approved. Used in approvals.
     * @param spender Address that may be allowed to operate on tokens without being their owner.
     */
    error ERC20InvalidSpender(address spender);
}

/**
 * @dev Standard ERC721 Errors
 * Interface of the https://eips.ethereum.org/EIPS/eip-6093[ERC-6093] custom errors for ERC721 tokens.
 */
interface IERC721Errors {
    /**
     * @dev Indicates that an address can't be an owner. For example, `address(0)` is a forbidden owner in EIP-20.
     * Used in balance queries.
     * @param owner Address of the current owner of a token.
     */
    error ERC721InvalidOwner(address owner);

    /**
     * @dev Indicates a `tokenId` whose `owner` is the zero address.
     * @param tokenId Identifier number of a token.
     */
    error ERC721NonexistentToken(uint256 tokenId);

    /**
     * @dev Indicates an error related to the ownership over a particular token. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     * @param tokenId Identifier number of a token.
     * @param owner Address of the current owner of a token.
     */
    error ERC721IncorrectOwner(address sender, uint256 tokenId, address owner);

    /**
     * @dev Indicates a failure with the token `sender`. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     */
    error ERC721InvalidSender(address sender);

    /**
     * @dev Indicates a failure with the token `receiver`. Used in transfers.
     * @param receiver Address to which tokens are being transferred.
     */
    error ERC721InvalidReceiver(address receiver);

    /**
     * @dev Indicates a failure with the `operator`’s approval. Used in transfers.
     * @param operator Address that may be allowed to operate on tokens without being their owner.
     * @param tokenId Identifier number of a token.
     */
    error ERC721InsufficientApproval(address operator, uint256 tokenId);

    /**
     * @dev Indicates a failure with the `approver` of a token to be approved. Used in approvals.
     * @param approver Address initiating an approval operation.
     */
    error ERC721InvalidApprover(address approver);

    /**
     * @dev Indicates a failure with the `operator` to be approved. Used in approvals.
     * @param operator Address that may be allowed to operate on tokens without being their owner.
     */
    error ERC721InvalidOperator(address operator);
}

/**
 * @dev Standard ERC1155 Errors
 * Interface of the https://eips.ethereum.org/EIPS/eip-6093[ERC-6093] custom errors for ERC1155 tokens.
 */
interface IERC1155Errors {
    /**
     * @dev Indicates an error related to the current `balance` of a `sender`. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     * @param balance Current balance for the interacting account.
     * @param needed Minimum amount required to perform a transfer.
     * @param tokenId Identifier number of a token.
     */
    error ERC1155InsufficientBalance(address sender, uint256 balance, uint256 needed, uint256 tokenId);

    /**
     * @dev Indicates a failure with the token `sender`. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     */
    error ERC1155InvalidSender(address sender);

    /**
     * @dev Indicates a failure with the token `receiver`. Used in transfers.
     * @param receiver Address to which tokens are being transferred.
     */
    error ERC1155InvalidReceiver(address receiver);

    /**
     * @dev Indicates a failure with the `operator`’s approval. Used in transfers.
     * @param operator Address that may be allowed to operate on tokens without being their owner.
     * @param owner Address of the current owner of a token.
     */
    error ERC1155MissingApprovalForAll(address operator, address owner);

    /**
     * @dev Indicates a failure with the `approver` of a token to be approved. Used in approvals.
     * @param approver Address initiating an approval operation.
     */
    error ERC1155InvalidApprover(address approver);

    /**
     * @dev Indicates a failure with the `operator` to be approved. Used in approvals.
     * @param operator Address that may be allowed to operate on tokens without being their owner.
     */
    error ERC1155InvalidOperator(address operator);

    /**
     * @dev Indicates an array length mismatch between ids and values in a safeBatchTransferFrom operation.
     * Used in batch transfers.
     * @param idsLength Length of the array of token identifiers
     * @param valuesLength Length of the array of token amounts
     */
    error ERC1155InvalidArrayLength(uint256 idsLength, uint256 valuesLength);
}


// File @openzeppelin/contracts/token/ERC721/IERC721.sol@v5.0.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC721/IERC721.sol)

pragma solidity ^0.8.20;

/**
 * @dev Required interface of an ERC721 compliant contract.
 */
interface IERC721 is IERC165 {
    /**
     * @dev Emitted when `tokenId` token is transferred from `from` to `to`.
     */
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    /**
     * @dev Emitted when `owner` enables `approved` to manage the `tokenId` token.
     */
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);

    /**
     * @dev Emitted when `owner` enables or disables (`approved`) `operator` to manage all of its assets.
     */
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    /**
     * @dev Returns the number of tokens in ``owner``'s account.
     */
    function balanceOf(address owner) external view returns (uint256 balance);

    /**
     * @dev Returns the owner of the `tokenId` token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function ownerOf(uint256 tokenId) external view returns (address owner);

    /**
     * @dev Safely transfers `tokenId` token from `from` to `to`.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must exist and be owned by `from`.
     * - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon
     *   a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external;

    /**
     * @dev Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients
     * are aware of the ERC721 protocol to prevent tokens from being forever locked.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must exist and be owned by `from`.
     * - If the caller is not `from`, it must have been allowed to move this token by either {approve} or
     *   {setApprovalForAll}.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon
     *   a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function safeTransferFrom(address from, address to, uint256 tokenId) external;

    /**
     * @dev Transfers `tokenId` token from `from` to `to`.
     *
     * WARNING: Note that the caller is responsible to confirm that the recipient is capable of receiving ERC721
     * or else they may be permanently lost. Usage of {safeTransferFrom} prevents loss, though the caller must
     * understand this adds an external call which potentially creates a reentrancy vulnerability.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must be owned by `from`.
     * - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 tokenId) external;

    /**
     * @dev Gives permission to `to` to transfer `tokenId` token to another account.
     * The approval is cleared when the token is transferred.
     *
     * Only a single account can be approved at a time, so approving the zero address clears previous approvals.
     *
     * Requirements:
     *
     * - The caller must own the token or be an approved operator.
     * - `tokenId` must exist.
     *
     * Emits an {Approval} event.
     */
    function approve(address to, uint256 tokenId) external;

    /**
     * @dev Approve or remove `operator` as an operator for the caller.
     * Operators can call {transferFrom} or {safeTransferFrom} for any token owned by the caller.
     *
     * Requirements:
     *
     * - The `operator` cannot be the address zero.
     *
     * Emits an {ApprovalForAll} event.
     */
    function setApprovalForAll(address operator, bool approved) external;

    /**
     * @dev Returns the account approved for `tokenId` token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function getApproved(uint256 tokenId) external view returns (address operator);

    /**
     * @dev Returns if the `operator` is allowed to manage all of the assets of `owner`.
     *
     * See {setApprovalForAll}
     */
    function isApprovedForAll(address owner, address operator) external view returns (bool);
}


// File @openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol@v5.0.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC721/extensions/IERC721Metadata.sol)

pragma solidity ^0.8.20;

/**
 * @title ERC-721 Non-Fungible Token Standard, optional metadata extension
 * @dev See https://eips.ethereum.org/EIPS/eip-721
 */
interface IERC721Metadata is IERC721 {
    /**
     * @dev Returns the token collection name.
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns the token collection symbol.
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Returns the Uniform Resource Identifier (URI) for `tokenId` token.
     */
    function tokenURI(uint256 tokenId) external view returns (string memory);
}


// File @openzeppelin/contracts/token/ERC721/IERC721Receiver.sol@v5.0.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC721/IERC721Receiver.sol)

pragma solidity ^0.8.20;

/**
 * @title ERC721 token receiver interface
 * @dev Interface for any contract that wants to support safeTransfers
 * from ERC721 asset contracts.
 */
interface IERC721Receiver {
    /**
     * @dev Whenever an {IERC721} `tokenId` token is transferred to this contract via {IERC721-safeTransferFrom}
     * by `operator` from `from`, this function is called.
     *
     * It must return its Solidity selector to confirm the token transfer.
     * If any other value is returned or the interface is not implemented by the recipient, the transfer will be
     * reverted.
     *
     * The selector can be obtained in Solidity with `IERC721Receiver.onERC721Received.selector`.
     */
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4);
}


// File @openzeppelin/contracts/utils/Context.sol@v5.0.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.1) (utils/Context.sol)

pragma solidity ^0.8.20;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }

    function _contextSuffixLength() internal view virtual returns (uint256) {
        return 0;
    }
}


// File @openzeppelin/contracts/utils/math/Math.sol@v5.0.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (utils/math/Math.sol)

pragma solidity ^0.8.20;

/**
 * @dev Standard math utilities missing in the Solidity language.
 */
library Math {
    /**
     * @dev Muldiv operation overflow.
     */
    error MathOverflowedMulDiv();

    enum Rounding {
        Floor, // Toward negative infinity
        Ceil, // Toward positive infinity
        Trunc, // Toward zero
        Expand // Away from zero
    }

    /**
     * @dev Returns the addition of two unsigned integers, with an overflow flag.
     */
    function tryAdd(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            uint256 c = a + b;
            if (c < a) return (false, 0);
            return (true, c);
        }
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, with an overflow flag.
     */
    function trySub(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b > a) return (false, 0);
            return (true, a - b);
        }
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, with an overflow flag.
     */
    function tryMul(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
            // benefit is lost if 'b' is also tested.
            // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
            if (a == 0) return (true, 0);
            uint256 c = a * b;
            if (c / a != b) return (false, 0);
            return (true, c);
        }
    }

    /**
     * @dev Returns the division of two unsigned integers, with a division by zero flag.
     */
    function tryDiv(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b == 0) return (false, 0);
            return (true, a / b);
        }
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers, with a division by zero flag.
     */
    function tryMod(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b == 0) return (false, 0);
            return (true, a % b);
        }
    }

    /**
     * @dev Returns the largest of two numbers.
     */
    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a : b;
    }

    /**
     * @dev Returns the smallest of two numbers.
     */
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    /**
     * @dev Returns the average of two numbers. The result is rounded towards
     * zero.
     */
    function average(uint256 a, uint256 b) internal pure returns (uint256) {
        // (a + b) / 2 can overflow.
        return (a & b) + (a ^ b) / 2;
    }

    /**
     * @dev Returns the ceiling of the division of two numbers.
     *
     * This differs from standard division with `/` in that it rounds towards infinity instead
     * of rounding towards zero.
     */
    function ceilDiv(uint256 a, uint256 b) internal pure returns (uint256) {
        if (b == 0) {
            // Guarantee the same behavior as in a regular Solidity division.
            return a / b;
        }

        // (a + b - 1) / b can overflow on addition, so we distribute.
        return a == 0 ? 0 : (a - 1) / b + 1;
    }

    /**
     * @notice Calculates floor(x * y / denominator) with full precision. Throws if result overflows a uint256 or
     * denominator == 0.
     * @dev Original credit to Remco Bloemen under MIT license (https://xn--2-umb.com/21/muldiv) with further edits by
     * Uniswap Labs also under MIT license.
     */
    function mulDiv(uint256 x, uint256 y, uint256 denominator) internal pure returns (uint256 result) {
        unchecked {
            // 512-bit multiply [prod1 prod0] = x * y. Compute the product mod 2^256 and mod 2^256 - 1, then use
            // use the Chinese Remainder Theorem to reconstruct the 512 bit result. The result is stored in two 256
            // variables such that product = prod1 * 2^256 + prod0.
            uint256 prod0 = x * y; // Least significant 256 bits of the product
            uint256 prod1; // Most significant 256 bits of the product
            assembly {
                let mm := mulmod(x, y, not(0))
                prod1 := sub(sub(mm, prod0), lt(mm, prod0))
            }

            // Handle non-overflow cases, 256 by 256 division.
            if (prod1 == 0) {
                // Solidity will revert if denominator == 0, unlike the div opcode on its own.
                // The surrounding unchecked block does not change this fact.
                // See https://docs.soliditylang.org/en/latest/control-structures.html#checked-or-unchecked-arithmetic.
                return prod0 / denominator;
            }

            // Make sure the result is less than 2^256. Also prevents denominator == 0.
            if (denominator <= prod1) {
                revert MathOverflowedMulDiv();
            }

            ///////////////////////////////////////////////
            // 512 by 256 division.
            ///////////////////////////////////////////////

            // Make division exact by subtracting the remainder from [prod1 prod0].
            uint256 remainder;
            assembly {
                // Compute remainder using mulmod.
                remainder := mulmod(x, y, denominator)

                // Subtract 256 bit number from 512 bit number.
                prod1 := sub(prod1, gt(remainder, prod0))
                prod0 := sub(prod0, remainder)
            }

            // Factor powers of two out of denominator and compute largest power of two divisor of denominator.
            // Always >= 1. See https://cs.stackexchange.com/q/138556/92363.

            uint256 twos = denominator & (0 - denominator);
            assembly {
                // Divide denominator by twos.
                denominator := div(denominator, twos)

                // Divide [prod1 prod0] by twos.
                prod0 := div(prod0, twos)

                // Flip twos such that it is 2^256 / twos. If twos is zero, then it becomes one.
                twos := add(div(sub(0, twos), twos), 1)
            }

            // Shift in bits from prod1 into prod0.
            prod0 |= prod1 * twos;

            // Invert denominator mod 2^256. Now that denominator is an odd number, it has an inverse modulo 2^256 such
            // that denominator * inv = 1 mod 2^256. Compute the inverse by starting with a seed that is correct for
            // four bits. That is, denominator * inv = 1 mod 2^4.
            uint256 inverse = (3 * denominator) ^ 2;

            // Use the Newton-Raphson iteration to improve the precision. Thanks to Hensel's lifting lemma, this also
            // works in modular arithmetic, doubling the correct bits in each step.
            inverse *= 2 - denominator * inverse; // inverse mod 2^8
            inverse *= 2 - denominator * inverse; // inverse mod 2^16
            inverse *= 2 - denominator * inverse; // inverse mod 2^32
            inverse *= 2 - denominator * inverse; // inverse mod 2^64
            inverse *= 2 - denominator * inverse; // inverse mod 2^128
            inverse *= 2 - denominator * inverse; // inverse mod 2^256

            // Because the division is now exact we can divide by multiplying with the modular inverse of denominator.
            // This will give us the correct result modulo 2^256. Since the preconditions guarantee that the outcome is
            // less than 2^256, this is the final result. We don't need to compute the high bits of the result and prod1
            // is no longer required.
            result = prod0 * inverse;
            return result;
        }
    }

    /**
     * @notice Calculates x * y / denominator with full precision, following the selected rounding direction.
     */
    function mulDiv(uint256 x, uint256 y, uint256 denominator, Rounding rounding) internal pure returns (uint256) {
        uint256 result = mulDiv(x, y, denominator);
        if (unsignedRoundsUp(rounding) && mulmod(x, y, denominator) > 0) {
            result += 1;
        }
        return result;
    }

    /**
     * @dev Returns the square root of a number. If the number is not a perfect square, the value is rounded
     * towards zero.
     *
     * Inspired by Henry S. Warren, Jr.'s "Hacker's Delight" (Chapter 11).
     */
    function sqrt(uint256 a) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }

        // For our first guess, we get the biggest power of 2 which is smaller than the square root of the target.
        //
        // We know that the "msb" (most significant bit) of our target number `a` is a power of 2 such that we have
        // `msb(a) <= a < 2*msb(a)`. This value can be written `msb(a)=2**k` with `k=log2(a)`.
        //
        // This can be rewritten `2**log2(a) <= a < 2**(log2(a) + 1)`
        // → `sqrt(2**k) <= sqrt(a) < sqrt(2**(k+1))`
        // → `2**(k/2) <= sqrt(a) < 2**((k+1)/2) <= 2**(k/2 + 1)`
        //
        // Consequently, `2**(log2(a) / 2)` is a good first approximation of `sqrt(a)` with at least 1 correct bit.
        uint256 result = 1 << (log2(a) >> 1);

        // At this point `result` is an estimation with one bit of precision. We know the true value is a uint128,
        // since it is the square root of a uint256. Newton's method converges quadratically (precision doubles at
        // every iteration). We thus need at most 7 iteration to turn our partial result with one bit of precision
        // into the expected uint128 result.
        unchecked {
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            return min(result, a / result);
        }
    }

    /**
     * @notice Calculates sqrt(a), following the selected rounding direction.
     */
    function sqrt(uint256 a, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = sqrt(a);
            return result + (unsignedRoundsUp(rounding) && result * result < a ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 2 of a positive value rounded towards zero.
     * Returns 0 if given 0.
     */
    function log2(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >> 128 > 0) {
                value >>= 128;
                result += 128;
            }
            if (value >> 64 > 0) {
                value >>= 64;
                result += 64;
            }
            if (value >> 32 > 0) {
                value >>= 32;
                result += 32;
            }
            if (value >> 16 > 0) {
                value >>= 16;
                result += 16;
            }
            if (value >> 8 > 0) {
                value >>= 8;
                result += 8;
            }
            if (value >> 4 > 0) {
                value >>= 4;
                result += 4;
            }
            if (value >> 2 > 0) {
                value >>= 2;
                result += 2;
            }
            if (value >> 1 > 0) {
                result += 1;
            }
        }
        return result;
    }

    /**
     * @dev Return the log in base 2, following the selected rounding direction, of a positive value.
     * Returns 0 if given 0.
     */
    function log2(uint256 value, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = log2(value);
            return result + (unsignedRoundsUp(rounding) && 1 << result < value ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 10 of a positive value rounded towards zero.
     * Returns 0 if given 0.
     */
    function log10(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >= 10 ** 64) {
                value /= 10 ** 64;
                result += 64;
            }
            if (value >= 10 ** 32) {
                value /= 10 ** 32;
                result += 32;
            }
            if (value >= 10 ** 16) {
                value /= 10 ** 16;
                result += 16;
            }
            if (value >= 10 ** 8) {
                value /= 10 ** 8;
                result += 8;
            }
            if (value >= 10 ** 4) {
                value /= 10 ** 4;
                result += 4;
            }
            if (value >= 10 ** 2) {
                value /= 10 ** 2;
                result += 2;
            }
            if (value >= 10 ** 1) {
                result += 1;
            }
        }
        return result;
    }

    /**
     * @dev Return the log in base 10, following the selected rounding direction, of a positive value.
     * Returns 0 if given 0.
     */
    function log10(uint256 value, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = log10(value);
            return result + (unsignedRoundsUp(rounding) && 10 ** result < value ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 256 of a positive value rounded towards zero.
     * Returns 0 if given 0.
     *
     * Adding one to the result gives the number of pairs of hex symbols needed to represent `value` as a hex string.
     */
    function log256(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >> 128 > 0) {
                value >>= 128;
                result += 16;
            }
            if (value >> 64 > 0) {
                value >>= 64;
                result += 8;
            }
            if (value >> 32 > 0) {
                value >>= 32;
                result += 4;
            }
            if (value >> 16 > 0) {
                value >>= 16;
                result += 2;
            }
            if (value >> 8 > 0) {
                result += 1;
            }
        }
        return result;
    }

    /**
     * @dev Return the log in base 256, following the selected rounding direction, of a positive value.
     * Returns 0 if given 0.
     */
    function log256(uint256 value, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = log256(value);
            return result + (unsignedRoundsUp(rounding) && 1 << (result << 3) < value ? 1 : 0);
        }
    }

    /**
     * @dev Returns whether a provided rounding mode is considered rounding up for unsigned integers.
     */
    function unsignedRoundsUp(Rounding rounding) internal pure returns (bool) {
        return uint8(rounding) % 2 == 1;
    }
}


// File @openzeppelin/contracts/utils/math/SignedMath.sol@v5.0.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (utils/math/SignedMath.sol)

pragma solidity ^0.8.20;

/**
 * @dev Standard signed math utilities missing in the Solidity language.
 */
library SignedMath {
    /**
     * @dev Returns the largest of two signed numbers.
     */
    function max(int256 a, int256 b) internal pure returns (int256) {
        return a > b ? a : b;
    }

    /**
     * @dev Returns the smallest of two signed numbers.
     */
    function min(int256 a, int256 b) internal pure returns (int256) {
        return a < b ? a : b;
    }

    /**
     * @dev Returns the average of two signed numbers without overflow.
     * The result is rounded towards zero.
     */
    function average(int256 a, int256 b) internal pure returns (int256) {
        // Formula from the book "Hacker's Delight"
        int256 x = (a & b) + ((a ^ b) >> 1);
        return x + (int256(uint256(x) >> 255) & (a ^ b));
    }

    /**
     * @dev Returns the absolute unsigned value of a signed value.
     */
    function abs(int256 n) internal pure returns (uint256) {
        unchecked {
            // must be unchecked in order to support `n = type(int256).min`
            return uint256(n >= 0 ? n : -n);
        }
    }
}


// File @openzeppelin/contracts/utils/Strings.sol@v5.0.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (utils/Strings.sol)

pragma solidity ^0.8.20;


/**
 * @dev String operations.
 */
library Strings {
    bytes16 private constant HEX_DIGITS = "0123456789abcdef";
    uint8 private constant ADDRESS_LENGTH = 20;

    /**
     * @dev The `value` string doesn't fit in the specified `length`.
     */
    error StringsInsufficientHexLength(uint256 value, uint256 length);

    /**
     * @dev Converts a `uint256` to its ASCII `string` decimal representation.
     */
    function toString(uint256 value) internal pure returns (string memory) {
        unchecked {
            uint256 length = Math.log10(value) + 1;
            string memory buffer = new string(length);
            uint256 ptr;
            /// @solidity memory-safe-assembly
            assembly {
                ptr := add(buffer, add(32, length))
            }
            while (true) {
                ptr--;
                /// @solidity memory-safe-assembly
                assembly {
                    mstore8(ptr, byte(mod(value, 10), HEX_DIGITS))
                }
                value /= 10;
                if (value == 0) break;
            }
            return buffer;
        }
    }

    /**
     * @dev Converts a `int256` to its ASCII `string` decimal representation.
     */
    function toStringSigned(int256 value) internal pure returns (string memory) {
        return string.concat(value < 0 ? "-" : "", toString(SignedMath.abs(value)));
    }

    /**
     * @dev Converts a `uint256` to its ASCII `string` hexadecimal representation.
     */
    function toHexString(uint256 value) internal pure returns (string memory) {
        unchecked {
            return toHexString(value, Math.log256(value) + 1);
        }
    }

    /**
     * @dev Converts a `uint256` to its ASCII `string` hexadecimal representation with fixed length.
     */
    function toHexString(uint256 value, uint256 length) internal pure returns (string memory) {
        uint256 localValue = value;
        bytes memory buffer = new bytes(2 * length + 2);
        buffer[0] = "0";
        buffer[1] = "x";
        for (uint256 i = 2 * length + 1; i > 1; --i) {
            buffer[i] = HEX_DIGITS[localValue & 0xf];
            localValue >>= 4;
        }
        if (localValue != 0) {
            revert StringsInsufficientHexLength(value, length);
        }
        return string(buffer);
    }

    /**
     * @dev Converts an `address` with fixed length of 20 bytes to its not checksummed ASCII `string` hexadecimal
     * representation.
     */
    function toHexString(address addr) internal pure returns (string memory) {
        return toHexString(uint256(uint160(addr)), ADDRESS_LENGTH);
    }

    /**
     * @dev Returns true if the two strings are equal.
     */
    function equal(string memory a, string memory b) internal pure returns (bool) {
        return bytes(a).length == bytes(b).length && keccak256(bytes(a)) == keccak256(bytes(b));
    }
}


// File @openzeppelin/contracts/token/ERC721/ERC721.sol@v5.0.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC721/ERC721.sol)

pragma solidity ^0.8.20;







/**
 * @dev Implementation of https://eips.ethereum.org/EIPS/eip-721[ERC721] Non-Fungible Token Standard, including
 * the Metadata extension, but not including the Enumerable extension, which is available separately as
 * {ERC721Enumerable}.
 */
abstract contract ERC721 is Context, ERC165, IERC721, IERC721Metadata, IERC721Errors {
    using Strings for uint256;

    // Token name
    string private _name;

    // Token symbol
    string private _symbol;

    mapping(uint256 tokenId => address) private _owners;

    mapping(address owner => uint256) private _balances;

    mapping(uint256 tokenId => address) private _tokenApprovals;

    mapping(address owner => mapping(address operator => bool)) private _operatorApprovals;

    /**
     * @dev Initializes the contract by setting a `name` and a `symbol` to the token collection.
     */
    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return
            interfaceId == type(IERC721).interfaceId ||
            interfaceId == type(IERC721Metadata).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /**
     * @dev See {IERC721-balanceOf}.
     */
    function balanceOf(address owner) public view virtual returns (uint256) {
        if (owner == address(0)) {
            revert ERC721InvalidOwner(address(0));
        }
        return _balances[owner];
    }

    /**
     * @dev See {IERC721-ownerOf}.
     */
    function ownerOf(uint256 tokenId) public view virtual returns (address) {
        return _requireOwned(tokenId);
    }

    /**
     * @dev See {IERC721Metadata-name}.
     */
    function name() public view virtual returns (string memory) {
        return _name;
    }

    /**
     * @dev See {IERC721Metadata-symbol}.
     */
    function symbol() public view virtual returns (string memory) {
        return _symbol;
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view virtual returns (string memory) {
        _requireOwned(tokenId);

        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string.concat(baseURI, tokenId.toString()) : "";
    }

    /**
     * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`. Empty
     * by default, can be overridden in child contracts.
     */
    function _baseURI() internal view virtual returns (string memory) {
        return "";
    }

    /**
     * @dev See {IERC721-approve}.
     */
    function approve(address to, uint256 tokenId) public virtual {
        _approve(to, tokenId, _msgSender());
    }

    /**
     * @dev See {IERC721-getApproved}.
     */
    function getApproved(uint256 tokenId) public view virtual returns (address) {
        _requireOwned(tokenId);

        return _getApproved(tokenId);
    }

    /**
     * @dev See {IERC721-setApprovalForAll}.
     */
    function setApprovalForAll(address operator, bool approved) public virtual {
        _setApprovalForAll(_msgSender(), operator, approved);
    }

    /**
     * @dev See {IERC721-isApprovedForAll}.
     */
    function isApprovedForAll(address owner, address operator) public view virtual returns (bool) {
        return _operatorApprovals[owner][operator];
    }

    /**
     * @dev See {IERC721-transferFrom}.
     */
    function transferFrom(address from, address to, uint256 tokenId) public virtual {
        if (to == address(0)) {
            revert ERC721InvalidReceiver(address(0));
        }
        // Setting an "auth" arguments enables the `_isAuthorized` check which verifies that the token exists
        // (from != 0). Therefore, it is not needed to verify that the return value is not 0 here.
        address previousOwner = _update(to, tokenId, _msgSender());
        if (previousOwner != from) {
            revert ERC721IncorrectOwner(from, tokenId, previousOwner);
        }
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(address from, address to, uint256 tokenId) public {
        safeTransferFrom(from, to, tokenId, "");
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public virtual {
        transferFrom(from, to, tokenId);
        _checkOnERC721Received(from, to, tokenId, data);
    }

    /**
     * @dev Returns the owner of the `tokenId`. Does NOT revert if token doesn't exist
     *
     * IMPORTANT: Any overrides to this function that add ownership of tokens not tracked by the
     * core ERC721 logic MUST be matched with the use of {_increaseBalance} to keep balances
     * consistent with ownership. The invariant to preserve is that for any address `a` the value returned by
     * `balanceOf(a)` must be equal to the number of tokens such that `_ownerOf(tokenId)` is `a`.
     */
    function _ownerOf(uint256 tokenId) internal view virtual returns (address) {
        return _owners[tokenId];
    }

    /**
     * @dev Returns the approved address for `tokenId`. Returns 0 if `tokenId` is not minted.
     */
    function _getApproved(uint256 tokenId) internal view virtual returns (address) {
        return _tokenApprovals[tokenId];
    }

    /**
     * @dev Returns whether `spender` is allowed to manage `owner`'s tokens, or `tokenId` in
     * particular (ignoring whether it is owned by `owner`).
     *
     * WARNING: This function assumes that `owner` is the actual owner of `tokenId` and does not verify this
     * assumption.
     */
    function _isAuthorized(address owner, address spender, uint256 tokenId) internal view virtual returns (bool) {
        return
            spender != address(0) &&
            (owner == spender || isApprovedForAll(owner, spender) || _getApproved(tokenId) == spender);
    }

    /**
     * @dev Checks if `spender` can operate on `tokenId`, assuming the provided `owner` is the actual owner.
     * Reverts if `spender` does not have approval from the provided `owner` for the given token or for all its assets
     * the `spender` for the specific `tokenId`.
     *
     * WARNING: This function assumes that `owner` is the actual owner of `tokenId` and does not verify this
     * assumption.
     */
    function _checkAuthorized(address owner, address spender, uint256 tokenId) internal view virtual {
        if (!_isAuthorized(owner, spender, tokenId)) {
            if (owner == address(0)) {
                revert ERC721NonexistentToken(tokenId);
            } else {
                revert ERC721InsufficientApproval(spender, tokenId);
            }
        }
    }

    /**
     * @dev Unsafe write access to the balances, used by extensions that "mint" tokens using an {ownerOf} override.
     *
     * NOTE: the value is limited to type(uint128).max. This protect against _balance overflow. It is unrealistic that
     * a uint256 would ever overflow from increments when these increments are bounded to uint128 values.
     *
     * WARNING: Increasing an account's balance using this function tends to be paired with an override of the
     * {_ownerOf} function to resolve the ownership of the corresponding tokens so that balances and ownership
     * remain consistent with one another.
     */
    function _increaseBalance(address account, uint128 value) internal virtual {
        unchecked {
            _balances[account] += value;
        }
    }

    /**
     * @dev Transfers `tokenId` from its current owner to `to`, or alternatively mints (or burns) if the current owner
     * (or `to`) is the zero address. Returns the owner of the `tokenId` before the update.
     *
     * The `auth` argument is optional. If the value passed is non 0, then this function will check that
     * `auth` is either the owner of the token, or approved to operate on the token (by the owner).
     *
     * Emits a {Transfer} event.
     *
     * NOTE: If overriding this function in a way that tracks balances, see also {_increaseBalance}.
     */
    function _update(address to, uint256 tokenId, address auth) internal virtual returns (address) {
        address from = _ownerOf(tokenId);

        // Perform (optional) operator check
        if (auth != address(0)) {
            _checkAuthorized(from, auth, tokenId);
        }

        // Execute the update
        if (from != address(0)) {
            // Clear approval. No need to re-authorize or emit the Approval event
            _approve(address(0), tokenId, address(0), false);

            unchecked {
                _balances[from] -= 1;
            }
        }

        if (to != address(0)) {
            unchecked {
                _balances[to] += 1;
            }
        }

        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);

        return from;
    }

    /**
     * @dev Mints `tokenId` and transfers it to `to`.
     *
     * WARNING: Usage of this method is discouraged, use {_safeMint} whenever possible
     *
     * Requirements:
     *
     * - `tokenId` must not exist.
     * - `to` cannot be the zero address.
     *
     * Emits a {Transfer} event.
     */
    function _mint(address to, uint256 tokenId) internal {
        if (to == address(0)) {
            revert ERC721InvalidReceiver(address(0));
        }
        address previousOwner = _update(to, tokenId, address(0));
        if (previousOwner != address(0)) {
            revert ERC721InvalidSender(address(0));
        }
    }

    /**
     * @dev Mints `tokenId`, transfers it to `to` and checks for `to` acceptance.
     *
     * Requirements:
     *
     * - `tokenId` must not exist.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function _safeMint(address to, uint256 tokenId) internal {
        _safeMint(to, tokenId, "");
    }

    /**
     * @dev Same as {xref-ERC721-_safeMint-address-uint256-}[`_safeMint`], with an additional `data` parameter which is
     * forwarded in {IERC721Receiver-onERC721Received} to contract recipients.
     */
    function _safeMint(address to, uint256 tokenId, bytes memory data) internal virtual {
        _mint(to, tokenId);
        _checkOnERC721Received(address(0), to, tokenId, data);
    }

    /**
     * @dev Destroys `tokenId`.
     * The approval is cleared when the token is burned.
     * This is an internal function that does not check if the sender is authorized to operate on the token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     *
     * Emits a {Transfer} event.
     */
    function _burn(uint256 tokenId) internal {
        address previousOwner = _update(address(0), tokenId, address(0));
        if (previousOwner == address(0)) {
            revert ERC721NonexistentToken(tokenId);
        }
    }

    /**
     * @dev Transfers `tokenId` from `from` to `to`.
     *  As opposed to {transferFrom}, this imposes no restrictions on msg.sender.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - `tokenId` token must be owned by `from`.
     *
     * Emits a {Transfer} event.
     */
    function _transfer(address from, address to, uint256 tokenId) internal {
        if (to == address(0)) {
            revert ERC721InvalidReceiver(address(0));
        }
        address previousOwner = _update(to, tokenId, address(0));
        if (previousOwner == address(0)) {
            revert ERC721NonexistentToken(tokenId);
        } else if (previousOwner != from) {
            revert ERC721IncorrectOwner(from, tokenId, previousOwner);
        }
    }

    /**
     * @dev Safely transfers `tokenId` token from `from` to `to`, checking that contract recipients
     * are aware of the ERC721 standard to prevent tokens from being forever locked.
     *
     * `data` is additional data, it has no specified format and it is sent in call to `to`.
     *
     * This internal function is like {safeTransferFrom} in the sense that it invokes
     * {IERC721Receiver-onERC721Received} on the receiver, and can be used to e.g.
     * implement alternative mechanisms to perform token transfer, such as signature-based.
     *
     * Requirements:
     *
     * - `tokenId` token must exist and be owned by `from`.
     * - `to` cannot be the zero address.
     * - `from` cannot be the zero address.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function _safeTransfer(address from, address to, uint256 tokenId) internal {
        _safeTransfer(from, to, tokenId, "");
    }

    /**
     * @dev Same as {xref-ERC721-_safeTransfer-address-address-uint256-}[`_safeTransfer`], with an additional `data` parameter which is
     * forwarded in {IERC721Receiver-onERC721Received} to contract recipients.
     */
    function _safeTransfer(address from, address to, uint256 tokenId, bytes memory data) internal virtual {
        _transfer(from, to, tokenId);
        _checkOnERC721Received(from, to, tokenId, data);
    }

    /**
     * @dev Approve `to` to operate on `tokenId`
     *
     * The `auth` argument is optional. If the value passed is non 0, then this function will check that `auth` is
     * either the owner of the token, or approved to operate on all tokens held by this owner.
     *
     * Emits an {Approval} event.
     *
     * Overrides to this logic should be done to the variant with an additional `bool emitEvent` argument.
     */
    function _approve(address to, uint256 tokenId, address auth) internal {
        _approve(to, tokenId, auth, true);
    }

    /**
     * @dev Variant of `_approve` with an optional flag to enable or disable the {Approval} event. The event is not
     * emitted in the context of transfers.
     */
    function _approve(address to, uint256 tokenId, address auth, bool emitEvent) internal virtual {
        // Avoid reading the owner unless necessary
        if (emitEvent || auth != address(0)) {
            address owner = _requireOwned(tokenId);

            // We do not use _isAuthorized because single-token approvals should not be able to call approve
            if (auth != address(0) && owner != auth && !isApprovedForAll(owner, auth)) {
                revert ERC721InvalidApprover(auth);
            }

            if (emitEvent) {
                emit Approval(owner, to, tokenId);
            }
        }

        _tokenApprovals[tokenId] = to;
    }

    /**
     * @dev Approve `operator` to operate on all of `owner` tokens
     *
     * Requirements:
     * - operator can't be the address zero.
     *
     * Emits an {ApprovalForAll} event.
     */
    function _setApprovalForAll(address owner, address operator, bool approved) internal virtual {
        if (operator == address(0)) {
            revert ERC721InvalidOperator(operator);
        }
        _operatorApprovals[owner][operator] = approved;
        emit ApprovalForAll(owner, operator, approved);
    }

    /**
     * @dev Reverts if the `tokenId` doesn't have a current owner (it hasn't been minted, or it has been burned).
     * Returns the owner.
     *
     * Overrides to ownership logic should be done to {_ownerOf}.
     */
    function _requireOwned(uint256 tokenId) internal view returns (address) {
        address owner = _ownerOf(tokenId);
        if (owner == address(0)) {
            revert ERC721NonexistentToken(tokenId);
        }
        return owner;
    }

    /**
     * @dev Private function to invoke {IERC721Receiver-onERC721Received} on a target address. This will revert if the
     * recipient doesn't accept the token transfer. The call is not executed if the target address is not a contract.
     *
     * @param from address representing the previous owner of the given token ID
     * @param to target address that will receive the tokens
     * @param tokenId uint256 ID of the token to be transferred
     * @param data bytes optional data to send along with the call
     */
    function _checkOnERC721Received(address from, address to, uint256 tokenId, bytes memory data) private {
        if (to.code.length > 0) {
            try IERC721Receiver(to).onERC721Received(_msgSender(), from, tokenId, data) returns (bytes4 retval) {
                if (retval != IERC721Receiver.onERC721Received.selector) {
                    revert ERC721InvalidReceiver(to);
                }
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    revert ERC721InvalidReceiver(to);
                } else {
                    /// @solidity memory-safe-assembly
                    assembly {
                        revert(add(32, reason), mload(reason))
                    }
                }
            }
        }
    }
}


// File @openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol@v5.0.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC721/extensions/IERC721Enumerable.sol)

pragma solidity ^0.8.20;

/**
 * @title ERC-721 Non-Fungible Token Standard, optional enumeration extension
 * @dev See https://eips.ethereum.org/EIPS/eip-721
 */
interface IERC721Enumerable is IERC721 {
    /**
     * @dev Returns the total amount of tokens stored by the contract.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns a token ID owned by `owner` at a given `index` of its token list.
     * Use along with {balanceOf} to enumerate all of ``owner``'s tokens.
     */
    function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256);

    /**
     * @dev Returns a token ID at a given `index` of all the tokens stored by the contract.
     * Use along with {totalSupply} to enumerate all tokens.
     */
    function tokenByIndex(uint256 index) external view returns (uint256);
}


// File @openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol@v5.0.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC721/extensions/ERC721Enumerable.sol)

pragma solidity ^0.8.20;



/**
 * @dev This implements an optional extension of {ERC721} defined in the EIP that adds enumerability
 * of all the token ids in the contract as well as all token ids owned by each account.
 *
 * CAUTION: `ERC721` extensions that implement custom `balanceOf` logic, such as `ERC721Consecutive`,
 * interfere with enumerability and should not be used together with `ERC721Enumerable`.
 */
abstract contract ERC721Enumerable is ERC721, IERC721Enumerable {
    mapping(address owner => mapping(uint256 index => uint256)) private _ownedTokens;
    mapping(uint256 tokenId => uint256) private _ownedTokensIndex;

    uint256[] private _allTokens;
    mapping(uint256 tokenId => uint256) private _allTokensIndex;

    /**
     * @dev An `owner`'s token query was out of bounds for `index`.
     *
     * NOTE: The owner being `address(0)` indicates a global out of bounds index.
     */
    error ERC721OutOfBoundsIndex(address owner, uint256 index);

    /**
     * @dev Batch mint is not allowed.
     */
    error ERC721EnumerableForbiddenBatchMint();

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165, ERC721) returns (bool) {
        return interfaceId == type(IERC721Enumerable).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
     * @dev See {IERC721Enumerable-tokenOfOwnerByIndex}.
     */
    function tokenOfOwnerByIndex(address owner, uint256 index) public view virtual returns (uint256) {
        if (index >= balanceOf(owner)) {
            revert ERC721OutOfBoundsIndex(owner, index);
        }
        return _ownedTokens[owner][index];
    }

    /**
     * @dev See {IERC721Enumerable-totalSupply}.
     */
    function totalSupply() public view virtual returns (uint256) {
        return _allTokens.length;
    }

    /**
     * @dev See {IERC721Enumerable-tokenByIndex}.
     */
    function tokenByIndex(uint256 index) public view virtual returns (uint256) {
        if (index >= totalSupply()) {
            revert ERC721OutOfBoundsIndex(address(0), index);
        }
        return _allTokens[index];
    }

    /**
     * @dev See {ERC721-_update}.
     */
    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        address previousOwner = super._update(to, tokenId, auth);

        if (previousOwner == address(0)) {
            _addTokenToAllTokensEnumeration(tokenId);
        } else if (previousOwner != to) {
            _removeTokenFromOwnerEnumeration(previousOwner, tokenId);
        }
        if (to == address(0)) {
            _removeTokenFromAllTokensEnumeration(tokenId);
        } else if (previousOwner != to) {
            _addTokenToOwnerEnumeration(to, tokenId);
        }

        return previousOwner;
    }

    /**
     * @dev Private function to add a token to this extension's ownership-tracking data structures.
     * @param to address representing the new owner of the given token ID
     * @param tokenId uint256 ID of the token to be added to the tokens list of the given address
     */
    function _addTokenToOwnerEnumeration(address to, uint256 tokenId) private {
        uint256 length = balanceOf(to) - 1;
        _ownedTokens[to][length] = tokenId;
        _ownedTokensIndex[tokenId] = length;
    }

    /**
     * @dev Private function to add a token to this extension's token tracking data structures.
     * @param tokenId uint256 ID of the token to be added to the tokens list
     */
    function _addTokenToAllTokensEnumeration(uint256 tokenId) private {
        _allTokensIndex[tokenId] = _allTokens.length;
        _allTokens.push(tokenId);
    }

    /**
     * @dev Private function to remove a token from this extension's ownership-tracking data structures. Note that
     * while the token is not assigned a new owner, the `_ownedTokensIndex` mapping is _not_ updated: this allows for
     * gas optimizations e.g. when performing a transfer operation (avoiding double writes).
     * This has O(1) time complexity, but alters the order of the _ownedTokens array.
     * @param from address representing the previous owner of the given token ID
     * @param tokenId uint256 ID of the token to be removed from the tokens list of the given address
     */
    function _removeTokenFromOwnerEnumeration(address from, uint256 tokenId) private {
        // To prevent a gap in from's tokens array, we store the last token in the index of the token to delete, and
        // then delete the last slot (swap and pop).

        uint256 lastTokenIndex = balanceOf(from);
        uint256 tokenIndex = _ownedTokensIndex[tokenId];

        // When the token to delete is the last token, the swap operation is unnecessary
        if (tokenIndex != lastTokenIndex) {
            uint256 lastTokenId = _ownedTokens[from][lastTokenIndex];

            _ownedTokens[from][tokenIndex] = lastTokenId; // Move the last token to the slot of the to-delete token
            _ownedTokensIndex[lastTokenId] = tokenIndex; // Update the moved token's index
        }

        // This also deletes the contents at the last position of the array
        delete _ownedTokensIndex[tokenId];
        delete _ownedTokens[from][lastTokenIndex];
    }

    /**
     * @dev Private function to remove a token from this extension's token tracking data structures.
     * This has O(1) time complexity, but alters the order of the _allTokens array.
     * @param tokenId uint256 ID of the token to be removed from the tokens list
     */
    function _removeTokenFromAllTokensEnumeration(uint256 tokenId) private {
        // To prevent a gap in the tokens array, we store the last token in the index of the token to delete, and
        // then delete the last slot (swap and pop).

        uint256 lastTokenIndex = _allTokens.length - 1;
        uint256 tokenIndex = _allTokensIndex[tokenId];

        // When the token to delete is the last token, the swap operation is unnecessary. However, since this occurs so
        // rarely (when the last minted token is burnt) that we still do the swap here to avoid the gas cost of adding
        // an 'if' statement (like in _removeTokenFromOwnerEnumeration)
        uint256 lastTokenId = _allTokens[lastTokenIndex];

        _allTokens[tokenIndex] = lastTokenId; // Move the last token to the slot of the to-delete token
        _allTokensIndex[lastTokenId] = tokenIndex; // Update the moved token's index

        // This also deletes the contents at the last position of the array
        delete _allTokensIndex[tokenId];
        _allTokens.pop();
    }

    /**
     * See {ERC721-_increaseBalance}. We need that to account tokens that were minted in batch
     */
    function _increaseBalance(address account, uint128 amount) internal virtual override {
        if (amount > 0) {
            revert ERC721EnumerableForbiddenBatchMint();
        }
        super._increaseBalance(account, amount);
    }
}


// File @openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol@v5.0.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC721/extensions/ERC721Royalty.sol)

pragma solidity ^0.8.20;


/**
 * @dev Extension of ERC721 with the ERC2981 NFT Royalty Standard, a standardized way to retrieve royalty payment
 * information.
 *
 * Royalty information can be specified globally for all token ids via {ERC2981-_setDefaultRoyalty}, and/or individually
 * for specific token ids via {ERC2981-_setTokenRoyalty}. The latter takes precedence over the first.
 *
 * IMPORTANT: ERC-2981 only specifies a way to signal royalty information and does not enforce its payment. See
 * https://eips.ethereum.org/EIPS/eip-2981#optional-royalty-payments[Rationale] in the EIP. Marketplaces are expected to
 * voluntarily pay royalties together with sales, but note that this standard is not yet widely supported.
 */
abstract contract ERC721Royalty is ERC2981, ERC721 {
    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}


// File @openzeppelin/contracts/utils/ReentrancyGuard.sol@v5.0.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (utils/ReentrancyGuard.sol)

pragma solidity ^0.8.20;

/**
 * @dev Contract module that helps prevent reentrant calls to a function.
 *
 * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
 * available, which can be applied to functions to make sure there are no nested
 * (reentrant) calls to them.
 *
 * Note that because there is a single `nonReentrant` guard, functions marked as
 * `nonReentrant` may not call one another. This can be worked around by making
 * those functions `private`, and then adding `external` `nonReentrant` entry
 * points to them.
 *
 * TIP: If you would like to learn more about reentrancy and alternative ways
 * to protect against it, check out our blog post
 * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
 */
abstract contract ReentrancyGuard {
    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant NOT_ENTERED = 1;
    uint256 private constant ENTERED = 2;

    uint256 private _status;

    /**
     * @dev Unauthorized reentrant call.
     */
    error ReentrancyGuardReentrantCall();

    constructor() {
        _status = NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and making it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        _nonReentrantBefore();
        _;
        _nonReentrantAfter();
    }

    function _nonReentrantBefore() private {
        // On the first call to nonReentrant, _status will be NOT_ENTERED
        if (_status == ENTERED) {
            revert ReentrancyGuardReentrantCall();
        }

        // Any calls to nonReentrant after this point will fail
        _status = ENTERED;
    }

    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _status = NOT_ENTERED;
    }

    /**
     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
     * `nonReentrant` function in the call stack.
     */
    function _reentrancyGuardEntered() internal view returns (bool) {
        return _status == ENTERED;
    }
}


// File contracts/LarsKristoHellheadz.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.20;



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

  address private _author; // larskristo.eth
  address private _operator; // svpervnder.eth

  uint256 private _tokenLimit; // set to 666 at build time

  mapping(uint256 tokenId => uint256) private _tokenPrices;
  uint256 private _transactionFraction = 300; // 3%

  string[] tokenURIs = [
    "QmbbdDACM5nkGqRG3cSmk8hYL46XWFkT8zvkbnrbcbSqa1",
    "QmcYmjn38SgzALqpPbF9CZW8cYAsXfJ1mhtwbgLzduyhg8",
    "QmcbENcreBLSTcAAvLCjPBo49pVJNJtkbyzpb3ynhqJGBS",
    "QmY5QA3UpM2SRLUnSsaW9QdhJWjUkYEMRTuSCHsEYnuEsp",
    "QmSV5d7ZMFh4YwbSeu5z3dQEfmDpRypYDs38PxPfAA5t2F",
    "QmSvgLvyJGhGTV6poQqDF7jzpPPwfTnud9zHifYTxBBacC",
    "QmYaro69wvY7roAFWDFyCC5dh5kn17HN8qgWUZAuciA6h6",
    "QmaDsufnz36gbmPYA6eYu1G5XpNwV8cwnx75oRhqaRYFqV",
    "QmVQcamJetJUh8QZVZq5qFU3zYJTh9ACdSrZnztxCFwP19",
    "QmWivRHkyCKKsvkMjVNBjyHQUbxtnhaog8hb6csA2XNehE",
    "QmUbGMGEsj5JBcDfQrXz8qS3EjLUmxjJakz1nr1EwcuiBE",
    "QmaZAeeNX5b9fxqVhggTTBGM2p67EBMUvXNxF2hsvgn4fz",
    "QmQeFpmqBSb3bSypkMS9pFfPcma61vCGw7SLynDdTW29hA",
    "QmY41UVGSxQFENpZ62HUGb2F9xP4fZHvgN68jG96bUyaDH",
    "QmeqevWbhRpwvdMshsnKNcQ8EggYeybRcuhq9oo1L5tbha",
    "Qme1bL83bGNSyWX4QPMKbj21HR6Mh8Pazqz2Uns2uXQvWW",
    "QmTa3fkvUYdwpcX2kLXH8S28UzHzsLc9RYbxkmtX6oyBwE",
    "QmWxSwMnmQxRdgeEqKjqwu821mN7V5PJ4Fctqb3Dou5tBD",
    "QmNZak29mEDytCYzqA8kwGXeFVoLTASR9q3QpEgDLJefH8",
    "QmeVkf6NWZjgghEDWPaBEJBHnNcTfwkAVa8pJiCNhdyE33",
    "QmRxss3JisSBfZFe9KY5VFYmHCppRsapqvnbYw9uwxuvBb",
    "QmaLrNsnbE1cTVaFvfohE764Gnvom1FVhLEaXxHu8awkjA",
    "QmW1zoFiF6dMBizNqvuKZez3dyGm1Q3zmuw5RzDSG9mUW8",
    "QmVjpYoFFQUvB99cKGkxAKdVAMsBeXNMx9CXMVBnx9GiAs",
    "QmWDFcT37hCLprTfqv1PqPix5eapbpkjpLUSHbaQpVx6MZ",
    "QmNakwy819jDbAMZkUwTTukoB4PD8YLFTPijDv1jTrwKUe",
    "QmT4C7bdAWowfT1mDRdtYPaseTmpedh96ZUh6pA5QT1wut",
    "QmYG5BVqoM54NLHA2dhLrN5jFv1ArMEa4qkKAURweMTNon",
    "QmTfSNu43KVhjvGwf3tC1BfQD5fgaFeHnhaPoBp6VAqPXd",
    "QmbKCT31PPjEFVr4k279bvwYv8eTZRXYwYK2cTkGXeKAc1",
    "QmepCstMc2eoEQJTkteUzwLwWDP8TNcBY7A1bX87NdcuKW",
    "QmXpCreF6b3uybT4x8dkXaJVtik2wRT5o4QFMeRZnphCVs",
    "Qma42tY8ktp2ETqhEt4aiLN1QL7Gw59uRCmp5EUJrcexwR",
    "QmUwdprTEHUNHzMTXcGZZcddAmyCSfxvmQ4A8HSCGsvAFB",
    "QmdoQ814eFQnpdgX5dMW5pCkXaiLv694YdmLyboazKBKK9",
    "QmVYuKVqfz4ie2xzTjLgMWaebAnQxXg2iQZ2Di6iVLbbz3",
    "QmVaFakYPojEKAAEeuQDd2GB7GSkX6Q2qz9NbTSyCH1rfU",
    "QmeHxSAoef1ySdGF8VGyTdUAo4ZhiZcY7GUb4hi5gahKH8",
    "QmdtuHPG8rdCBc5iLtmmTZytxmqqnPySVU687w2A2X8PCe",
    "QmRxkF5T5zmsyF5geyc1WeGxqXf1AztSTrTEVV4QwDAuTZ",
    "QmXJF6t4gbspWBCgr254emvqqhpWi4XLaMtyMGSEezCoLf",
    "QmcgrQXex9RAt7QFHYKMYtWqffjkc8QKFCPAZep3SZJ51B",
    "QmVfREzqSaccNUMQAEN4N9WVzQxEDdAdxXimFmq8Ed59Sk",
    "Qma6j1mcW2rpmUpfS7uscSkCJqdksAHkBA9BRVD3jAhVFS",
    "QmdCYaTe5FxhfjSoEZaePZcA5FKjGXqHGo6aqYHpwS4hU9",
    "QmPByuoc7CeBLd3J2RhJPTHBKTas6jNXm4BE2XHrF8ws1u",
    "QmejTdfRQ9Xc1mHaGU5511auaHrHDZsKbsfJ2iD5EXJHCY",
    "QmUsyRMFC15QHaNtqPuvnH7kSUhomzHgEZGrP882d6EaYz",
    "QmSZ4X5REvSQ6tA8qtmxR7VwZpbmmLiGvbSRhTfhkzGRHH",
    "QmNeYz18UWuZnxGuQnoynfEZdB9gojeB1x4h9FAL2gs8oW",
    "QmXa2ZVm4Pmn5C4LCaWYeBYwzGCNzQwE2GyQHJfYE3gUPj",
    "Qmbs7hoZWBn123wyQWmVyMnQ6jYY1EA8MmDqB4ZwAx28oc",
    "Qma4QpXdgn5715Wwi4DWQqq1FdJ3ws9AeNBtvkZLcH5Udn",
    "QmSVn4B6r4Ft6g8HFnW2zXryA3wv6SbdmxVqqMo2G1yjYA",
    "QmRdjcSNVUmd8JakgbFpcVyCwsnjR3yN3VNpqL6VJJmFi6",
    "QmYvEkTk1yRTh1inHPwamiFzQMcdZ2RCK1Rk5sGFbNsxNL",
    "QmT5ncGe3vxB99EnHo5Meg4V5Yc18ZN6LozFGU86KTnWfB",
    "QmbfU3ptmKhPxQRiroXeKt45ixYiBr6LEja5c1M2pkHwFq",
    "QmSupanySvd5RuYPojZk2ZBqC6euygPDfTSu1Sb3wABj4o",
    "QmNmz1LLUJgz3Yvrs4hyhjmE5yA7ZXWAcmFkrof7bGYhYV",
    "QmdScjX8gGpi6RHkTgaDhmaKae2RF32KRhLwAYFEVCrx7B",
    "QmZtwc8CYRjUdzMc11ZQiPo4X1FhgXDwu3CwbWdM551heF",
    "Qmc4HVZCdsS5V6mrsTwr7wLAyDWYddQ16UnYmN2r2Y5GbM",
    "QmeQ8GRvuBB2oo9qkerfYkLDFR94QoVcNjmFxJMQvPbhJA",
    "QmQyMT81muL6bwCTqt68iafswfY1ZCJ94WesyNNHwqctLw",
    "QmTMf4gSJvXKEnZLa2YJGYXUDYVpFKxoYArRVpyCvPGXk6",
    "QmZk62dd6bvXtgib7B6ZcKf7vi3jCvAwQAqGjFCFy6A284",
    "QmPnA6bqxXGmYSz8fzBMrQm8rzoZgrpvYsF1S5FApwPeud",
    "QmPVLjY3hNfeHUUMGMuta9KzmoH7n8YrDhBkPq912fmgCe",
    "QmaisZ7rACQWBmBZrY7RCXBHM9wfgC9LDtgMd3w3fT6kAJ",
    "QmNSiR1QcYBUDkMKH9Fxj4aYX6mBZFWgFaqQAdoMDtxS8G",
    "Qmbyxt9ExcKTXLaqmyp4QabvByPCcFkrgVmQYHJ3tgUqS7",
    "QmZLJxxcN3xG8iZ2spsa879sy9vVHRRwK8Y2XhRDDo9xjv",
    "QmPd7jVP4QQeuFNXTbUmPHhXPbab8uP82pn6qBBaVaS8GR",
    "QmSzHG7fDKbb4a4ZrZawZGHbqydC31KPTBK3BNaTF1nWzg",
    "QmV9k12oa3WJZQwPgmt5CNHwwqqXh4spjqhQEQPNG66Fjf",
    "QmbY7qzZUf7M5beMff4L7yS6vqx5eD6cyZwPAQe1JsBmc1",
    "QmbMSeNhBLcRqZJnzA2uiqGvS8jhiMPiuzM65ed4W5Ph6T",
    "QmYTZjxx67kK5DvfgYo8t5dfiffcJcPcNAi7bKfaAgtLf4",
    "QmR27mMTm1BSXhPiL6zMWvULsYTK5N1XyQ68WRf25axR2K",
    "QmP7xmFwmRf7ERv8rKud81kjiXhtF1uoBcERjm97s1N5NC",
    "QmYAL88eBSHxkPmASAQC1E4WLdJLb11sRb5y9YPwukqB5a",
    "QmWecPEgDyuSTrjZRQS4qw7CCndgYX9JStbhTynivD7xJN",
    "Qmd1YyKi16y3V6qxxb4f2esLvTm5w8XnfbQ8fHq76Hizn1",
    "Qmad7PkFENYw5Qtf4qjSJv2iAVLYXYTTWZZGgGGp3MSLUe",
    "QmUnkAtPJ1g2oFxYd2tmVigHAEn8Mw8Fcb3uzAqsAm7Fut",
    "QmfEnMLjnWxiPMgxUpjrexTiu14MXPEb6SmLBxTdEjN1we",
    "QmcopC9BjYXRsSvn2LfwrrBswptMwYm6xyzL9sbWhdkHV4",
    "QmXDxh5qRaYiqTQvzPuDvV1sivV7zWPHrP1aB1yY2ygc8P",
    "QmZeErxFCGT5kNDhK67fiZmQtv38BMvAj7nvz5sH9Bt9ow",
    "QmRE1443hwhZSBwfPNhQmtoEWFUhiGLBpgw7TPcYmq6TFe",
    "QmYmzeKaB3FzDjjCZA25wnJ8xWrP1FqWAEzTZ76Mbcp4CE",
    "QmVkxtLhc9VV6xgP6PPwJrhPs6wrHZzTTCkTDvGAAsdaqu",
    "QmNvbnktMAnAbD3FYax3f9Gan4ApVw16645jgqLtvhjc5k",
    "QmVVBB8idfGtMovMUNbJa9sAKNPV3LLU25vVmafPzuVg2h",
    "QmaVwqm3bpggyq49JjHiGSdS69VYgWwpiuLivWTu2bLx4W",
    "QmRM1ftrxw4YLT7S9ucrJeQfCBuFzoLq6FcqA3JymBAoLo",
    "QmQzKm9Fk8y5os7JFZ1MQ15V9ySAB6k1Tn47foV3mhf3dz",
    "QmQEUoKAaVukYktrf5vCDsJVu5TYbLVNPqTxjzAFr2bc9B",
    "QmeVbaL74ihFs8P983iTVtaoKKhVCKXHgZq744aT1tT9MB",
    "QmUPJ88Dfs5v8ocrz1SaeJ5xFo4NYSJUr4K2ayeEkYjMNw",
    "QmTmZSPDNSFztWBgX839niBcdeaUR7BAmqGaurV9WNif9D",
    "QmeG7FMXqffE8FTzwsEkQuDaqyfP9YobMmBuY44cHrxXWM",
    "QmXgzTFSGkJuxLaNRKPKtrpXsdEugsWLy58jzM817QkHVz",
    "Qmc4fiLHP9MotXtk1T3Bi1TbQrhCX8U6Ji25HVq9QpmmQE",
    "QmZY4GMWSaUS1E9yKGYqD5Y5SadzUwdWrds4LMxZD19yNX",
    "QmSzH41S2G5izsjkWpR4DBpCs1b6z3UEbqFaJHF5iPUGMM",
    "QmbgxFTX6EbSSULE2TtGKmgAtoEJJKx4PfydN9EzRzr8cW",
    "QmVCrnV5zjys4gWxPVpPdtQL7oiHJhUa2cs2u7YieTtwQ1",
    "QmRmDv2TCRLcjqba61EDgUCGcLyRvZgW1KxXJ2nvUTuVxj",
    "QmZ9sXTradRXreYZjNWUSVkKWFHV5fBdzGTtxr1qum2deE",
    "QmVjvzFDgkKKYDtz4AQaLRP1uEmzzRSWMt3NSxwHJaxuV7",
    "QmVVcdqbNWfwGKAqvrMmFMMU9ixf5eBgGiB38V2DXeSzts",
    "QmeXfArA7Dq7bxFudZ71YkiXrFaFX7nyYnBgh6UEh3szY2",
    "QmQ9wcYHCFK8nuiV7m5Gk677qgvZNnjhoK18pcfwHxDmJc",
    "QmbguL9A5TMrZke1wJfvhWUHy41B1FmrixKanENkCBCQxX",
    "Qmd5HWFW8yo3b1qcRBykqMyVyNef2oas1tS8RXu4dvPRkA",
    "QmZU9rawbSC698AbavHeB45PaTQaV7k1yotPA8FdW3k2oP",
    "QmfEVdsPSk2uMADPDbeYrPVfJefN7rMZCsbucisVUV3fFh",
    "QmRELXeoQdJPMh6byGywgQU4zLqLFRpVCNgqKdv91YExhj",
    "QmcERoHHM3pRKTBBM2DikupJGgN1MQwPCQi9svXouKmF1S",
    "QmPSXQ6D4ZZCKtiNfzjGyZxemTBbgmDWVT1dVsx3mgLirh",
    "QmW1NRKdv4z4d8UyBtG77CJvR2Nuh8sT1xnfKNTZFWK8qx",
    "QmReZDRvfJC4fpeb93qa9oh8RRRJMtgEhwdqUM4sKA7kXF",
    "QmR3FFakcG5nKynW1h24GCcxDEbwhUZ4Zv3vhQBY1Aa3py",
    "QmU2aQqUmqZdw9fQKT4oaEaeKrKnzk8T9SbYbG4H3FVDDD",
    "QmXr7eEWJHvmPpkP64HqHMzo7mfEnGSWbY9bU5QNBnnSDv",
    "QmVDZdaP5G2CZJbZUEhFE4ux17RSvTPoi8ntn9dMUZx6an",
    "QmekpQsFQwZdqqPm49u67tRJSnP5ZYAfcnWtr6xyVytEVa",
    "QmRteoxxNQt7F6xrbC4E2fiCWFZCM5QWH5MwB5DztVCiT5",
    "QmddA33ELdYfA65k1VQfze7aRzkhmWuqQvgjs8XmmuErBe",
    "QmUAYjkpdFwXgUeR3myJqaTF5ruBWPaa6FG9ACQw9T9V8F",
    "QmaPCZYcwxHxmmf9DozoLyhyrwu1f55CoEiudqu4tJpsfR",
    "QmUfvr4pUBmXKTRkWGk9TZqf1ZmZNtwCC5S6gCKwBh7P3X",
    "QmY6Cwer8qFKahvDRPXs9t9y6AiiW4nvVVJjRVPwdQkvvm",
    "QmTsgf9WHPNcTx6LCA5Yg52uVAxuPxoJRhEVjJWKBVQyhC",
    "QmQbKmAZQLBNuUqfrmoBVBnB7PH5oxW6wAsu4JZ5Wp4eXh",
    "QmT8gETJgxuEG1aZVdaGNAhbgEf38W44ikohSvEEudqhXf",
    "QmZDk2bGeEFAitxM7wsiT9gBxyTGYjcV4WqMshcEQdhTVh",
    "QmRHoDvdbMSUTMoY5nLKTtnrFUDeTzmgzyf9ywhDDWzgif",
    "QmSKow46cd3MKB8EqSNxD578YPYu8Dpy7LbHVG1ZUDgcgB",
    "Qmcge9n28RWZNNSoP7dxbcRjpavzMZWM9bDb4PHTaUj7bx",
    "QmXmbxUTxQGUUTfx3Uj31hp7Jy3wbjZY4pnoCo1hWTs8d1",
    "QmNfZxeZnLmGgVasC2MQQnVu2Co8Zh6EkVvxdb2UvSyd7m",
    "QmamFye2g3CRLDWTabeG2HrZtV7ZAeSE4PzeQvYVzqr864",
    "QmdLg1SKrfJF3uWq9gLiEEXC5FEm8zhkQ5VafS1fMH7riM",
    "QmT9LUQym2LTeDWhxRrVhN4bFw7FRANVhLuTzU1Hkad8AH",
    "QmePLbmWZjHgGptYHbKgfAP8Re6DYCfcgmB6GMQLrSTs3s",
    "QmfVS3QxSmLvf7MEZWYjGmM7veYJYrJrYTywpJdLL9nMst",
    "QmdF66fzTL9D1EVS2sw5kTsdpQ2e5C1CCCfWpZNMUraGqE",
    "QmbatBDJv7bgBjr483SCvrorrCokZDPtMYwaf7UMVyoXGH",
    "Qma59pWTgMJSJH41dwbQj7h1ZCTk3iLgpuRJNuQPyZjvPk",
    "Qman6pYNE7AxyBywifKxT8vxta5hewVGq3Mi2RGW9zcKH3",
    "QmeiGDGV9hWmqsCyughHf4DAmp7dMZ2ZwkdPLRAYf6VPYn",
    "QmbmcrkRBqrpaQdvybiND6kvMHigMpxZahtYqDGyBPSMmf",
    "QmcWnuzFybyEFFTEGPUSPd4GAFhboRJsyjcH6KqxtW9u5q",
    "QmZTWVhe99Q3G27qLiURaz6id513mWFjDa5rq6eVEipLpY",
    "QmdeEDUff6pA1777eCJpgtPnrwatwRSm2rm3e9EWQmPvwW",
    "QmcvmUh2ZXu2JgdA59rxxCyHdqRT75hMUw2oUBcRB5iNHw",
    "QmRRBd6d5jjrN9opXGYzKKBVL3kwcXUafeVUyiQop7Sbtp",
    "QmUwDiXwRRi5kA5fgABMDk7gNQPzMCDbymRQuoGFwacW26",
    "Qmajj875hZDA1gpqSNKHCEsGFsTfwU4uFVx6ZiCJHokfDk",
    "QmTXKewsMdYS2jtHH86YDpzaSzrMSotrx64DeUH3WZFP6U",
    "QmfZfk1bLDX2QtkXEEBGHyW8pg5LwqyWZmn6BhFJacUQDT",
    "QmcRyaaV2HB6amgnAauRSseD2Z7GaThFzM6zdhJi8SKngd",
    "QmXhAGobHY8GA6naGJsrVJtTnuTgqLPaiLRg4qcaKeMqop",
    "QmQpW1uZQ1hQhDJGdcosu9RhYZW5u5eKSqAJkeo35AXLmQ",
    "QmPy2dGJfea1PMfpapkCsX3yH1RdjfGsHXEcznfrjAQd5z",
    "QmUfSEm3Ysw1kZtZAhtrVBNE5WQ9pv8pCRzt7M1xG1cXPo",
    "QmYb3ikKsA2f9GCu2Z2EVwowTYoTFks24gghkmRupSNmSR",
    "QmTMzxsHec6Lg8uKgMHYURduWFrwpAMReqWx3Zu1hkWY5r",
    "QmfR9eyg1BHhewaHJx2ePpGKr4NhT7sKgSskEhJttasTfS",
    "QmQtqDyqtxqC6qh1SQmUK7s5i16KJ8BSKs3gDiPvKRtdgB",
    "QmP7NG6s64AR93EDRmbZ9eg96nbbhNNizKACAw47smW8Rk",
    "QmWJkKkRH3jujYtY2rPt4EpzArFvF4s1Gu2He3twt8rEGf",
    "QmYAPZzEhG6NyGAuvj17mRsARxNvs2iHUqyogCG18f2BdA",
    "QmT5fmkBJhzkbsH5SDGEiKTCzDj8DLzXQczpnLoTUxCAbW",
    "QmNQ22qNkThz1cSyPJzAZ46S3jLu71Rd6Qgpu3MXijsv4r",
    "QmaXmZ9UWNkcFoMRVnf2mXTuTenVRyVzTSnZQXj2Q1Cin8",
    "QmZjhXxn4aLzeuxsssRS7noaYF9rVpKyNURGENNdAjZQWQ",
    "QmYg2hi7dGekgAUMwPP6W7aUZvQTMfFc6w19x3vgmkVwxU",
    "QmaKNY6iE6PmqPMhAvgsjKajJuN7obDdu9meySFQvkZPUx",
    "QmabkizqWiWSArJ8JQZ91zXewXqZ1SBoaYsgV64MSVc6Wf",
    "QmSK3PvZumyr85CetrzPyaTxUeD4CbUcqqd2y3L7oexXu3",
    "QmcPi1aKwFWStkaUqca1rTphNykpjHbK8j8xGxY9ST1E1L",
    "QmUz1SyoRrtEcSur5HY26uziGcWKgaG9jMpmUz7Qn4DWUt",
    "QmNdYb4bqm3QvpBFMf3UxqEEJMZrvz85VoRmG8jwC3K3KW",
    "QmXni4yjpCKB4y4CJKGHNht24JN7kxoyJ7RAiuQNd9EiLB",
    "QmXnnQLxNMQgVaRpHTaAVgvx7ZDLHE6gitMHMYP8RZEeji",
    "QmaXkD35dsghGnif3LbWgWFA1WaV5qM5Q7DdU6wxxSN82x",
    "QmRrL6PVrtzU3EgrevKn7TfMg5LeBvgoLT51sDo6Ww6ofY",
    "QmUtEhZeye8tnJdKAgN1LxQGUp1zWCH9HPKivkcGMHhpxu",
    "QmY9pcWTZHdtx8WUpqyZKjYXYywYxMsN61d8SZznFXkZvv",
    "QmYbDZ2eKerK28dCDJn8KXAMuB7XLG1tTYM5GqPyuqbJsC",
    "QmZSArCQGrfwb3x5sRTEwE5koDGtdcZnZpFJm25MH3QqPF",
    "QmahYyDLFiV7HsJo42sKUTdBMPkrbKe414eHKLjktjUZXA",
    "QmbqJ4wA46uBJ8ZjKtoDGFpRYWCdzbKfRg3f3SHeLx54jv",
    "QmT9VoKDr2jGnxa9jepTkktbssLsZXWysHqBtz2EkxeJRr",
    "QmP8DStwTc2AzJ5AekVJJBXrxWpwYMqjtiJr2F5YrvKUZp",
    "QmX7SPe5nhbbkPdcFSeNyFta9PDe2cbBPsmbNnfb9SvTCT",
    "Qmcva2zsj4XpqpYFsgEDCGickkwijfrSwECNRUPBggpzS5",
    "QmWvgq9WpySsLLQEGkRa51sRQHiSSFndMhcvf3Lo3fNWHg",
    "QmfQsqEqAotjEao76jqcJ4vWrUfZf2xyYpJDcnmf6GAGRH",
    "QmXTcdnByABuNitK4XvDXET3P1gQashGEFT4wPc4xKhQUH",
    "QmP3hJ2zBWTK4Ft9BXPLX3kL1dRmkQFoAP9GRVzY5FA786",
    "QmcByJPRDjnzXy8C2M6CrYZH2hTJPJA2mVVRAuG1jGiuZq",
    "Qmeo3zqRdmmJqc9VCSYbzaf1k6eyCrGddap3z8g5vBLV9S",
    "QmXR4W8xcg39LJurDqBaaHkom7pdP6Wm5NnpjqCFPS2sy5",
    "QmSRmKb1VniiNkXuGZhzKDfvj1PKZPTKAqfDgNpGuH8z6t",
    "QmWTnrfhQC4CqCAKX8WnGdKmkpXje3zf3d8UhDi1Tv8nGn",
    "QmXyVCVRwhy8CDCm8p4N1ZhVEaRz3uZ87nAT9RJDii3pbo",
    "QmdbFDNEQXe39czCfpNfuyFN1as2QEJPQCGgRE9eQ2qajo",
    "QmT4GoXaX5ZYXnCmkidBjTWwRL5spPfScQfecnJZdEDD1i",
    "QmWvJsae9bUBdcQpCbrcX3hTTh3TMqTRMHy1qiZsevynP4",
    "QmUK8NWeCrEHzDAZzhRv9UtN3S93PHktAtLQEgPKJcXYAk",
    "QmQutJnFVacdvgaoZYriSKy8FGqc7CPtYCvgnNnqXFkMgM",
    "QmbdpFqJY5NhihXwFQkDZAJd4jvgUP8YZkAeqyaJkjNuPn"
  ];

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

    for (uint i = 0; i < tokenURIs.length; i++) {
      uint256 tokenId = i + 1;
      _safeMint(_author, tokenId);
      _tokenPrices[tokenId] = 0.5 ether; // initial token price
    }

    _setDefaultRoyalty(_author, 1000); // 10% royalty
  }

  function mintUntilDoomsday(string memory tokenURI_) public {
    if (_msgSender() != _author) {
      revert ERC721InvalidOwner(_msgSender());
    }

    uint256 tokenId = totalSupply() + 1;

    if (tokenId > _tokenLimit) {
      revert ERC721ForbiddenMint(tokenId);
    }

    _safeMint(_author, tokenId);
    tokenURIs.push(tokenURI_);
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
    string memory tokenURIhash = tokenURIs[tokenId - 1];

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
