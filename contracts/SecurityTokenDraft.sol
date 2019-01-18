pragma solidity >=0.5.2;
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./IIdentityRegistry.sol";


contract SecurityTokenDraft is ERC20 {
  using SafeMath for uint256;
  
  string public symbol;
  string public name;
  uint8 public decimals = 18;

  IIdentityRegistry private registry;

  uint counterUS;
  uint counterNotAccredited;
  uint counterTotal;
  
  uint limitUS;
  uint limitNotAccredited;
  uint limitTotal;

  mapping (address => uint) private _idbalances;

  constructor(string memory _symbol, string memory _name, uint256 _totalSupply, address _registry) public {
    name = _name;
    symbol = _symbol;
    registry = IIdentityRegistry(_registry);
    require(_secmint(msg.sender, _totalSupply));
    _mint(msg.sender, _totalSupply);
    emit Transfer(address(0), msg.sender, _totalSupply);
  }

  function _sectransfer(address from, address to, uint value) internal returns(bool) {
    (address fromId, bool fromUS, bool fromAccredited) = registry.getIdentity(from);
    (address toId, bool toUS, bool toAccredited) = registry.getIdentity(to);
    uint fromBalance = _idbalances[fromId];
    uint toBalance = _idbalances[toId];
    require(fromBalance >= value);
    require(fromUS || !toUS);


    if (fromBalance == value) {
      counterTotal -= 1;
      if (fromUS)
        counterUS -= 1;
      if (!fromAccredited)
        counterNotAccredited -= 1;
    }

    if (toBalance == 0) {
      counterTotal += 1;
      if (toUS)
        counterUS += 1;
      if (!toAccredited)
        counterNotAccredited += 1;
    }

    require(counterUS <= limitUS);
    require(counterNotAccredited <= limitNotAccredited);
    require(counterTotal <= limitTotal);

    _idbalances[fromId] = _idbalances[fromId].sub(value);
    _idbalances[toId] = _idbalances[toId].add(value);

    return true;
  }

  function _secmint(address to, uint value) internal returns(bool) {
    (address toId, bool toUS, bool toAccredited) = registry.getIdentity(to);
    uint toBalance = _idbalances[toId];

    if (toBalance == 0) {
      counterTotal += 1;
      if (toUS)
        counterUS += 1;
      if (!toAccredited)
        counterNotAccredited += 1;
    }

    require(counterUS <= limitUS);
    require(counterNotAccredited <= limitNotAccredited);
    require(counterTotal <= limitTotal);

    _idbalances[toId] = _idbalances[toId].add(value);
    return true;
  }

  /**
  * @dev Transfer token for a specified address
  * @param to The address to transfer to.
  * @param value The amount to be transferred.
  */
  function transfer(address to, uint256 value) public returns (bool) {
    require(_sectransfer(msg.sender, to, value));
    return super.transfer(to, value);
  }


  /**
    * @dev Transfer tokens from one address to another.
    * Note that while this function emits an Approval event, this is not required as per the specification,
    * and other compliant implementations may not emit the event.
    * @param from address The address which you want to send tokens from
    * @param to address The address which you want to transfer to
    * @param value uint256 the amount of tokens to be transferred
    */
  function transferFrom(address from, address to, uint256 value) public returns (bool) {
    require(_sectransfer(from, to, value));
    return super.transferFrom(from, to, value);
  }


}
