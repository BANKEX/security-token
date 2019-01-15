const SecurityToken = artifacts.require('SecurityToken');

module.exports = async function (deployer) {
    deployer.deploy(SecurityToken);
};
