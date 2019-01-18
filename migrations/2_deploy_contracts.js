const SecurityTokenDraft = artifacts.require('SecurityTokenDraft');
const IdentityRegistry = artifacts.require('IdentityRegistry');

module.exports = async function (deployer, network, accounts) {
    const operator = accounts[0];
    (async () => {
        deployer.then(async function() {
            let token = await SecurityTokenDraft.new("TEST", "Test token", web3.utils.toWei("1000"));
            let registry = await IdentityRegistry.new();
        });
    })();
};
