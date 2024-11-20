// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interface/IERC20.sol";
import "./interface/IBTCSwap.sol";

contract OffGridBTCSwap {
    IBTCSwap private immutable usdcToBTC;
    IERC20 private immutable erc20Token;
    address private immutable swapContractAddress;
    address private immutable erc20Address;

    event SwapInitiated(address indexed user, uint256 amountIn, uint256 amountOut, address indexed to);
    event CCMReceive(
        uint32 srcChain,
        bytes srcAddress,
        bytes message,
        address token,
        uint256 amount,
        string tcMemo
    );
    event Call(address indexed sender);

    constructor(address _swapContractAddress, address _tokenAddress) {
        swapContractAddress = _swapContractAddress;
        erc20Address = _tokenAddress;
        usdcToBTC = IBTCSwap(_swapContractAddress);
        erc20Token = IERC20(_tokenAddress);
    }

    function xSwapToken(
        uint32 dstChain,
        bytes calldata dstAddress,
        uint32 dstToken,
        uint256 amount,
        bytes calldata cfParameters
    ) external {
        // Ensure the source token is the ERC20 token specified in the constructor
        IERC20 srcToken = erc20Token;
     
        // Check the allowance
        uint256 allowance = srcToken.allowance(msg.sender, address(this));
        require(allowance >= amount, "ERC20: transfer amount exceeds allowance");

        // Transfer the tokens from the user to the swap contract
        require(srcToken.transferFrom(msg.sender, address(this), amount), "USDC transfer failed");

        // Approve the swap contract to transfer the specified amount of tokens
        srcToken.approve(swapContractAddress, amount);

        // Call the Chainflip Vault contract to initiate the swap
        (bool success,) = swapContractAddress.call(
            abi.encodeWithSignature(
                "xSwapToken(uint32,bytes,uint32,address,uint256,bytes)",
                dstChain,
                dstAddress,
                dstToken,
                address(srcToken),
                amount,
                cfParameters
            )
        );
        
        require(success, "Chainflip swap failed");

        emit SwapInitiated(msg.sender, amount, 0, address(uint160(bytes20(dstAddress))));
    }

    receive() external payable {}

    string public name;

    function cfReceive(
        uint32 srcChain,
        bytes calldata srcAddress,
        bytes calldata message,
        address token,
        uint256 amount
    ) external payable {
        // Ensure that only the Chainflip Vault contract can call this function
        require(msg.sender == swapContractAddress, "Unauthorized caller");
        
        emit Call(msg.sender);
        name = abi.decode(message, (string));
        emit CCMReceive(
            srcChain,
            srcAddress,
            message,
            token,
            amount,
            abi.decode(message, (string))
        );
    }
}
