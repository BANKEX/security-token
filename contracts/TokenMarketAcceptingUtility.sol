pragma solidity >=0.5.2;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/math/Math.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./ERC20Interface.sol";


contract TokenMarketAcceptingUtility is Ownable {
  using SafeMath for uint;

  ERC20Interface public utility;
  ERC20Interface public security;
  
  address public securityStorage;
  address public utilityStorage;
  uint public price;
  
  uint constant DECIMAL_MULTIPLIER = 1e18;

  constructor(address utility_, address security_, address securityStorage_, address utilityStorage_, uint price_) public {
    utility = ERC20Interface(utility_);
    security = ERC20Interface(security_);
    securityStorage = securityStorage_;
    utilityStorage = utilityStorage_;
    price = price_;
  }

  function updatePrice(uint price_) public onlyOwner {
    price = price_;
  }

  function securityBalance() public view returns(uint) {
    return Math.min(security.allowance(securityStorage, address(this)), security.balanceOf(securityStorage));
  }

  function exchange(uint securityAmount, uint price_) public returns(bool) {
    require(price_ == price);
    require(securityAmount <= securityBalance());
    uint utilityAmount = securityAmount.mul(price).div(DECIMAL_MULTIPLIER);
    require(utility.transferFrom(msg.sender, utilityStorage, utilityAmount));
    require(security.transferFrom(securityStorage, msg.sender, securityAmount));
    return true;
  }


}