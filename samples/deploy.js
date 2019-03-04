const args = require("args-parser")(process.argv);
const Web3 = require("web3");
const fs = require("fs");

const env = process.env;
if (env.NODE_ENV !== 'production') {
  require('dotenv').load();
}


function addWallets(web3, seed) {
  let bip39 = require("bip39");
  let hdkey = require('ethereumjs-wallet/hdkey');
  let hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(seed));
  let wallet_hdpath = "m/44'/60'/0'/0/";


  for (let i = 0; i < 10; i++) {
      let wallet = hdwallet.derivePath(wallet_hdpath + i).getWallet();
      let privateKey = wallet.getPrivateKey().toString("hex");
      web3.eth.accounts.wallet.add(web3.eth.accounts.privateKeyToAccount("0x"+privateKey));
  }
}

const web3 = new Web3(new Web3.providers.HttpProvider("http://rinkeby.infura.io"));
addWallets(web3, env.MNEMONIC);


//console.log(web3.eth.accounts.wallet.accounts[0]);

