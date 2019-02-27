pragma solidity ^0.5.0;

contract Locked {
  uint256 public period;

  constructor (uint256 _period) public {
    period = _period;
  }
}
