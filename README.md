# TweetTweet

Posting a tweet cost ether. Liking a tweet will also cost ether, and 50% of it goes to the author of the tweet. This contract uses Ownable from OpenZeppenlin, and owner can change the price of posting tweet and liking tweet.

To setup, create a .env with the following attributes:

```shell
ALCHEMY_API_URL=
WALLET_RINKEBY_KEY=
```

Try running some of the following tasks:

```shell
npx hardhat test
npx hardhat run scripts/deploy.js --network rinkeby
```
