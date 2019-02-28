const SecurityTokenDraft = artifacts.require('SecurityTokenDraft');
const IdentityRegistry = artifacts.require('IdentityRegistry');
const DividendToken = artifacts.require('DividendToken');



module.exports = async function (deployer, network, accounts) {

    (async () => {
        // deployer.then(async function () {
        //     let operator = accounts[0];
        //     let registry = await IdentityRegistry.new();
        //     await registry.addIdentity(operator, false, false);
        //     let token = await SecurityTokenDraft.new("TEST", "Test token", web3.utils.toWei("1000"), registry.address,
        //         "499", "499", "1999");
            
        //     //let dividendToken = await  DividendToken.new("HTKN", "Hello token");
        //     console.log("#");
        //     console.log(registry.address)

        // });



    })();
    deployer.then(async function () {
        let accountA=accounts[0];
        let accountB=accounts[0];
        let accountC=accounts[0];
        let accountD=accounts[0];
        let accountE=accounts[0];
        


        let tokenA = await DividendToken.new(`tokenA`, `tokenA`, web3.utils.toWei("100"), {from:accountA});
        let tokenB = await DividendToken.new(`tokenB`, `tokenB`, web3.utils.toWei("100"), {from:accountB});
        let tokenC = await DividendToken.new(`tokenC`, `tokenC`, web3.utils.toWei("100"), {from:accountC});
        let tokenD = await DividendToken.new(`tokenD`, `tokenD`, web3.utils.toWei("100"), {from:accountD});
        console.log(`Deployed tokens:
    A(${tokenA.address}) ====> 
    B(${tokenB.address}) ====> D(${tokenD.address})
    C(${tokenC.address}) ====>

        `);
        //Transfer 30% to securitization contract
        await tokenA.transfer(tokenD.address, web3.utils.toWei("30"), {from:accountA});
        await tokenB.transfer(tokenD.address, web3.utils.toWei("30"), {from:accountB});
        await tokenC.transfer(tokenD.address, web3.utils.toWei("30"), {from:accountC});

        //send incoming funds to tokenA
        await web3.eth.sendTransaction({from:accountE, to:tokenA.address, value:web3.utils.toWei("1")});

        let dividendRights = await tokenA.dividendsRightsOf(tokenD.address);

        console.log(`Dividend rights for tokenD is ${web3.utils.fromWei(dividendRights)}.`);

        await tokenA.releaseDividendsRights(tokenD.address, dividendRights, {from:accountE});

        console.log(`Balance of tokenholder D before withdraw ${web3.utils.fromWei(await web3.eth.getBalance(accountD))}`);
        await tokenD.releaseDividendsRights(accountD,  await tokenD.dividendsRightsOf(accountD), {from:accountE});
        console.log(`Balance of tokenholder D after withdraw ${web3.utils.fromWei(await web3.eth.getBalance(accountD))}`);
        

            
    
    });
};
