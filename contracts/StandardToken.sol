/*
You should inherit from StandardToken or, for a token like you would want to
deploy in something like Mist, see HumanStandardToken.sol.
(This implements ONLY the standard functions and NOTHING else.
If you deploy this, you won't have anything useful.)

Implements ERC 20 Token standard: https://github.com/ethereum/EIPs/issues/20
.*/
pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./interfaces/IStandardTokenStorage.sol";
import "./Token.sol";

contract StandardToken is Token {

    using SafeMath for uint256;

    constructor(address _registry, IStorageBase _storage)
    public
    Token(_registry, _storage) {}

    function transfer(address _to, uint256 _value) public returns (bool) {
        IStandardTokenStorage stStorage = IStandardTokenStorage(address(singleStorage));

        //Default assumes totalSupply can't be over max (2^256 - 1).
        //If your token leaves out totalSupply and can issue more tokens as time goes on, you need to check if it doesn't wrap.
        //Replace the if with this one instead.
        //if (balances[msg.sender] >= _value && balances[_to] + _value > balances[_to]) {
        if (stStorage.balances(msg.sender) >= _value && _value > 0) {
            stStorage.setBalance(msg.sender, stStorage.balances(msg.sender).sub(_value));
            stStorage.setBalance(_to, stStorage.balances(_to).add(_value));
            emit Transfer(msg.sender, _to, _value);
           return true;
        } else { return false; }
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        IStandardTokenStorage stStorage = IStandardTokenStorage(address(singleStorage));

        //same as above. Replace this line with the following if you want to protect against wrapping uints.
        //if (balances[_from] >= _value && allowed[_from][msg.sender] >= _value && balances[_to] + _value > balances[_to]) {
        if (stStorage.balances(_from) >= _value && stStorage.allowed(_from, msg.sender) >= _value && _value > 0) {
            stStorage.setBalance(_to, stStorage.balances(_to).add(_value));
            stStorage.setBalance(_from, stStorage.balances(_from).sub(_value));
            stStorage.setAllowed(_from, msg.sender, stStorage.allowed(_from, msg.sender).sub(_value));
            emit Transfer(_from, _to, _value);
            return true;
        } else { return false; }
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return IStandardTokenStorage(address(singleStorage)).balances(_owner);
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        IStandardTokenStorage(address(singleStorage)).setAllowed(msg.sender, _spender, _value);
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
      return IStandardTokenStorage(address(singleStorage)).allowed(_owner, _spender);
    }

    function balances(address _address) external view returns (uint256) {
        return IStandardTokenStorage(address(singleStorage)).balances(_address);
    }

    function allowed(address _from, address _to) external view returns (uint256) {
        return IStandardTokenStorage(address(singleStorage)).allowed(_from, _to);
    }
}
