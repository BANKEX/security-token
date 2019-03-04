pragma solidity >=0.5.2;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";


contract CryptoYen is ERC20, ERC20Detailed, ERC20Mintable {
  event ReleaseDividendsRights(address indexed to, uint value);
  event AcceptDividends(uint value);

  constructor() ERC20Detailed("CryptoYen", "CYEN", 18) public {
  }

}