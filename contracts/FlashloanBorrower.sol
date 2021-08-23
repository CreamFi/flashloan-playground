pragma solidity ^0.5.16;

import "./ERC3156FlashLenderInterface.sol";
import "./ERC3156FlashBorrowerInterface.sol";

// FlashloanBorrower is a simple flashloan Borrower implementation for testing
contract FlashloanBorrower is ERC3156FlashBorrowerInterface {
    function doFlashloan(
        address flashloanLender,
        address borrowToken,
        uint256 borrowAmount
    ) external {
        bytes memory data = abi.encode(cToken, borrowAmount);
        ERC3156FlashLenderInterface(flashloanLender).flashLoan(this, borrowToken, borrowAmount, data);
    }

    function onFlashLoan(
        address initiator,
        address token,
        uint256 amount,
        uint256 fee,
        bytes calldata data
    ) external returns (bytes32) {
        require(initiator == address(this), "FlashBorrower: Untrusted loan initiator");
        ERC20(borrowToken).approve(msg.sender, amount.add(fee));
        (address cToken, uint256 borrowAmount) = abi.decode(data, (address, uint256));
        // your logic is written here...
        return keccak256("ERC3156FlashBorrowerInterface.onFlashLoan");
    }
}
