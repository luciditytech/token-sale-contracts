pragma solidity ^0.5.0;

import "contract-registry/contracts/storage/StorageBase.sol";
import "./interfaces/IHumanStandardToken.sol";

contract SalesStorage is StorageBase {

    address payable public wallet;

    uint256 public price;
    uint256 public startBlock;
    uint256 public freezeBlock;
    bool public frozen = false;
    uint256 public cap = 0;
    uint256 public sold = 0;
    uint256 public created;

    constructor (
        address payable _wallet,
        uint256 _price,
        uint256 _startBlock,
        uint256 _freezeBlock,
        uint256 _cap
    ) public {
        wallet = _wallet;
        price = _price;
        startBlock = _startBlock;
        freezeBlock = _freezeBlock;
        cap = _cap;
        created = now;
    }

    function setSold(uint256 _sold) external onlyFromStorageOwner {
        sold = _sold;
    }

    function setStartBlock(uint256 _startBlock) external onlyFromStorageOwner {
        startBlock = _startBlock;
    }

    function setFreezeBlock(uint256 _startBlock) external onlyFromStorageOwner {
        startBlock = _startBlock;
    }

    function setPrice(uint256 _price) external onlyFromStorageOwner {
        price = _price;
    }

    function setCap(uint256 _cap) external onlyFromStorageOwner {
        cap = _cap;
    }
    function toggleFrozen() external onlyFromStorageOwner {
        frozen = !frozen;
    }
}
