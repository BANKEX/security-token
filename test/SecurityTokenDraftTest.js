const SecurityTokenDraft = artifacts.require("./SecurityTokenDraft.sol");
const IdentityRegistry = artifacts.require("./IdentityRegistry.sol");
const truffleAssert = require('truffle-assertions');

let STO;
let IR;

const web3 = global.web3;

const tbn = v => web3.utils.toBN(v);
const fbn = v => v.toString();
const tw = v => web3.utils.toWei(v.toString());
const fw = v => web3.utils.fromWei(v.toString());

const gasPrice = tw("0.0000003");

function getRandom(min, max) {
    return (Math.random() * (max - min) + min).toFixed();
}

contract('SecurityTokenDraft', (accounts) => {
    let _limitUS = 5;
    let _limitNotAccredited = 4;
    let _limitTotal = 9;

    let contractOwner = accounts[0];
    let symbol = "TST";
    let name = "TEST";
    let totalSupply = tbn(1e20);
    let registry;
    let limitUS = tbn(_limitUS);
    let limitNotAccredited = tbn(_limitNotAccredited);
    let totalLimit = tbn(_limitTotal);

    async function Transfer(address){

        let transferAmount = new Array(accounts.length);

        let totalTransferedAmount = tbn(0);
        for (let i = 1; i < transferAmount.length; i++) {
            let val = getRandom(1, totalSupply/accounts.length);
            totalTransferedAmount = totalTransferedAmount.add(tbn(val));
            transferAmount[i] = val;
        }

        let balancesBefore = new Array(accounts.length);
        for (let i = 0; i < accounts.length; i++) {
            balancesBefore[i] = await STO.balanceOf(accounts[i]);
        }

        for (let i = 1; i < accounts.length; i++) {
            await STO.transfer(accounts[i], transferAmount[i], {from: address, gasPrice: gasPrice});
        }

        let balancesAfter = new Array(accounts.length);

        for (let i = 0; i < accounts.length; i++) {
            balancesAfter[i] = await STO.balanceOf(accounts[i]);
        }

        assert.equal(balancesBefore[0].toString(), balancesAfter[0].add(totalTransferedAmount).toString());
        for (let i = 1; i < accounts.length; i++) {
            assert.equal(balancesAfter[i].toString(), transferAmount[i].toString());
        }

    }

    function GenerateAccountsList() {
        return [[accounts[1], true, true],
                [accounts[2], true, false],
                [accounts[3], false, false],
                [accounts[4], false, true]];
    }

    beforeEach(async function() {
        IR = await IdentityRegistry.new({from: contractOwner});
        await IR.addIdentity(contractOwner, true, false);
        await IR.bindAddress(contractOwner, contractOwner);

        symbol = "TST";
        name = "TEST";
        totalSupply = tbn(1e20);
        registry = IR.address;
        limitUS = tbn(_limitUS);
        limitNotAccredited = tbn(_limitNotAccredited);
        totalLimit = tbn(_limitTotal);

        STO = await SecurityTokenDraft.new(
            symbol,
            name,
            totalSupply,
            registry,
            limitUS,
            limitNotAccredited,
            totalLimit,
            {from: contractOwner}
        );
    });

    describe('COMMON TEST', () => {

        it("should check: If input parameters were set", async function() {
            let checkContractOwner = await IR.owner();
            let checkSymbol = await STO.symbol();
            let checkName = await STO.name();
            let checkTotalSupply = await STO.totalSupply();

            assert.equal(checkContractOwner, contractOwner);
            assert.equal(checkSymbol, symbol);
            assert.equal(checkName, name);
            assert(checkTotalSupply.eq(totalSupply));
        });

        it("should transfer from contract owner", async function() {
            await Transfer(contractOwner);
        });

        it("should transfer not from contract owner", async function() {
            // revert now
            // await Transfer(accounts[1]);
        });

    });

    describe('NEGATIVE TEST', () => {
        it("should overflow limitTotal", async function() {
            for (let i = 1; i <= _limitTotal; i++) {
                await IR.addIdentity(accounts[i], false, true);
                await IR.bindAddress(accounts[i], accounts[i]);
            }
            for (let i = 1; i < _limitTotal; i++) {
                await STO.transfer(accounts[i], tbn(1), {from: contractOwner, gasPrice: gasPrice});
            }

            await truffleAssert.fails(STO.transfer(accounts[_limitTotal], tbn(1), {from: contractOwner, gasPrice: gasPrice}));
        });

        it("should overflow limitNotAccredited", async function() {
            for (let i = 1; i <= _limitNotAccredited; i++) {
                await IR.addIdentity(accounts[i], false, false);
                await IR.bindAddress(accounts[i], accounts[i]);
            }
            for (let i = 1; i < _limitNotAccredited; i++) {
                await STO.transfer(accounts[i], tbn(1), {from: contractOwner, gasPrice: gasPrice});
            }
            await truffleAssert.fails(STO.transfer(accounts[_limitNotAccredited], tbn(1), {from: contractOwner, gasPrice: gasPrice}));
        });

        it("should overflow limitUS", async function() {
            for (let i = 1; i <= _limitUS; i++) {
                await IR.addIdentity(accounts[i], true, true);
                await IR.bindAddress(accounts[i], accounts[i]);
            }
            for (let i = 1; i < _limitUS; i++) {
                await STO.transfer(accounts[i], tbn(1), {from: contractOwner, gasPrice: gasPrice});
            }
            await truffleAssert.fails(STO.transfer(accounts[_limitUS], tbn(1), {from: contractOwner, gasPrice: gasPrice}));
        });

        it("should failed when transfer amount < allowed (transfer)", async function() {
            await truffleAssert.fails(STO.transfer(accounts[0], -1, {from: contractOwner, gasPrice: gasPrice}))
        });

        it("should failed when transfer amount < allowed (transferFrom)", async function() {
            await IR.addIdentity(accounts[1], false, false);
            await IR.bindAddress(accounts[1], accounts[1]);

            await STO.approve(accounts[1], tbn(2), {from: contractOwner, gasPrice: gasPrice});
            await STO.transferFrom(contractOwner, accounts[1], tbn(2), {from: accounts[1], gasPrice: gasPrice});

            await STO.approve(accounts[1], tbn(2), {from: contractOwner, gasPrice: gasPrice});
            await truffleAssert.fails(STO.transferFrom(contractOwner, accounts[1], tbn(3), {from: accounts[1], gasPrice: gasPrice}));
        });

        it("should failed when transfer from not US to US", async function() {
            await STO.transfer(accounts[2], tbn(1), {from: contractOwner, gasPrice: gasPrice})
            await IR.addIdentity(accounts[1], true, true);
            await IR.bindAddress(accounts[1], accounts[1]);
            await truffleAssert.fails(STO.transfer(accounts[1], tbn(1), {from: accounts[2], gasPrice: gasPrice}));
        });
    });

    describe('INTEGRATION TEST', () => {
        it("should transfer from different accounts", async function() {
            // have to addIdentity for different account and transfer
            let options = GenerateAccountsList()

            for(let i=0;i<options.length;i++) {
                let account = options[i][0]
                let isUS = options[i][1]
                let isAccredited = options[i][2]
                await IR.addIdentity(account, isUS, isAccredited, {from: contractOwner});
                await IR.bindAddress(account, account, {from: contractOwner});
            }

            // transfer
            for(let i=0;i<options.length;i++) {
                let account = options[i][0];
                await STO.transfer(account, tbn(1), {from: contractOwner});
            }
        });

        it("should transferFrom from different accounts", async function() {
            // have to addIdentity for different account and transfer
            let options = GenerateAccountsList()

            for(let i=0;i<options.length;i++) {
                let account = options[i][0]
                let isUS = options[i][1]
                let isAccredited = options[i][2]
                await IR.addIdentity(account, isUS, isAccredited, {from: contractOwner});
                await IR.bindAddress(account, account, {from: contractOwner});
            }

            // transfer
            for(let i=0;i<options.length;i++) {
                let account = options[i][0];
                await STO.approve(account, tbn(1), {from: contractOwner, gasPrice: gasPrice});
                await STO.transferFrom(contractOwner, account, tbn(1), {from: account});
            }
        });
    });

});
