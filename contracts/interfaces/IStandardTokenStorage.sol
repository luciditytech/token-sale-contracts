pragma solidity ^0.5.0;

interface IStandardTokenStorage {
    function balances(address) external view returns (uint256);
    function allowed(address, address) external view returns (uint256);

    function setBalance(address, uint256) external;
    function setAllowed(address, address, uint256) external;
}
