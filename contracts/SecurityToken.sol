pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";


contract SecurityToken is ERC20 {
  string constant public symbol = "MOV";
  string constant public name = "\"MovieCoin\" project utility token";
  uint8 constant public decimals = 18;
  string constant public version = "1.0";

  constructor() public {
    uint256 totalSupply = 2000000000 * (10 ** uint256(decimals));
    _mint(msg.sender, totalSupply);
    emit Transfer(address(0), msg.sender, totalSupply);
  }
}
