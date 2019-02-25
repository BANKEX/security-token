const SecurityTokenDraft = artifacts.require('SecurityTokenDraft');
const IdentityRegistry = artifacts.require('IdentityRegistry');
const DividendToken = artifacts.require('DividendToken');

module.exports = async function (deployer, network, accounts) {
    const operator = accounts[0];
    (async () => {
        deployer.then(async function () {
            let registry = await IdentityRegistry.new();
            await registry.addIdentity(operator, false, false);
            let token = await SecurityTokenDraft.new("TEST", "Test token", web3.utils.toWei("1000"), registry.address,
                "499", "499", "1999");
            
            let dividendToken = await  DividendToken.new("HTKN", "Hello token");

        });
    })();
};
