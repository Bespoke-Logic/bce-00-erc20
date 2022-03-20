const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Petrol", function () {
  let Petrol, petrolCoin;
  beforeEach(async function () {
    Petrol = await ethers.getContractFactory("Petrol");
    petrolCoin = await Petrol.deploy();
    await petrolCoin.deployed();
  });

  it("Should be an ERC20 coin", async function () {
    expect(await petrolCoin.name()).to.equal("Petrol");
    expect(await petrolCoin.symbol()).to.equal("PETROL");
    expect(await petrolCoin.decimals()).to.equal(18);
  });

  it("Should have an initial quantity of 10M coins", async function () {
    const accounts = await hre.ethers.getSigners();
    expect(await petrolCoin.balanceOf(accounts[0].address)).to.equal(10000000);
    expect(await petrolCoin.totalSupply()).to.equal(10000000);
  });

  it("Should support transfer", async function () {
    const accounts = await hre.ethers.getSigners();
    const owner = accounts[0].address;
    const receiver = accounts[1].address;
    expect(await petrolCoin.balanceOf(owner)).to.equal(10000000);
    await petrolCoin.transfer(receiver, 10000);
    expect(await petrolCoin.balanceOf(owner)).to.equal(10000000 - 10000);
    expect(await petrolCoin.balanceOf(receiver)).to.equal(0 + 10000);
    await expect(petrolCoin.transfer(receiver, 10000))
      .to.emit(petrolCoin, "Transfer")
      .withArgs(owner, receiver, 10000);
    expect(await petrolCoin.balanceOf(owner)).to.equal(10000000 - 20000);
    expect(await petrolCoin.balanceOf(receiver)).to.equal(0 + 20000);
  });
});
