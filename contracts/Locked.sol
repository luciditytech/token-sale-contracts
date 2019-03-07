pragma solidity 0.5.0;

contract Locked {
  uint public period;

  constructor (uint _period) public {
    period = _period;
  }
}
