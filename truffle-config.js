const env = process.env;
if (env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const HDWalletProvider = require('truffle-hdwallet-provider');



function generateKeysFromSeed(seed, count) {
  let bip39 = require("bip39");
  let hdkey = require('ethereumjs-wallet/hdkey');
  let hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(seed));
  let wallet_hdpath = "m/44'/60'/0'/0/";

  let accounts = [];
  for (let i = 0; i < count; i++) {

      let wallet = hdwallet.derivePath(wallet_hdpath + i).getWallet();
      let address = '0x' + wallet.getAddress().toString("hex");
      let privateKey = wallet.getPrivateKey().toString("hex");
      accounts.push(privateKey);
  }

  return accounts;
}

module.exports = {
  compilers: {
    solc: {
      version: "0.5.2",          
      settings: {
        optimizer: {
          enabled: true,
          runs: 200   
        }
      }
    }
  },
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*', // eslint-disable-line camelcase
    },
    ropsten: {
      provider: new HDWalletProvider(process.env.MNEMONIC, "https://ropsten.infura.io/", 0, 10),
      network_id: 3, // eslint-disable-line camelcase
    },
    coverage: {
      host: 'localhost',
      network_id: '*', // eslint-disable-line camelcase
      port: 8555,
      gas: 0xfffffffffff,
      gasPrice: 0x01,
    },
    testrpc: {
      host: 'localhost',
      port: 8545,
      network_id: '*', // eslint-disable-line camelcase
    },
    ganache: {
      host: 'localhost',
      port: 8545,
      network_id: '*', // eslint-disable-line camelcase
    },
    rinkeby: {
      provider: new HDWalletProvider(process.env.MNEMONIC, "https://rinkeby.infura.io/", 0, 10),
      network_id: 4,
    },
    sokol: {
      provider: new HDWalletProvider(process.env.MNEMONIC, "https://sokol.poa.network/", 0, 10),
      network_id: "*" // Match any network id
    }
  },
};
