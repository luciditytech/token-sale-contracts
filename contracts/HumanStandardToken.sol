/*
This Token Contract implements the standard token functionality (https://github.com/ethereum/EIPs/issues/20) as well as the following OPTIONAL extras intended for use by humans.

In other words. This is intended for deployment in something like a Token Factory or Mist wallet, and then used by humans.
Imagine coins, currencies, shares, voting weight, etc.
Machine-based, rapid creation of many tokens would not necessarily need these extra features or will be minted in other manners.

1) Initial Finite Supply (upon creation one specifies how much is minted).
2) In the absence of a token registry: Optional Decimal, Symbol & Name.
3) Optional approveAndCall() functionality to notify a contract if an approval() has occurred.

.*/
pragma solidity ^0.5.0;

import "./interfaces/IHumanStandardTokenStorage.sol";
import "./interfaces/IHumanStandardToken.sol";
import "./StandardToken.sol";
import "./Owned.sol";

contract HumanStandardToken is IHumanStandardToken, Owned, StandardToken {

    IHumanStandardTokenStorage hstStorage;

    function () external {
        //if ether is sent to this address, send it back.
        revert();
    }

    constructor (
        address _registry,
        IStorageBase _storage
        )
    public
    StandardToken(_registry, _storage) {
        hstStorage = IHumanStandardTokenStorage(address(singleStorage));
    }

    function changeStorage(address _storage)
    external
    onlyOwner {
        require(_storage != address(0x0), "storage can't be empty");
        singleStorage = IStorageBase(_storage);
        hstStorage = IHumanStandardTokenStorage(_storage);
    }

    /* Approves and then calls the receiving contract */
    function approveAndCall(address _spender, uint256 _value, bytes calldata _extraData) external returns (bool) {
        hstStorage.setAllowed(msg.sender, _spender,  _value);
        emit Approval(msg.sender, _spender, _value);

        bool success;
        bytes memory ret;

        //call the receiveApproval function on the contract you want to be notified. This crafts the function signature manually so one doesn't have to include a contract in here just for this.
        //receiveApproval(address _from, uint256 _value, address _tokenContract, bytes _extraData)
        //it is assumed that when does this that the call *should* succeed, otherwise one would use vanilla approve instead.
        (success, ret) = _spender.call(abi.encodePacked(bytes4(bytes32(keccak256("receiveApproval(address,uint256,address,bytes)"))), msg.sender, _value, this, _extraData));
        if(!success) {
            revert();
        }
        return true;
    }
}
