pragma solidity ^0.4.11;

import "./Owned.sol";
import "./HumanStandardToken.sol";

contract Sales is Owned {
  address public wallet;
  HumanStandardToken public token;
  uint public price;
  uint public startBlock;
  uint public freezeBlock;
  bool public frozen = false;
  uint256 cap = 0;
  uint256 sold = 0;

  event PurchasedTokens(address indexed purchaser, uint amount);

  modifier saleHappening {
    require(block.number >= startBlock);
    require(block.number <= freezeBlock);
    _;
  }

  function Sales(
    address _wallet,
    uint256 _tokenSupply,
    string _tokenName,
    uint8 _tokenDecimals,
    string _tokenSymbol,
    uint _price,
    uint _startBlock,
    uint _freezeBlock,
    uint _cap
  ) {
    wallet = _wallet;
    token = new HumanStandardToken(_tokenSupply, _tokenName, _tokenDecimals, _tokenSymbol);
    price = _price;
    startBlock = _startBlock;
    freezeBlock = _freezeBlock;
    cap = _cap;

    assert(token.transfer(this, token.totalSupply()));
    assert(token.balanceOf(this) == token.totalSupply());
    assert(token.balanceOf(this) == 10**18);
  }

  function purchaseTokens()
    payable
    saleHappening {
    uint excessAmount = msg.value % price;
    uint purchaseAmount = msg.value - excessAmount;
    uint tokenPurchase = purchaseAmount / price;

    require(tokenPurchase <= token.balanceOf(this));

    if (excessAmount > 0) {
      msg.sender.transfer(excessAmount);
    }

    wallet.transfer(purchaseAmount);
    assert(token.transfer(msg.sender, tokenPurchase));
    PurchasedTokens(msg.sender, tokenPurchase);
  }

  /* owner only functions */
  function changeBlocks(uint _newStartBlock, uint _newFreezeBlock)
    onlyOwner {
    require(_newStartBlock != 0);
    require(_newFreezeBlock >= _newStartBlock);
    startBlock = _newStartBlock;
    freezeBlock = _newFreezeBlock;
  }

  function changePrice(uint _newPrice) 
    onlyOwner {
    require(_newPrice > 0);
    price = _newPrice;
  }

  function changeCap(uint256 _newCap)
    onlyOwner {
    require(_newCap > 0);
    cap = _newCap;
  }

  function toggleFreeze()
    onlyOwner {
      frozen = !frozen;
  }
}
