require("@nomiclabs/hardhat-ethers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    hardhat: {
      accounts: {
        count: 201,
      },
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
  },
};
