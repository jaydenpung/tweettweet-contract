const main = async () => {
    const tweetContractFactory = await hre.ethers.getContractFactory("TweetTweet");
    const tweetContract = await tweetContractFactory.deploy({
        value: hre.ethers.utils.parseEther("0.001"), //optionally put some ether in the deployed contract
    });
    await tweetContract.deployed();
    console.log("Contract deployed at: ", tweetContract.address);

    // get contract balance
    let contractBalance = await hre.ethers.provider.getBalance(tweetContract.address);
    console.log("Contract balance:", hre.ethers.utils.formatEther(contractBalance));

    // get addresses from hardhat node
    const [owner, randomPersonOne, randomPersonTwo] = await hre.ethers.getSigners();
    console.log("Contract deployed by: ", owner.address);

    // add tweet
    let addTweetTxn = await tweetContract.addTweet("Hello this is the owner!"); // by owner
    await addTweetTxn.wait();
    console.log("Sent tweet!");

    addTweetTxn = await tweetContract.connect(randomPersonOne).addTweet("Hello this is randomPersonOne!");
    await addTweetTxn.wait();
    console.log("Sent tweet!");

    addTweetTxn = await tweetContract.connect(randomPersonTwo).addTweet("Hello this is randomPersonTwo!");
    await addTweetTxn.wait();
    console.log("Sent tweet!");

    // get tweets
    console.log("getting all tweets!");
    let allTweets = await tweetContract.getAllTweets();
    for (const i in allTweets) {
        console.log(allTweets[i]);
    }

    // get contract balance again
    contractBalance = await hre.ethers.provider.getBalance(tweetContract.address);
    console.log("Contract balance:", hre.ethers.utils.formatEther(contractBalance));
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