const IdentityRegistry = artifacts.require("./IdentityRegistry.sol");
let IR;

const web3 = global.web3;

const tbn = v => web3.utils.toBN(v);
const fbn = v => v.toString();
const tw = v => web3.utils.toBN(v).mul(1e18);
const fw = v => web3._extend.utils.fromWei(v).toString();

contract('IdentityRegistry', (accounts) => {

    const contractOwner = accounts[0];

    beforeEach(async function() {
        IR = await IdentityRegistry.new({from: contractOwner});
    });

    describe('COMMON TEST', () => {
        it("should set identity from contract owner", async function() {
            // do it using loop for different existing situations
            const id = "0x524c994069630a5ddfe0216c571b5c80983d7fcb";
            const isUS = true;
            const isAccredited = true;

            assert(await IR.addIdentity(id, isUS, isAccredited, {from: contractOwner}));
        });

        it("should bind address from contract owner", async function() {


        });

        it("should getIdentity from any account", async function() {


        });
    });

    describe('NEGATIVE TEST', () => {
        it("try to execute set identity not from contract owner", async function() {
            const id = "0x524c994069630a5ddfe0216c571b5c80983d7fcb";
            const isUS = true;
            const isAccredited = true;
            try {
                for (let i = 1; i < accounts.length; i++) {
                    await IR.addIdentity(id, isUS, isAccredited, {from: accounts[i]});
                    console.log("ERROR!");
                }
            } catch (e) {
                assert(e);
            }
        });

        it("try to execute set identity using existing ID", async function() {
            const id = "0x524c994069630a5ddfe0216c571b5c80983d7fcb";
            const isUS = true;
            const isAccredited = true;
            await IR.addIdentity(id, isUS, isAccredited, {from: contractOwner});
            try {
                await IR.addIdentity(id, isUS, isAccredited, {from: contractOwner});
                console.log("ERROR!");
            } catch (e) {
                assert(e);
            }
        });

        it("try to execute set identity with bad argunents", async function() {


        });

        it("try to bind address not from contract owner", async function() {


        });

        it("try to re-bind address of existing account id", async function() {


        });

        it("try to bind address with bad arguments", async function() {


        });

        it("try to getIdentity with bad argument", async function() {


        });
    });

});

