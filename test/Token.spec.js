// SPDX-License-Identifier: MIT
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC20Token", function () {
  let ERC20Token;
  let erc20Token;
  let totalSupply;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    totalSupply = ethers.parseEther('1');
    ERC20Token = await ethers.getContractFactory("ERC20Token");
    [owner, addr1, addr2] = await ethers.getSigners();
    erc20Token = await ERC20Token.deploy("MyToken", "MTK", totalSupply);
    await erc20Token.waitForDeployment();
  });

  it("should have correct initial values", async function () {
    expect(await erc20Token.name()).to.equal("MyToken");
    expect(await erc20Token.symbol()).to.equal("MTK");
    expect(await erc20Token.owner()).to.equal(owner.address);
    expect(await erc20Token.decimals()).to.equal(18);
    expect(await erc20Token.totalSupply()).to.equal(totalSupply);
    expect(await erc20Token.balanceOf(owner.address)).to.equal(totalSupply);
  });

  it("should transfer tokens", async function () {
    await erc20Token.transfer(addr1.address, 100);
    expect(await erc20Token.balanceOf(addr1.address)).to.equal(100);
  });

  it("should approve and transferFrom tokens", async function () {
    await erc20Token.connect(addr1).approve(owner.address, 100);
    await erc20Token.connect(addr1).transferFrom(owner.address, addr2.address, 50);
    expect(await erc20Token.allowance(addr1.address, owner.address)).to.equal(50);
    expect(await erc20Token.balanceOf(addr2.address)).to.equal(50);
  });

  it("should transfer ownership", async function () {
    await erc20Token.transferOwnership(addr1.address);
    expect(await erc20Token.owner()).to.equal(addr1.address);
  });

  it("should renounce ownership", async function () {
    await erc20Token.renounceOwnership();
    expect(await erc20Token.owner()).to.equal(ethers.ZeroAddress);
  });

  it("should mint tokens", async function () {
    const totalSupply = await erc20Token.totalSupply();
    const ownerBalance = await erc20Token.balanceOf(owner.address);

    await erc20Token.mint(owner.address, 100);
    expect(await erc20Token.balanceOf(owner.address)).to.equal(ownerBalance + 100n);
    expect(await erc20Token.totalSupply()).to.equal(totalSupply + 100n);
  });

  it("should burn tokens", async function () {
    const totalSupply = await erc20Token.totalSupply();
    const ownerBalance = await erc20Token.balanceOf(owner.address);

    await erc20Token.burn(owner.address, 50);
    expect(await erc20Token.balanceOf(owner.address)).to.equal(ownerBalance - 50n);
    expect(await erc20Token.totalSupply()).to.equal(totalSupply - 50n);
  });
});
