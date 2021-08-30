// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "./ERC3156FlashLenderInterface.sol";
import "./ERC3156FlashBorrowerInterface.sol";

interface Comptroller {
    function isMarketListed(address cTokenAddress) external view returns (bool);
}

interface ERC20 {
    function approve(address spender, uint256 amount) external;
}
// FlashloanBorrower is a simple flashloan Borrower implementation for testing
contract FlashloanBorrower is ERC3156FlashBorrowerInterface {
    /**
     * @notice C.R.E.A.M. comptroller address
     */
    address public comptroller;
    constructor(address _comptroller) {
        comptroller = _comptroller;
    }

    function doFlashloan(
        address flashloanLender,
        address borrowToken,
        uint256 borrowAmount
    ) external {
        bytes memory data = abi.encode(borrowToken, borrowAmount);
        ERC3156FlashLenderInterface(flashloanLender).flashLoan(this, borrowToken, borrowAmount, data);
    }

    function onFlashLoan(
        address initiator,
        address token,
        uint256 amount,
        uint256 fee,
        bytes calldata data
    ) override external returns (bytes32) {
        require(Comptroller(comptroller).isMarketListed(msg.sender), "untrusted message sender");
        require(initiator == address(this), "FlashBorrower: Untrusted loan initiator");
        (address borrowToken, uint256 borrowAmount) = abi.decode(data, (address, uint256));
        require(borrowToken == token, "encoded data (borrowToken) does not match");
        require(borrowAmount == amount, "encoded data (borrowAmount) does not match");
        ERC20(token).approve(msg.sender, amount + fee);
        // your logic is written here...
        return keccak256("ERC3156FlashBorrowerInterface.onFlashLoan");
    }
}
