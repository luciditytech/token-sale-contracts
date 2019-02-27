pragma solidity ^0.5.0;

import "./TokenStorage.sol";

contract StandardTokenStorage is TokenStorage {

    mapping (address => uint256) public balances;
    mapping (address => mapping (address => uint256)) public allowed;

    function setBalance(address _address, uint256 _balance)
    external
    onlyFromStorageOwner {
        balances[_address] = _balance;
    }

    function setAllowed(address _from, address _to, uint256 _value)
    external
    onlyFromStorageOwner {
        allowed[_from][_to] = _value;
    }
}
