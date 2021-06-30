/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("@nomiclabs/hardhat-ethers");

const ERC20ABI = [
  'function balanceOf(address) external view returns (uint)',
  'function transfer(address, uint) external returns (bool)',
]

// Run this task with mainnet fork,
// so that you can see play around your flashloan example contract
task("flashloan", async (_, hre) => {

    // The address that has USDC on mainnet
    const walletAddr = '0xf977814e90da44bfa03b6295a0616a897441acec'

    const crUSDCAddr = '0x44fbeBd2F576670a6C33f6Fc0B00aA8c5753b322'
    const USDCAddr = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [walletAddr]
    });

    const wallet = await hre.ethers.provider.getSigner(walletAddr);
    const factory = await hre.ethers.getContractFactory('FlashloanExample');

    // deploy flashloan example contract
    const flashloanExampleContract = await factory.deploy();

    // Send 100 USDC to flash loan example contract,
    // so that you have enough fund to pay the fee.
    const USDC = new ethers.Contract(USDCAddr, ERC20ABI, wallet);
    let tx = await USDC.transfer(flashloanExampleContract.address, 100 * 1e6)
    await tx.wait()


    console.log('contract:', flashloanExampleContract.address);

    // call the doFlashloan
    tx = await flashloanExampleContract.doFlashloan(crUSDCAddr, 10000 * 1e6);
    const receipt = await tx.wait()

    // see the result
    console.log(receipt.events)


    await hre.network.provider.request({
      method: "hardhat_stopImpersonatingAccount",
      params: [walletAddr]
    });
  })



module.exports = {
  defaultNetwork: "hardhat",
  solidity: {
    version: "0.5.17" ,
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      forking: {
        url: "https://mainnet.infura.io/v3/<PROJECT_ID>"
      }
    }
  },
};
