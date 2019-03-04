const DividendTokenAcceptingUtility = artifacts.require('DividendTokenAcceptingUtility');
const TokenMarketAcceptingUtility = artifacts.require('TokenMarketAcceptingUtility');
const CryptoYen = artifacts.require('CryptoYen');



module.exports = async function (deployer, network, accounts) {
    deployer.then(async function () {
 
        let deployerAccount = accounts[0];
        let userAccount = accounts.slice(1, 4);
        let investorAccount = accounts.slice(4, 7);

        
        //distribute ether for users

        // for (let i=0; i<3; i++){
        //     await web3.eth.sendTransaction({from:deployerAccount, to:userAccount[i], value:web3.utils.toWei("0.5")});
        //     await web3.eth.sendTransaction({from:deployerAccount, to:investorAccount[i], value:web3.utils.toWei("0.5")});
        // }

        
        //create contracts

        let cryptoYen = await CryptoYen.new();
        for (let i=0; i<3; i++){
            cryptoYen.mint(investorAccount[i], web3.utils.toWei("100000000"));
        }

        cryptoYen.mint(deployerAccount, web3.utils.toWei("100000000"));


        let assets = []
        let funds = []
        let markets = [] 

        for (let i=0; i<3; i++)
        {
            let asset = await DividendTokenAcceptingUtility.new(`asset{$i}`, `asset{$i}`, web3.utils.toWei("100"), cryptoYen.address);
            let fund = await DividendTokenAcceptingUtility.new(`fund{$i}`, `fund{$i}`, web3.utils.toWei("100"), cryptoYen.address);
            let market = await TokenMarketAcceptingUtility.new(cryptoYen.address, fund.address, deployerAccount, deployerAccount, web3.utils.toWei("1000000"));
            await fund.increaseAllowance(market.address, web3.utils.toWei("100"));
            assets.push(asset.address);
            funds.push(fund.address);
            markets.push(market.address);
            await asset.transfer(userAccount[i], web3.utils.toWei("70"));
        }

        for (let i=0; i<3; i++)
        {
            let asset = await DividendTokenAcceptingUtility.at(assets[i]);
            for (let j=0; j<3; j++) 
            {
                await asset.transfer(funds[j], web3.utils.toWei("10"));
            }
        }



        // buy out token by investors
        for (let i=0; i<3; i++)
        {
            let market = await TokenMarketAcceptingUtility.at(markets[i]);
            await cryptoYen.increaseAllowance(market.address, web3.utils.toWei("100000000"), {from: investorAccount[i]});
            await market.exchange(web3.utils.toWei("100"), web3.utils.toWei("1000000"), {from: investorAccount[i]});
        }
        


        //flow from asset to investor
        // let asset0 = await DividendTokenAcceptingUtility.at(assets[0]);
        // let fund0 = await DividendTokenAcceptingUtility.at(funds[0]);
        
        // await cryptoYen.increaseAllowance(asset0.address, web3.utils.toWei("1000"));
        // await asset0.acceptDividends(deployerAccount, web3.utils.toWei("1000"));
        // let balance = await asset0.dividendsRightsOf(fund0.address);
        // await asset0.releaseDividendsRights(fund0.address, balance);
        // await fund0.acceptDividends(asset0.address, balance);
        // balance = await fund0.dividendsRightsOf(investorAccount[0]);
        // await fund0.releaseDividendsRights(investorAccount[0], balance);
        // console.log(web3.utils.fromWei(await cryptoYen.balanceOf(investorAccount[0])));
        // await cryptoYen.transferFrom(fund0.address, investorAccount[0], balance, {from:investorAccount[0]});
        // console.log(web3.utils.fromWei(await cryptoYen.balanceOf(investorAccount[0])));
        
        console.log(JSON.stringify({
            assets:assets,
            funds:funds,
            markets:markets,
            userAccount:userAccount,
            investorAccount:investorAccount,
            deployerAccount:deployerAccount,
            mnemonic:process.env.MNEMONIC 
        }, null, 4));


        


 
    
    });
};
