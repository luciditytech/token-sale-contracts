pragma solidity ^0.5.0;

import "contract-registry/contracts/storage/StorageBase.sol";

contract TokenStorage is StorageBase {

    /* This is a slight change to the ERC20 base standard.
    function totalSupply() constant returns (uint256 supply);
    is replaced with:
    uint256 public totalSupply;
    This automatically creates a getter function for the totalSupply.
    This is moved to the base contract since public getter functions are not
    currently recognised as an implementation of the matching abstract
    function by the compiler.
    */
    /// total amount of tokens
    uint256 public totalSupply;

    function setTotalSupply(uint256 _totalSupply)
    external
    onlyFromStorageOwner {
        totalSupply = _totalSupply;
    }
}
