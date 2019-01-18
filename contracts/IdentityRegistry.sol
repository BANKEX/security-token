pragma solidity >=0.5.2;
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


contract IdentityRegistry is Ownable {
  struct Identity {
    bool init;
    bool us;
    bool accredited;
  }
  
  mapping(address => Identity) public identities;
  mapping(address => address) public ids;

  function addIdentity(address id, bool us, bool accredited) public onlyOwner returns(bool) {
    require(!identities[id].init);
    identities[id] = Identity(true, us, accredited);
    return true;
  }

  function bindAddress(address account, address id) public onlyOwner returns(bool) {
    require(ids[account]==address(0));
    ids[account] = id;
    return true;
  }

  function getIdentity(address account) public view returns(address, bool, bool) {
    address id = ids[account];
    Identity storage i = identities[id];
    return (id, i.us, i.accredited);
  }

}
