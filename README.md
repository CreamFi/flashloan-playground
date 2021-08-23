# CREAM Flash Loan playground

*This repo is an example ONLY. DO NOT use it in production enviorment and* **USE AT YOUR OWN RISK**

This repo allows users to play around with our flashloan on mainnet forked environment

## Install

```
yarn install
```

## Edit hardhat.config.js

```js
// hardhat.config.js
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
        // fill your project id or your rpc endpoint here.
        url: "https://mainnet.infura.io/v3/<PROJECT_ID>"
      }
    }
  },
};
```

## Compile contract

```
npx hardhat compile
```

## Run the flashloan task

```
npx hardhat flashloan
```

You can modify `FlashLoanBorrower.sol` and flashloan task code in `hardhat.config.js` to
play around flashloan feature on mainnet fork.
Don't forget to re-compile your contract when you modify it.
