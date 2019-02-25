pragma solidity >=0.5.2;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";


contract DividendToken is ERC20Detailed, ERC20 {
  event ReleaseDividendsRights(address indexed to, uint value);
  event AcceptDividends(uint value);

  constructor(string memory name, string memory symbol) ERC20Detailed(name, symbol, 18) public{
  }


  mapping (address => uint) private _dividendsRightsFix;
  uint private _dividendsPerToken;
  uint constant DECIMAL_MULTIPLIER = 1e18;
  uint constant INT256_MAX = 1 << 255 - 1;

  function dividendsRightsOf(address owner) public view returns (uint) {
    return _dividendsRightsOf(owner);
  }

  function _dividendsRightsOf(address owner) internal view returns (uint) {
    uint rights = _dividendsPerToken * balanceOf(owner) / DECIMAL_MULTIPLIER + _dividendsRightsFix[owner];
    return int(rights) < 0 ? 0 : rights;
  }


  function _releaseDividendsRights(address payable to, uint value) internal returns(bool) {
    uint dividendsRights = _dividendsRightsOf(to);
    require(dividendsRights >= value);
    _dividendsRightsFix[to] -= value;
    to.transfer(value);
    emit ReleaseDividendsRights(to, value);
    return true;
  }


  function releaseDividendsRights(address payable to, uint value) public returns(bool) {
    return _releaseDividendsRights(to, value);
  }




 /**
   * @dev Update dividends rights fix
   * @param _from address The address which you want to send tokens from
   * @param _to address The address which you want to transfer to
   * @param _value uint the amount of tokens to be transferred
   */
  function _dividendsRightsFixUpdate(address _from, address _to, uint _value) private {
    if (_from != _to) {
      uint _balanceFrom = balanceOf(_from);
      uint _balanceTo = balanceOf(_to);
      _dividendsRightsFix[_from] += _dividendsPerToken * _balanceFrom / DECIMAL_MULTIPLIER - 
        _dividendsPerToken * (_balanceFrom - _value) / DECIMAL_MULTIPLIER;
      _dividendsRightsFix[_to] += _dividendsPerToken * _balanceTo / DECIMAL_MULTIPLIER - 
        _dividendsPerToken * (_balanceTo + _value) / DECIMAL_MULTIPLIER; 
    }
  }

  /**
  * @dev transfer token for a specified address
  * @param to The address to transfer to.
  * @param value The amount to be transferred.
  */
  function transfer(address to, uint value) public returns (bool) {
    _dividendsRightsFixUpdate(msg.sender, to, value);
    _transfer(msg.sender, to, value);
    return true;
  }


  /**
   * @dev Transfer tokens from one address to another
   * @param _from address The address which you want to send tokens from
   * @param _to address The address which you want to transfer to
   * @param _value uint the amount of tokens to be transferred
   */
  function transferFrom(address _from, address _to, uint _value) public returns (bool) {
    _dividendsRightsFixUpdate(_from, _to, _value);
    ERC20.transferFrom(_from, _to, _value);
    return true;
  }



  function () external payable {
    require(totalSupply() > 0);
    _dividendsPerToken = _dividendsPerToken.add(msg.value.mul(DECIMAL_MULTIPLIER)/totalSupply());
    require(_dividendsPerToken.mul(totalSupply()) <= INT256_MAX);
    emit AcceptDividends(msg.value);
  }
}




