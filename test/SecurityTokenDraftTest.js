const SecurityTokenDraft = artifacts.require("./SecurityTokenDraft.sol");
const IdentityRegistry = artifacts.require("./IdentityRegistry.sol");

let STO;
let IR;

const web3 = global.web3;

const tbn = v => web3.utils.toBN(v);
const fbn = v => v.toString();
const tw = v => web3.utils.toBN(v).mul(1e18);
const fw = v => web3._extend.utils.fromWei(v).toString();

const gasPrice = tw(3e-7);

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

contract('IdentityRegistry', (accounts) => {

    let contractOwner = accounts[0];
    let symbol = "TST";
    let name = "TEST";
    let totalSupply = tbn(1e20);
    let registry;
    let limitUS = tbn(5);
    let limitNotAccredited = tbn(2);
    let totalLimit = tbn(9);

    beforeEach(async function() {
        IR = await IdentityRegistry.new({from: contractOwner});

        symbol = "TST";
        name = "TEST";
        totalSupply = tbn(1e20);
        registry = IR.address;
        limitUS = tbn(5);
        limitNotAccredited = tbn(2);
        totalLimit = tbn(9);

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

            assert(checkContractOwner == contractOwner);
            assert(checkSymbol == symbol);
            assert(checkName == name);
            assert(checkTotalSupply.eq(totalSupply));
        });

        it("should transfer from contract owner", async function() {
            // let transferAmount = new Array(9)
            // console.log(transferAmount)
            //     // .map(() => {
            //     //     return getRandom(1, totalSupply);
            //     // });
            //
            //
            // for (let i = 1; i < accounts.length; i++) {
            //     let tx = await STO.transfer(accounts[i], transferAmount[i], {from: contractOwner, gasPrice: gasPrice});
            //     let gasUsed = tx.receipt.gasUsed;
            //     let gasCost = gasPrice.mul(gasUsed);
            // }
            //
            // console.log(tx)
        });

    });

    describe('NEGATIVE TEST', () => {

    });

    describe('INTEGRATION TEST', () => {

    });

});

