//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract TweetTweet {

    //for front end
    event NewTweet(address indexed from, string message, uint timestamp);

    struct Tweet {
        address author;
        string message;
        uint timestamp;
    }

    Tweet[] public tweets;

    constructor() payable {
        console.log("Deploying contract");
    }

    function addTweet(string memory _message) public payable {
        require(msg.value == 0.0001 ether, "Need to pay 0.0001 ether to tweet!");

        Tweet memory tweet = Tweet(msg.sender, _message, block.timestamp);
        tweets.push(tweet);

        emit NewTweet(tweet.author, tweet.message, tweet.timestamp);
    }

    function getAllTweets() public view returns (Tweet[] memory) {
        return tweets;
    }

    function getTotalTweets() public view returns (uint) {
        return tweets.length;
    }
}
