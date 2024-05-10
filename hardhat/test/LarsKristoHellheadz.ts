/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable node/no-unsupported-features/es-builtins */
/* eslint-disable no-unused-expressions */
import { expect } from "chai";
import { ethers } from "hardhat";

const AUTHOR_ACCOUNT_ID = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

const TOKEN_NAME = "larskristo: hellheads";
const TOKEN_SYMBOL = "LKHH";
const TOKEN_LIMIT = 7;

const TOKEN_URIS = [
  "QmSwQ4b6avrDtvG2pu95p7cdFm63y7mnhKKsYnE7qnkj7M",
  "QmZfd4u2MmvZSv8mJaDmuj4HRBJKDYvphc6n9twEd6A9ez",
  "QmXsbH9rS6isD2ZDQpfQCbVfmLNuuc7WRaVXKGJLShop98",
  "QmYYzRdL6WtAiBZfrQrSQXPzRsXhZj6beZZ2X7WbV2RuyM",
  "QmUpJLggdspPKZgturP7fWB455nTjk3gzuPkTB3Vde6BVJ",
];

async function createERC721Contract() {
  const [fund, , signer] = await ethers.getSigners();

  await fund.sendTransaction({ to: signer.address, value: ethers.parseEther("2") });

  const ERC721 = await ethers.getContractFactory("LarsKristoHellheadz");

  const contract = await ERC721.connect(signer).deploy(TOKEN_NAME, TOKEN_SYMBOL, AUTHOR_ACCOUNT_ID, TOKEN_LIMIT);

  return contract;
}

describe("LarskristoHellheadz", function () {
  it("Initialize: call constructor", async function () {
    const [author, , operator] = await ethers.getSigners();

    const ERC721 = await createERC721Contract();

    await ERC721.connect(author).batchMint(TOKEN_URIS);

    const name = await ERC721.name();
    const symbol = await ERC721.symbol();

    const ownerOf0 = await ERC721.ownerOf(1);
    const ownerOf1 = await ERC721.ownerOf(2);
    const ownerOf2 = await ERC721.ownerOf(3);
    const ownerOf3 = await ERC721.ownerOf(4);

    expect(name).to.equal(TOKEN_NAME);
    expect(symbol).to.equal(TOKEN_SYMBOL);

    expect(ownerOf0).to.equal(author.address);
    expect(ownerOf1).to.equal(author.address);
    expect(ownerOf2).to.equal(author.address);
    expect(ownerOf3).to.equal(author.address);

    // check approval for all
    await expect(ERC721.connect(author).setApprovalForAll(operator.address, true))
      .to.emit(ERC721, "ApprovalForAll")
      .withArgs(author.address, operator.address, true);

    const isApprovedForAll = await ERC721.isApprovedForAll(author.address, operator.address);
    expect(isApprovedForAll).to.be.true;

    const totalSupply = await ERC721.totalSupply();
    expect(totalSupply).to.equal(5);

    const tokenUri1 = await ERC721.tokenURI(1);
    expect(tokenUri1).to.equal(
      "https://blockchainassetregistry.infura-ipfs.io/ipfs/QmZfd4u2MmvZSv8mJaDmuj4HRBJKDYvphc6n9twEd6A9ez",
    );
  });

  it("batchMint", async function () {
    const [author, , , someoneElse] = await ethers.getSigners();

    const ERC721 = await createERC721Contract();
    await ERC721.connect(author).batchMint(TOKEN_URIS);

    let newTokenURI = "new-token-uri";

    await ERC721.connect(author).batchMint([newTokenURI]);

    let tokenUri = await ERC721.tokenURI(5);
    expect(tokenUri).to.equal(`https://blockchainassetregistry.infura-ipfs.io/ipfs/${newTokenURI}`);

    let totalSupply = await ERC721.totalSupply();
    expect(totalSupply).to.equal(6);

    await expect(ERC721.connect(someoneElse).batchMint([newTokenURI])).to.be.revertedWithCustomError(
      ERC721,
      `OwnableUnauthorizedAccount`,
    );

    newTokenURI = "new-token-uri-2";

    await ERC721.connect(author).batchMint([newTokenURI]);

    tokenUri = await ERC721.tokenURI(6);
    expect(tokenUri).to.equal(`https://blockchainassetregistry.infura-ipfs.io/ipfs/${newTokenURI}`);

    totalSupply = await ERC721.totalSupply();
    expect(totalSupply).to.equal(7);

    await expect(ERC721.connect(author).batchMint([newTokenURI])).to.be.revertedWithCustomError(
      ERC721,
      `ERC721ForbiddenMint`,
    );
  });
});
