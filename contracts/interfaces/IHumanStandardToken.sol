pragma solidity ^0.5.0;

interface IHumanStandardToken {
    function approveAndCall(address _spender, uint256 _value, bytes calldata _extraData) external returns (bool);

    //StandardToken
    function balances(address _address) external view returns (uint256);
    function allowed(address _from, address _to) external view returns (uint256);

    //Token
    function totalSupply() external view returns (uint256);
    function balanceOf(address _owner) external view returns (uint256);

    function transfer(address _to, uint256 _value) external returns (bool);
    function transferFrom(address _from, address _to, uint256 _value) external returns (bool);
    function approve(address _spender, uint256 _value) external returns (bool);
    function allowance(address _owner, address _spender) external view returns (uint256 remaining);

    function changeStorage(address _storage) external;
}
