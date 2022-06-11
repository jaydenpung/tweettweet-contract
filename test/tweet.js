const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Tweet Contract", function () {
    describe("Add tweet", function () {
        it("Tweeting require payments", async function () {
            const [owner] = await ethers.getSigners();
            const tweetContractFactory = await ethers.getContractFactory("TweetTweet");
            const tweetContract = await tweetContractFactory.deploy();
            await tweetContract.deployed();

            /*
            *  Tweeting without payment should fail
            */
            let addTweetTxn = tweetContract.addTweet("Tweeting without payment!");
            expect(addTweetTxn).to.be.revertedWith("Need to pay 0.0001 ether to tweet!");

            /*
            *  Tweeting with payment should increase contract balance
            */
            // inital supply
            let initialSupply = await hre.ethers.provider.getBalance(tweetContract.address);
            const paymentAmount = "0.0001";
            const paymentAmountInWei = ethers.utils.parseEther(paymentAmount);
            const payment = {value: paymentAmountInWei};

            // tweet and send payment
            addTweetTxn = tweetContract.addTweet("Tweeting with payment!", payment);
            await addTweetTxn;

            //balance supply should increase
            let balanceSupply = await hre.ethers.provider.getBalance(tweetContract.address);
            expect(balanceSupply).equals(initialSupply + paymentAmountInWei, "Total supply did not increase as expected!");
        });
    });
});