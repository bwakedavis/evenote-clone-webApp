#

A Nodejs API for a DeFi app that interacts with compound protocol.

Interacts with the cDai and cBat tokens.

Client - API - Compound Protocol.

Uses Koajs,@koa/router, web3js, dotenv npm modules

Uses infura as an Ethereum node

create ```.env``` file and add
you can generate a private key from 
[Vanity-eth](https://vanity-eth.tk/)

```env
INFURA_URL = infura mainnet url

PRIVATE_KEY = address private key

```

This address has some cDai / Dai:

 ```bash
 0x0d0289e9f3eae696fa38e86fc4456228dc1792a7 
 ```

You can find other addresses like this on Etherscan:

+ Search for the contract of cDai
+ Search the last transactions, inspect the sending address, and it should have some dai/cDai
You can try out the API like this:

```bash
curl http://localhost:3000/tokenBalance/cDai/0x0d0289e9f3eae696fa38e86fc4456228dc1792a7
curl http://localhost:3000/cTokenBalance/cDai/0x0d0289e9f3eae696fa38e86fc4456228dc1792a7
```
