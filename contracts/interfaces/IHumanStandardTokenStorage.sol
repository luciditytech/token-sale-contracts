pragma solidity ^0.5.0;

interface IHumanStandardTokenStorage {
    // StandardTokenStorage
    function balances(address) external view returns (uint256);
    function allowed(address, address) external view returns (uint256);

    function setBalance(address, uint256) external;
    function setAllowed(address, address, uint256) external;

    // TokenStorage
    function totalSupply() external view returns (uint256);
    function setTotalSupply(uint256) external;
}
