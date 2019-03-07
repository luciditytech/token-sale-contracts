pragma solidity 0.5.0;


import "./Owned.sol";
import "./HumanStandardToken.sol";
import "./Locked.sol";

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Sales is Owned {
  address payable public wallet;
  HumanStandardToken public token;
  Locked public locked;
  uint public price;
  uint public startBlock;
  uint public freezeBlock;
  bool public frozen = false;
  uint256 public cap = 0;
  uint256 public sold = 0;
  uint created;

  event PurchasedTokens(address indexed purchaser, uint amount);

  modifier saleHappening {
    require(block.number >= startBlock, "block.number >= startBlock");
    require(block.number <= freezeBlock, "block.number <= freezeBlock");
    require(!frozen, "tokens are frozen");
    require(sold < cap, "tokens sold out");
    _;
  }

  constructor (
    address payable _wallet,
    uint256 _tokenSupply,
    string memory _tokenName,
    uint8 _tokenDecimals,
    string memory _tokenSymbol,
    uint _price,
    uint _startBlock,
    uint _freezeBlock,
    uint256 _cap,
    uint _locked
  ) public {
    /*
      TODO
      when locked tokens are transfer to Locked.address they are lost forever.
      then, when `unlockEscrow()` is called, transfer is made from totalSupply not from Locked.address
      as a result, totalSupply will have less tokens to sell by amount of locked tokens.
      Since we might not need this contract  anymore, I just leave this note.
      When we need it - this must be fixed.
    */
    wallet = _wallet;
    token = new HumanStandardToken(_tokenSupply, _tokenName, _tokenDecimals, _tokenSymbol);
    locked = new Locked(_locked);
    price = _price;
    startBlock = _startBlock;
    freezeBlock = _freezeBlock;
    cap = _cap;
    created = now;

    uint256 ownersValue = SafeMath.div(SafeMath.mul(token.totalSupply(), 20), 100);
    assert(token.transfer(wallet, ownersValue));

    uint256 saleValue = SafeMath.div(SafeMath.mul(token.totalSupply(), 60), 100);
    assert(token.transfer(address(this), saleValue));

    uint256 lockedValue = SafeMath.sub(token.totalSupply(), SafeMath.add(ownersValue, saleValue));
    assert(token.transfer(address(locked), lockedValue));
  }

  function purchaseTokens()
    public
    payable
    saleHappening
  {
    uint excessAmount = msg.value % price;
    uint purchaseAmount = SafeMath.sub(msg.value, excessAmount);
    uint tokenPurchase = SafeMath.div(purchaseAmount, price);

    require(tokenPurchase <= token.balanceOf(address(this)), "tokenPurchase <= token.balanceOf(this)");

    if (excessAmount > 0) {
      msg.sender.transfer(excessAmount);
    }

    sold = SafeMath.add(sold, tokenPurchase);
    assert(sold <= cap);
    wallet.transfer(purchaseAmount);
    assert(token.transfer(msg.sender, tokenPurchase));
    emit PurchasedTokens(msg.sender, tokenPurchase);
  }

  /* owner only functions */
  function changeBlocks(uint _newStartBlock, uint _newFreezeBlock) public
    onlyOwner {
    require(_newStartBlock != 0);
    require(_newFreezeBlock >= _newStartBlock);
    startBlock = _newStartBlock;
    freezeBlock = _newFreezeBlock;
  }

  function changePrice(uint _newPrice) public
    onlyOwner {
    require(_newPrice > 0);
    price = _newPrice;
  }

  function changeCap(uint256 _newCap) public
    onlyOwner {
    require(_newCap > 0);
    cap = _newCap;
  }

  function unlockEscrow() public
    onlyOwner {
    assert((now - created) > locked.period());
    assert(token.transfer(wallet, token.balanceOf(address(locked))));
  }

  function toggleFreeze() public
    onlyOwner {
      frozen = !frozen;
  }
}
