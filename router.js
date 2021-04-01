require('dotenv').config(); //import dotenv keys
const Router = require('@koa/router');
const router = new Router();
const config = require('./config.json'); //import the contract ABI's

const Web3 = require('web3');
const web3 = new Web3(process.env.INFURA_URL); //a web3 instance

web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY);
const adminAddress = web3.eth.accounts.wallet[0];

//Web3 contract instances
const cTokens = {
    cBat: new web3.eth.Contract(
        config.cTokenAbi,
        config.cBatAddress
    ),
    cDai: new web3.eth.Contract(
        config.cTokenAbi,
        config.cDaiAddress
    ),
}

router.get ('/tokenBalance/:cToken/:address', async ctx =>{
    const cToken = cTokens[ctx.params.cToken];
    if(typeof cToken === undefined) {
        ctx.status = 400;
        ctx.body = {
            error: `cToken ${ctx.params.cToken} does not exist`
        };
        return;
    }

    try {
    const tokenBalance = await cToken
    .methods
    .balanceOfUnderlying(ctx.params.address).call();
    ctx.body = {
        cToken: ctx.params.cToken,
        address: ctx.params.address,
        tokenBalance
    }
}catch(e){
    console.log(e);
    ctx.status = 500;
    ctx.body = {
        error: "internal server error"
    }
}
});


router.get ('/cTokenBalance/:cToken/:address', async ctx =>{
    const cToken = cTokens[ctx.params.cToken];
    if(typeof cToken === undefined) {
        ctx.status = 400;
        ctx.body = {
            error: `cToken ${ctx.params.cToken} does not exist`
        };
        return;
    }

    try {
    const ctokenBalance = await cToken
    .methods
    .balanceOf(ctx.params.address).call();
    ctx.body = {
        cToken: ctx.params.cToken,
        address: ctx.params.address,
        ctokenBalance
    }
}catch(e){
    console.log(e);
    ctx.status = 500;
    ctx.body = {
        error: "internal server error"
    }
}
});


router.post('/mint/:cToken/:amount', async ctx =>{
    const cToken = cTokens[ctx.params.cToken];
    if(typeof cToken === undefined) {
        ctx.status = 400;
        ctx.body = {
            error: `cToken ${ctx.params.cToken} does not exist`
        };
        return;
    }

    const tokenAdress = await cToken
    .methods
    .underlying()
    .call();

    const token = new web3.eth.Contract(
        config.ERC20Abi,
        tokenAdress 
    );

    await token
    .methods
        approve(cToken.options.address, ctx.params.amount)
        .send({from: adminAddress});

    try {
    await cToken
    .methods
    .mint(ctx.params.address).send({from: adminAddress});
    ctx.body = {
        cToken: ctx.params.cToken,
        address: ctx.params.address,
        amountMinted: ctx.params.amount
    }
}catch(e){
    console.log(e);
    ctx.status = 500;
    ctx.body = {
        error: "internal server error"
    }
}
});


router.post('/redeem/:cToken/:amount', async ctx =>{
    const cToken = cTokens[ctx.params.cToken];
    if(typeof cToken === undefined) {
        ctx.status = 400;
        ctx.body = {
            error: `cToken ${ctx.params.cToken} does not exist`
        };
        return;
    }

    try {
    await cToken
    .methods
    .redeem(ctx.params.address)
    .send({from: adminAddress});
    ctx.body = {
        cToken: ctx.params.cToken,
        address: ctx.params.address,
        amountRedemeed: ctx.params.amount
    }
}catch(e){
    console.log(e);
    ctx.status = 500;
    ctx.body = {
        error: "internal server error"
    }
}
});
module.exports = router;