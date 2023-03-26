const { parseEther, formatEther, defaultAbiCoder } = require("ethers/lib/utils");
const { writeFileSync } = require("fs");
const { ethers } = require("hardhat");
const { join } = require("path");

describe("Reader", function () {
  it("Works", async function () {
    const multicallFactory = await ethers.getContractFactory("Multicall3");
    const multicall = await multicallFactory.deploy();

    const tokenFactory = await ethers.getContractFactory("Token");
    const accounts = await ethers.getSigners();
    const token = await tokenFactory.deploy();

    const ReaderFactory = await ethers.getContractFactory("Reader");
    const { data } = ReaderFactory.getDeployTransaction(
      token.address,
      accounts.map(({ address }) => address)
    );

    writeFileSync(join(__dirname, "calldata"), data);

    {
      const balances = await ethers.provider.call({ data });
      const [decoded] = defaultAbiCoder.decode(["uint256[]"], balances);
      console.log({ balanceBefore: decoded.map(formatEther) });
    }

    await multicall.aggregate3(
      accounts.map(({ address }) => ({
        allowFailure: false,
        target: token.address,
        callData: token.interface.encodeFunctionData("mint", [address, String(parseEther("10"))]),
      }))
    );

    {
      const balances = await ethers.provider.call({ data });
      const [decoded] = defaultAbiCoder.decode(["uint256[]"], balances);
      console.log({ balanceAfter: decoded.map(formatEther) });
    }
  });
});
