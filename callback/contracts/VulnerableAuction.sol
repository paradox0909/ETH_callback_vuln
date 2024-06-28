// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableAuction {
    address public highestBidder;
    uint public highestBid;

    event FlagRequested(address indexed requester);

    function bid() public payable {
        require(msg.value > highestBid, "Bid not high enough");

        if (highestBidder != address(0)) {
            (bool success, ) = highestBidder.call{value: highestBid}("");
            require(success, "Refund failed");
        }

        highestBidder = msg.sender;
        highestBid = msg.value;
    }

    function requestFlag() public {
        require(msg.sender == highestBidder, "Not the highest bidder");
        emit FlagRequested(msg.sender);
    }

    fallback() external payable {
        bid();
    }
}
