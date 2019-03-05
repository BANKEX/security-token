const DividendTokenAcceptingUtility = artifacts.require('DividendTokenAcceptingUtility');
const TokenMarketAcceptingUtility = artifacts.require('TokenMarketAcceptingUtility');
const CryptoYen = artifacts.require('CryptoYen');



module.exports = async function (deployer, network, accounts) {
    deployer.then(async function () {
 
        let deployerAccount = accounts[0];
        let userAccount = accounts.slice(1, 4);
        let investorAccount = accounts.slice(4, 7);

        
        console.log("distribute ether for users");

        for (let i=0; i<3; i++){
            if (BigInt(await web3.eth.getBalance(userAccount[i])) < BigInt(web3.utils.toWei("0.2"))) 
                await web3.eth.sendTransaction({from:deployerAccount, to:userAccount[i], value:web3.utils.toWei("0.2")});

            if (BigInt(await web3.eth.getBalance(investorAccount[i])) < BigInt(web3.utils.toWei("0.2"))) 
                await web3.eth.sendTransaction({from:deployerAccount, to:investorAccount[i], value:web3.utils.toWei("0.2")});
        }

        
        console.log("create contract cryptoYen");

        let cryptoYen = await CryptoYen.new({from:deployerAccount});
        for (let i=0; i<3; i++){
            cryptoYen.mint(investorAccount[i], web3.utils.toWei("100000000"), {from:deployerAccount});
        }

        await cryptoYen.mint(deployerAccount, web3.utils.toWei("100000000"), {from:deployerAccount});


        console.log("create contracts for assets");

        let assets = [];
        let funds = [];
        let assetMarkets = [];
        let fundMarkets = [];


        for (let i=0; i<3; i++)
        {
            let asset = await DividendTokenAcceptingUtility.new(`asset${i}`, `asset${i}`, web3.utils.toWei("100"), cryptoYen.address, {from:deployerAccount});
            let fund = await DividendTokenAcceptingUtility.new(`fund${i}`, `fund${i}`, web3.utils.toWei("100"), cryptoYen.address, {from:deployerAccount});
            await asset.transfer(userAccount[i], web3.utils.toWei("100"), {from:deployerAccount});
            await fund.transfer(investorAccount[i], web3.utils.toWei("100"), {from:deployerAccount});

            let assetMarket = await TokenMarketAcceptingUtility.new(cryptoYen.address, asset.address, userAccount[i], userAccount[i], web3.utils.toWei("1000000"), {from:deployerAccount});
            let fundMarket = await TokenMarketAcceptingUtility.new(cryptoYen.address, fund.address, investorAccount[i], investorAccount[i], web3.utils.toWei("1000000"), {from:deployerAccount});

            // allow to cycling the value up to 10 times during tranding
            await asset.increaseAllowance(assetMarket.address, web3.utils.toWei("1000"), {from:userAccount[i]});
            await cryptoYen.increaseAllowance(assetMarket.address, web3.utils.toWei("10000000"), {from:userAccount[i]});

            await fund.increaseAllowance(fundMarket.address, web3.utils.toWei("1000"), {from:investorAccount[i]});
            await cryptoYen.increaseAllowance(fundMarket.address, web3.utils.toWei("10000000"), {from:investorAccount[i]});

            assets.push(asset.address);
            funds.push(fund.address);
            assetMarkets.push(assetMarket.address);
            fundMarkets.push(fundMarket.address);
            
        }

        console.log("distribute tokens to funds");

        for (let i=0; i<3; i++)
        {
            let assetMarket = await TokenMarketAcceptingUtility.at(assetMarkets[i]);
            let asset = await DividendTokenAcceptingUtility.at(assets[i]);
            for (let j=0; j<3; j++) 
            {
                await cryptoYen.increaseAllowance(assetMarket.address, web3.utils.toWei("10000000"), {from:investorAccount[j]});
                await assetMarket.buy(web3.utils.toWei("10"), web3.utils.toWei("1000000"), {from:investorAccount[j]});
                await asset.transfer(funds[i], web3.utils.toWei("10"), {from:investorAccount[j]});
            }
        }




        // //flow from asset to investor
        // let asset0 = await DividendTokenAcceptingUtility.at(assets[0]);
        // let fund0 = await DividendTokenAcceptingUtility.at(funds[0]);
        
        // await cryptoYen.increaseAllowance(asset0.address, web3.utils.toWei("1000"), {from:deployerAccount});
        // await asset0.acceptDividends(deployerAccount, web3.utils.toWei("1000"), {from:deployerAccount});
        // let balance = await asset0.dividendsRightsOf(fund0.address);
        // console.log(web3.utils.fromWei(balance));
        // await asset0.releaseDividendsRights(fund0.address, balance, {from:deployerAccount});
        // await fund0.acceptDividends(asset0.address, balance, {from:deployerAccount});
        // balance = await fund0.dividendsRightsOf(investorAccount[0]);
        // console.log(web3.utils.fromWei(balance));
        // await fund0.releaseDividendsRights(investorAccount[0], balance, {from:deployerAccount});
        // console.log(web3.utils.fromWei(await cryptoYen.balanceOf(investorAccount[0])));
        // await cryptoYen.transferFrom(fund0.address, investorAccount[0], balance, {from:investorAccount[0]});
        // console.log(web3.utils.fromWei(await cryptoYen.balanceOf(investorAccount[0])));
        
        console.log(JSON.stringify({
            cryptoYen:cryptoYen.address,
            assets:assets,
            funds:funds,
            assetMarkets:assetMarkets,
            fundMarkets:fundMarkets,
            userAccount:userAccount,
            investorAccount:investorAccount,
            deployerAccount:deployerAccount,
            mnemonic:process.env.MNEMONIC 
        }, null, 4));


        


 
    
    });
};
