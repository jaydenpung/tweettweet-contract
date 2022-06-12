const main = async () => {
    const tweetContractFactory = await hre.ethers.getContractFactory("TweetTweet");
    const tweetContract = await tweetContractFactory.deploy();
    await tweetContract.deployed();
    console.log("Contract deployed at: ", tweetContract.address);
};

const runMain = async () => {
    try {
        await main();
        process.exit(0); // exit Node process without error
    } catch (error) {
        console.log(error);
        process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
    }
};

runMain();