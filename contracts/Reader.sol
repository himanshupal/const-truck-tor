// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.18;

contract Reader {
    constructor(address token, address[] memory accounts) {
        uint256[] memory balances = new uint256[](accounts.length);

        for (uint256 i; i < accounts.length; ) {
            (bool success, bytes memory r) = token.staticcall(abi.encodeWithSignature("balanceOf(address)", accounts[i]));
            require(success, "ext_call_failed");
            balances[i] = abi.decode(r, (uint256));
            unchecked {
                ++i;
            }
        }

        bytes memory returnData = abi.encode(balances);
        assembly "evmasm" {
            let s := add(returnData, 0x20)
            return(s, sub(msize(), s))
        }
    }
}
