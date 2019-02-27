pragma solidity ^0.5.0;

interface ITokenStorage {
    function totalSupply() external view returns (uint256);
    function setTotalSupply(uint256) external;
}
