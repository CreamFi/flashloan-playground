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
task("flashloanV1", async (_, hre) => {

    // The address that has USDC on mainnet
    const walletAddr = '0xf977814e90da44bfa03b6295a0616a897441acec'
    const USDCAddr = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'

    // below flashLender and comptroller addresses are for C.R.E.A.M. V1
    const flashloanLenderAddr = '0xa8682Cfd2B6c714d2190fA38863d545c7a0b73D5'
    const comptrollerAddr = '0x3d5BC3c8d13dcB8bF317092d84783c2697AE9258'


    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [walletAddr]
    });

    const wallet = await hre.ethers.provider.getSigner(walletAddr);
    const factory = await hre.ethers.getContractFactory('FlashloanBorrower');

    // deploy flashloan Borrower contract
    const flashloanBorrowerContract = await factory.deploy(comptrollerAddr);

    // Send 100 USDC to flash loan Borrower contract,
    // so that you have enough fund to pay the fee.
    const USDC = new ethers.Contract(USDCAddr, ERC20ABI, wallet);
    let tx = await USDC.transfer(flashloanBorrowerContract.address, 100 * 1e6)
    await tx.wait()


    console.log('contract:', flashloanBorrowerContract.address);

    // call the doFlashloan
    tx = await flashloanBorrowerContract.doFlashloan(flashloanLenderAddr, USDCAddr, 10000 * 1e6);
    const receipt = await tx.wait()

    // see the result
    console.log(receipt.events)


    await hre.network.provider.request({
      method: "hardhat_stopImpersonatingAccount",
      params: [walletAddr]
    });
  })


  task("flashloanIronBank", async (_, hre) => {

    // The address that has SNX on mainnet
    const walletAddr = '0xf977814e90da44bfa03b6295a0616a897441acec'
    const SNXAddr = '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F'

    const flashloanLenderAddr = '0x1a21Ab52d1Ca1312232a72f4cf4389361A479829'
    const comptrollerAddr = '0xAB1c342C7bf5Ec5F02ADEA1c2270670bCa144CbB'

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [walletAddr]
    });

    const wallet = await hre.ethers.provider.getSigner(walletAddr);
    const factory = await hre.ethers.getContractFactory('FlashloanBorrower');

    // deploy flashloan Borrower contract
    const flashloanBorrowerContract = await factory.deploy(comptrollerAddr);

    // Send SNX to flash loan Borrower contract,
    // so that you have enough fund to pay the fee.
    const SNX = new ethers.Contract(SNXAddr, ERC20ABI, wallet);
    let tx = await SNX.transfer(flashloanBorrowerContract.address, 100 * 1e6)
    await tx.wait()

    console.log('contract:', flashloanBorrowerContract.address);
    // call the doFlashloan
    tx = await flashloanBorrowerContract.doFlashloan(flashloanLenderAddr, SNXAddr, 10000 * 1e6);
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
    version: "0.8.0" ,
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
