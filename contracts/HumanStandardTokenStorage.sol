pragma solidity ^0.5.0;

import "./StandardTokenStorage.sol";

contract HumanStandardTokenStorage is StandardTokenStorage {

  /*
  NOTE:
  The following variables are OPTIONAL vanities. One does not have to include them.
  They allow one to customise the token contract & in no way influences the core functionality.
  Some wallets/interfaces might not even bother to look at this information.
  */
  string public name;                   //fancy name: eg Simon Bucks
  uint8 public decimals;                //How many decimals to show. ie. There could 1000 base units with 3 decimals. Meaning 0.980 SBX = 980 base units. It's like comparing 1 wei to 1 ether.
  string public symbol;                 //An identifier: eg SBX
  string public version = 'H0.1';       //human 0.1 standard. Just an arbitrary versioning scheme.

  constructor (
    uint256 _initialAmount,
    string memory _tokenName,
    uint8 _decimalUnits,
    string memory _tokenSymbol
  ) public {
    balances[msg.sender] = _initialAmount;               // Give the creator all initial tokens
    totalSupply = _initialAmount;                        // Update total supply
    name = _tokenName;                                   // Set the name for display purposes
    decimals = _decimalUnits;                            // Amount of decimals for display purposes
    symbol = _tokenSymbol;                               // Set the symbol for display purposes
  }
}
