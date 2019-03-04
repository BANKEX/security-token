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


let sendTransactionEx = null;

function web3MonkeyPatch(web) {
  const min = (a,b) => (a<b) ? a : b;
  sendTransactionEx = async function(tx) {
    if (typeof(web3.eth.accounts.wallet[tx["from"]])==="undefined") 
      return await web3.eth.sendTransaction(tx)
    else {
      let account = web3.eth.accounts.wallet[tx["from"]];
      let nonce = await web3.eth.getTransactionCount(account.address);

      if (typeof(tx["gas"])==="undefined") tx["gas"] = await web3.eth.estimateGas(tx);
      if (typeof(tx["gasPrice"])==="undefined") tx["gasPrice"] = min(BigInt(await web3.eth.getGasPrice()), 20000000000n).toString();
      let tx_signed = await web3.eth.accounts.signTransaction(tx, account.privateKey);
      return await web3.eth.sendSignedTransaction(tx_signed.rawTransaction)
    }
  }
}

const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io"));
console.log(web3.version);
addWallets(web3, env.MNEMONIC);
web3MonkeyPatch(web3);

const erc20 = JSON.parse(fs.readFileSync("build/contracts/ERC20.json", "utf8"));

accounts=web3.eth.accounts.wallet;



(async ()=>{
  console.log(web3.utils.fromWei(await web3.eth.getBalance(accounts[0].address)));

  await sendTransactionEx({
    from:accounts[0].address, 
    to:accounts[1].address, 
    value:web3.utils.toWei("0.1"),
    data:""}); 
  console.log(web3.utils.fromWei(await web3.eth.getBalance(accounts[0].address)));
})()

//console.log(web3.eth.accounts.wallet.accounts[0]);

