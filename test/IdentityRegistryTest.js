const IdentityRegistry = artifacts.require("./IdentityRegistry.sol");
let IR;

const web3 = global.web3;

const tbn = v => web3.toBigNumber(v);
const fbn = v => v.toString();
const tw = v => web3.toBigNumber(v).mul(1e18);
const fw = v => web3._extend.utils.fromWei(v).toString();

contract('IdentityRegistry', (accounts) => {

    const contractOwner = accounts[0];

    beforeEach(async function() {
        IR = await IdentityRegistry.new({from: contractOwner});
    });

    describe('COMMON TEST', () => {
        it("should set identity by contract owner", async function() {
            const id = "0x524c994069630a5ddfe0216c571b5c80983d7fcb";
            const isUS = true;
            const isAccredited = true;

            assert(IR.addIdentity(id, isUS, isAccredited, {from: contractOwner}));
        });
    });

    describe('NEGATIVE TEST', () => {


    });

});

