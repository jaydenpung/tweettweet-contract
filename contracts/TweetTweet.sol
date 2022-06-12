//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TweetTweet is Ownable {

    //for front end
    event NewTweet(address indexed from, string message, uint timestamp);

    struct Tweet {
        uint id;
        address author;
        string message;
        uint timestamp;
        uint likeCount;
    }

    uint private tweetIdCounter;
    Tweet[] public tweets;
    uint public addTweetPrice; //setting it public will create getter which can be called with contractname.addTweetPrice()
    uint public likeTweetPrice;

    constructor() payable {
        //console.log("Deploying contract");
        addTweetPrice = 0.0001 ether;
        likeTweetPrice = 1000 wei;
    }

    function setAddTweetPrice(uint priceInWei) external onlyOwner() {
        addTweetPrice = priceInWei;
    }

    function setLikeTweetPrice(uint priceInWei) external onlyOwner() {
        likeTweetPrice = priceInWei;
    }

    function addTweet(string memory _message) public payable {
        require(msg.value == addTweetPrice, "Insufficient payment to add a tweet!");

        Tweet memory tweet = Tweet(tweetIdCounter++, msg.sender, _message, block.timestamp, 0);
        tweets.push(tweet);

        emit NewTweet(tweet.author, tweet.message, tweet.timestamp);
    }

    function likeTweet(uint tweetId) public payable {
        require(msg.value == 1000 wei, "Insufficient payment to like a tweet!");
        Tweet storage selectedTweet = tweets[tweetId];

        // if like count reach max, we don't want it to overflow and fail
        if (selectedTweet.likeCount < type(uint256).max) {
            selectedTweet.likeCount++;
        }

        address targetWallet = selectedTweet.author;
        (bool success, ) = (targetWallet).call{value: 1000 * 0.5}("");

        require(success, "Failed to transfer amount to author!");
    }

    function getAllTweets() public view returns (Tweet[] memory) {
        return tweets;
    }

    function getTotalTweets() public view returns (uint) {
        return tweets.length;
    }
}
