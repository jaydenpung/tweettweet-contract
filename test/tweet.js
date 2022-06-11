const { expect } = require("chai");
const { ethers } = require("hardhat");

// refer to https://hardhat.org/tutorial/testing-contracts

let owner;
let tweetContract;

// `beforeEach` will run before each test, re-deploying the contract every
// time. It receives a callback, which can be async.
beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const tweetContractFactory = await ethers.getContractFactory("TweetTweet");
    tweetContract = await tweetContractFactory.deploy();
});

describe("Tweet Contract", function () {
    describe("Add tweet", function () {
        it("Tweeting without payment", async function () {
            let addTweetTxn = tweetContract.addTweet("Tweeting without payment!");
            expect(addTweetTxn).to.be.revertedWith("Need to pay 0.0001 ether to tweet!");
        });
        it("Tweeting with payment", async function () {
            // inital supply
            let initialSupply = await hre.ethers.provider.getBalance(tweetContract.address);
            const paymentAmount = "0.0001";
            const paymentAmountInWei = ethers.utils.parseEther(paymentAmount);
            const payment = { value: paymentAmountInWei };

            // tweet and send payment
            addTweetTxn = tweetContract.addTweet("Tweeting with payment!", payment);
            await addTweetTxn;

            //balance supply should increase
            let balanceSupply = await hre.ethers.provider.getBalance(tweetContract.address);
            expect(balanceSupply).equals(initialSupply + paymentAmountInWei, "Total supply did not increase as expected!");
        })
    });
});