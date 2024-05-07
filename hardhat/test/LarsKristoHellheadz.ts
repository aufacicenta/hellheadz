/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable node/no-unsupported-features/es-builtins */
/* eslint-disable no-unused-expressions */
import { expect } from "chai";
import moment from "moment";
import { BigNumber, BigNumberish } from "ethers";
import { ethers, network } from "hardhat";
import { DummyERC721, Lease as Lease721 } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const AUTHOR_ACCOUNT_ID = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const OPERATOR_ACCOUNT_ID = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";

const TOKEN_NAME = "larskristo: hellheads";
const TOKEN_SYMBOL = "LKHH";
const TOKEN_LIMIT = 7;

async function getBlockTimestamp() {
  const blockNumBefore = await ethers.provider.getBlockNumber();
  const blockBefore = await ethers.provider.getBlock(blockNumBefore);
  const blockTimestamp = blockBefore.timestamp;

  return blockTimestamp;
}

async function createERC721Contract() {
  const [fund, , signer] = await ethers.getSigners();

  await fund.sendTransaction({ to: signer.address, value: ethers.parseEther("2") });

  const ERC721 = await ethers.getContractFactory("LarsKristoHellheadz");

  const contract = await ERC721.connect(signer).deploy(
    TOKEN_NAME,
    TOKEN_SYMBOL,
    AUTHOR_ACCOUNT_ID,
    OPERATOR_ACCOUNT_ID,
    TOKEN_LIMIT,
  );

  return contract;
}

describe("LarskristoHellheadz", function () {
  it("Initialize: call constructor", async function () {
    const [author, , operator] = await ethers.getSigners();

    // console.log({ owner: owner.address, signer: signer.address });

    const ERC721 = await createERC721Contract();

    const name = await ERC721.name();
    const symbol = await ERC721.symbol();

    const ownerOf0 = await ERC721.ownerOf(1);
    const ownerOf1 = await ERC721.ownerOf(2);
    const ownerOf2 = await ERC721.ownerOf(3);
    const ownerOf3 = await ERC721.ownerOf(4);

    expect(name).to.equal(TOKEN_NAME);
    expect(symbol).to.equal(TOKEN_SYMBOL);

    // console.log({ ownerOf0, ownerOf1, ownerOf2, ownerOf3 });

    expect(ownerOf0).to.equal(author.address);
    expect(ownerOf1).to.equal(author.address);
    expect(ownerOf2).to.equal(author.address);
    expect(ownerOf3).to.equal(author.address);

    // const token0 = await ERC721.tokenURI(0);
    // const token1 = await ERC721.tokenURI(1);
    // const token2 = await ERC721.tokenURI(2);
    // const token3 = await ERC721.tokenURI(3);

    // console.log({ token0, token1, token2, token3 });

    // check for token price
    const price = await ERC721.getTokenPrice(1);
    expect(ethers.formatEther(price)).to.equal("0.5");

    // check approval for all
    await expect(ERC721.connect(author).setApprovalForAll(operator.address, true))
      .to.emit(ERC721, "ApprovalForAll")
      .withArgs(author.address, operator.address, true);

    const isApprovedForAll = await ERC721.isApprovedForAll(author.address, operator.address);
    expect(isApprovedForAll).to.be.true;

    const totalSupply = await ERC721.totalSupply();
    expect(totalSupply).to.equal(5);

    await expect(ERC721.tokenURI(0)).to.be.revertedWithCustomError(ERC721, `ERC721NonexistentToken`);

    const tokenUri1 = await ERC721.tokenURI(1);
    expect(tokenUri1).to.equal(
      "https://blockchainassetregistry.infura-ipfs.io/ipfs/QmbbdDACM5nkGqRG3cSmk8hYL46XWFkT8zvkbnrbcbSqa1",
    );
  });

  it("getTokenPrice", async function () {
    const ERC721 = await createERC721Contract();

    const price = await ERC721.getTokenPrice(1);

    // console.log({ price: ethers.formatEther(price) });

    expect(ethers.formatEther(price)).to.equal("0.5");
  });

  it("royaltyInfo", async function () {
    const [author] = await ethers.getSigners();

    const ERC721 = await createERC721Contract();

    const price = await ERC721.getTokenPrice(1);

    const royaltyInfo = await ERC721.royaltyInfo(1, price);

    // console.log({ price: ethers.formatEther(price), royaltyInfo });

    const [receiver, royaltyAmount] = royaltyInfo;

    expect(ethers.formatEther(royaltyAmount)).to.equal("0.05");
    expect(receiver).to.equal(author.address);
  });

  it("setTokenForSale", async function () {
    const [author, , operator, someoneElse] = await ethers.getSigners();

    const ERC721 = await createERC721Contract();

    await ERC721.connect(author).setApprovalForAll(operator.address, true);

    await ERC721.connect(operator).setTokenForSale(1, BigInt(ethers.parseEther("0.6")));

    const price1 = await ERC721.getTokenPrice(1);

    // console.log({ price1: ethers.formatEther(price1) });

    expect(ethers.formatEther(price1)).to.equal("0.6");

    await ERC721.connect(author).setTokenForSale(2, BigInt(ethers.parseEther("0.6")));

    const price2 = await ERC721.getTokenPrice(2);

    // console.log({ price2: ethers.formatEther(price2) });

    expect(ethers.formatEther(price2)).to.equal("0.6");

    await expect(ERC721.connect(someoneElse).setTokenForSale(2, BigInt(ethers.parseEther("0.6")))).to.be.reverted;
  });

  it("buyToken", async function () {
    const [author, someoneElse, operator, buyer] = await ethers.getSigners();

    // let authorBalance = await ethers.provider.getBalance(author.address);
    // let operatorBalance = await ethers.provider.getBalance(operator.address);
    // let buyerBalance = await ethers.provider.getBalance(buyer.address);

    // console.log({
    //   authorBalance: ethers.formatEther(authorBalance),
    //   operatorBalance: ethers.formatEther(operatorBalance),
    //   buyerBalance: ethers.formatEther(buyerBalance),
    // });

    const ERC721 = await createERC721Contract();

    await ERC721.connect(author).setApprovalForAll(operator.address, true);

    const price = ethers.parseEther("1");

    await ERC721.connect(operator).setTokenForSale(1, price);

    // authorBalance = await ethers.provider.getBalance(author.address);
    // operatorBalance = await ethers.provider.getBalance(operator.address);
    // buyerBalance = await ethers.provider.getBalance(buyer.address);

    // console.log({
    //   authorBalance: ethers.formatEther(authorBalance),
    //   operatorBalance: ethers.formatEther(operatorBalance),
    //   buyerBalance: ethers.formatEther(buyerBalance),
    // });

    ERC721.on("Transfer", (from, to, tokenId) => {
      // console.log({ from, to, tokenId });
      expect(from).to.equal(author.address);
      expect(to).to.equal(buyer.address);
      expect(tokenId).to.equal(1);
    });

    const authorFee = ethers.parseEther("0.1");
    const operatorFee = ethers.parseEther("0.03");
    const sellerProfit = ethers.parseEther("0.87");

    await expect(ERC721.connect(buyer).buyToken(1, { value: price }))
      .to.emit(ERC721, "Purchase")
      .withArgs(author.address, buyer.address, 1, price, authorFee, operatorFee, sellerProfit);

    // console.log({ authorFee, price, percentage: (authorFee * 100n) / price });
    expect((authorFee * 100n) / price).to.equal(10n);
    expect((operatorFee * 100n) / price).to.equal(3n);
    expect(price - authorFee - operatorFee).to.equal(sellerProfit);

    const ownerOf0 = await ERC721.ownerOf(1);

    // console.log({ ownerOf0 });

    expect(ownerOf0).to.equal(buyer.address);

    // authorBalance = await ethers.provider.getBalance(author.address);
    // operatorBalance = await ethers.provider.getBalance(operator.address);
    // buyerBalance = await ethers.provider.getBalance(buyer.address);

    // console.log({
    //   authorBalance: ethers.formatEther(authorBalance),
    //   operatorBalance: ethers.formatEther(operatorBalance),
    //   buyerBalance: ethers.formatEther(buyerBalance),
    // });

    // only the buyer should set prices now
    await expect(ERC721.connect(author).setTokenForSale(1, BigInt(ethers.parseEther("2")))).to.be.reverted;
    await expect(ERC721.connect(operator).setTokenForSale(1, BigInt(ethers.parseEther("2")))).to.be.reverted;

    await expect(ERC721.connect(buyer).setTokenForSale(1, BigInt(ethers.parseEther("2"))))
      .to.emit(ERC721, "SetTokenForSale")
      .withArgs(buyer.address, 1, BigInt(ethers.parseEther("2")));

    const newPrice = await ERC721.getTokenPrice(1);
    expect(ethers.formatEther(newPrice)).to.equal("2.0");

    // too poor to buy
    await expect(ERC721.connect(someoneElse).buyToken(1, { value: BigInt(ethers.parseEther("1")) })).to.be.reverted;
  });

  it("mintUntilDoomsday", async function () {
    const [author, , , someoneElse] = await ethers.getSigners();

    const ERC721 = await createERC721Contract();

    let newTokenURI = "new-token-uri";

    await ERC721.connect(author).mintUntilDoomsday(newTokenURI);

    let tokenUri = await ERC721.tokenURI(6);
    expect(tokenUri).to.equal(`https://blockchainassetregistry.infura-ipfs.io/ipfs/${newTokenURI}`);

    let totalSupply = await ERC721.totalSupply();
    expect(totalSupply).to.equal(6);

    await expect(ERC721.connect(someoneElse).mintUntilDoomsday(newTokenURI)).to.be.revertedWithCustomError(
      ERC721,
      `ERC721InvalidOwner`,
    );

    newTokenURI = "new-token-uri-2";

    await ERC721.connect(author).mintUntilDoomsday(newTokenURI);

    tokenUri = await ERC721.tokenURI(7);
    expect(tokenUri).to.equal(`https://blockchainassetregistry.infura-ipfs.io/ipfs/${newTokenURI}`);

    totalSupply = await ERC721.totalSupply();
    expect(totalSupply).to.equal(7);

    await expect(ERC721.connect(author).mintUntilDoomsday(newTokenURI)).to.be.revertedWithCustomError(
      ERC721,
      `ERC721ForbiddenMint`,
    );
  });
});
