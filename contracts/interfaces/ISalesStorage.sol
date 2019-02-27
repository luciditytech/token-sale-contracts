pragma solidity ^0.5.0;

interface ISalesStorage {
    function startBlock() external view returns (uint256);
    function freezeBlock() external view returns (uint256);
    function frozen() external view returns (bool);
    function sold() external view returns (uint256);
    function cap() external view returns (uint256);
    function price() external view returns (uint256);
    function wallet() external view returns (address payable);
    function created() external view returns (uint256);

    function setSold(uint256) external;
    function setStartBlock(uint256) external;
    function setFreezeBlock(uint256) external;
    function setPrice(uint256) external;
    function setCap(uint256) external;
    function toggleFrozen() external;
}
