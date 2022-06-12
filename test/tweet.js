const { expect } = require("chai");
const { ethers } = require("hardhat");

// refer to https://hardhat.org/tutorial/testing-contracts

let owner;
let randomOne;
let tweetContract;
const tweetPaymentAmountInWei = ethers.utils.parseEther("0.0001");
const likeTweetPaymentAmountInWei = ethers.utils.parseUnits("1000", "wei");

// `beforeEach` will run before each test, re-deploying the contract every
// time. It receives a callback, which can be async.
beforeEach(async function () {
    [owner, randomOne] = await ethers.getSigners();
    const tweetContractFactory = await ethers.getContractFactory("TweetTweet");
    tweetContract = await tweetContractFactory.deploy();

    // have some tweets from the start
    const payment = { value: tweetPaymentAmountInWei };
    await tweetContract.addTweet("Tweet by owner with id 0!", payment);
    await tweetContract.connect(randomOne).addTweet("Tweet by randomOne with id 1!", payment);
});

describe("Tweet Contract", function () {
    describe("Add tweet", function () {
        it("Tweeting without payment", async function () {
            let addTweetTxn = tweetContract.addTweet("Tweeting without payment!");
            expect(addTweetTxn).to.be.revertedWith("Insufficient payment to tweet!");
        });

        it("Tweeting with payment", async function () {
            // inital supply
            let initialSupply = await hre.ethers.provider.getBalance(tweetContract.address);

            // tweet and send payment
            const payment = { value: tweetPaymentAmountInWei };
            addTweetTxn = tweetContract.addTweet("Tweeting with payment!", payment);
            await addTweetTxn;

            //balance supply should increase
            let balanceSupply = await hre.ethers.provider.getBalance(tweetContract.address);
            expect(balanceSupply).equals(tweetPaymentAmountInWei.add(initialSupply), "Total supply did not increase as expected!");
        })
    });

    describe("Like tweet", function () {
        it("Like tweet without payment", async function () {
            let likeTweetTxn = tweetContract.likeTweet(1); // owner liking the second tweet by randomOne
            expect(likeTweetTxn).to.be.revertedWith("Insufficient payment to like a tweet!");
        })

        it("Like tweet with payment", async function () {
            // get balance of random one before transaction
            let initialBalance = await hre.ethers.provider.getBalance(randomOne.address);

            const payment = { value: likeTweetPaymentAmountInWei };
            await tweetContract.likeTweet(1, payment); // owner liking the second tweet by randomOne
            let balance = await hre.ethers.provider.getBalance(randomOne.address);

            // author of the tweet (randomOne) should get the payment
            expect(balance).equals(initialBalance.add(likeTweetPaymentAmountInWei * 0.5));
        })
    })

    describe("Set add and like tweet prices", function () {
        it("Owner set add tweet price", async function () {
            await tweetContract.setAddTweetPrice(100);
            expect(await tweetContract.addTweetPrice()).to.be.equals(100);
        })

        it("Not Owner set add tweet price", async function () {
            let transaction = tweetContract.connect(randomOne).setAddTweetPrice(100);
            expect(transaction).to.be.revertedWith("Ownable: caller is not the owner");
        })

        it("Owner set like tweet price", async function () {
            await tweetContract.setLikeTweetPrice(100);
            expect(await tweetContract.likeTweetPrice()).to.be.equals(100);
        })

        it("Not Owner set like tweet price", async function () {
            let transaction = tweetContract.connect(randomOne).setLikeTweetPrice(100);
            expect(transaction).to.be.revertedWith("Ownable: caller is not the owner");
        })
    })
});