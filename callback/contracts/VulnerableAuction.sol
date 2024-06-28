// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableAuction {
    address public highestBidder;
    uint public highestBid;
    string private flag;

    constructor() {
        flag = readFlag();
    }

    function bid() public payable {
        require(msg.value > highestBid, "Bid not high enough");
        if (highestBidder != address(0)) {
            (bool success, ) = highestBidder.call{value: highestBid}("");
            require(success, "Refund failed");
        }
        highestBidder = msg.sender;
        highestBid = msg.value;
    }

    function readFlag() internal view returns (string memory) {
        // This function simulates reading the flag from a file
        return "flag{this_is_a_test_flag}";
    }

    function getFlag() public view returns (string memory) {
        require(msg.sender == highestBidder, "Not the highest bidder");
        return flag;
    }

    fallback() external payable {
        bid();
    }
}
