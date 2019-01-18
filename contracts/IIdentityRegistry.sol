pragma solidity >=0.5.2;

contract IIdentityRegistry {
  function addIdentity(address id, bool us, bool accredited) public returns(bool);
  function bindAddress(address account, address id) public returns(bool);

  function getIdentity(address account) public view returns(address, bool, bool);

}
