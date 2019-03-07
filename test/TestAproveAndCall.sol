pragma solidity 0.5.0;

import "truffle/Assert.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../contracts/Salable.sol";

contract ApprovalReceiver {

  function receiveApproval(address _from) external {
    ERC20 token = ERC20(msg.sender);

    uint256 allowance = token.allowance(_from, address(this));
    require(token.transferFrom(_from, address(this), allowance), "transferFrom failed");
  }
}

contract TestAproveAndCall {

  Salable salable;
  ApprovalReceiver receiver;

  constructor () public {
    address payable _wallet = address(uint160(address(this)));
    uint256 _tokenSupply = 1000;
    string memory _tokenName = "name";
    uint8 _tokenDecimals = 9;
    string memory _tokenSymbol = "MAT";
    uint256 _price = 1;
    uint256 _startBlock = 0;
    uint256 _freezeBlock = 1000;
    uint256 _cap = 100;
    uint256 _lockedPeriod = 1;

    salable = new Salable(
      _wallet,
      _tokenSupply,
      _tokenName,
      _tokenDecimals,
      _tokenSymbol,
      _price,
      _startBlock,
      _freezeBlock,
      _cap,
      _lockedPeriod
    );

    receiver = new ApprovalReceiver();
  }

  function test_approveAndCall() public {
    Assert.equal(salable.balanceOf(address(receiver)), 0, "invalid initial receiver balance");
    Assert.isAbove(salable.balanceOf(address(this)), 0, "invalid this balance");

    salable.approveAndCall(address(receiver), 1);

    Assert.equal(salable.balanceOf(address(receiver)), 1, "invalid receiver balance");
  }
}
