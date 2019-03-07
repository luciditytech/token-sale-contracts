pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "./Owned.sol";

contract Salable is Owned, ERC20 {

  using SafeMath for uint256;

  /*
    NOTE:
    The following variables are OPTIONAL vanities. One does not have to include them.
    They allow one to customise the token contract & in no way influences the core functionality.
    Some wallets/interfaces might not even bother to look at this information.
    */
  string public name;                   //fancy name: eg Simon Bucks
  uint8 public decimals;                //How many decimals to show. ie. There could 1000 base units with 3 decimals. Meaning 0.980 SBX = 980 base units. It's like comparing 1 wei to 1 ether.
  string public symbol;                 //An identifier: eg SBX

  address payable public wallet;
  uint256 public lockedTokens;
  uint256 public lockedPeriod;
  uint256 public price;
  uint256 public startBlock;
  uint256 public freezeBlock;
  bool public frozen;
  uint256 public cap;
  uint256 public sold;
  uint256 public created;

  event PurchasedTokens(address indexed purchaser, uint256 amount);

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
    uint256 _price,
    uint256 _startBlock,
    uint256 _freezeBlock,
    uint256 _cap,
    uint256 _lockedPeriod
  ) public {
    require(_wallet != address(0x0), "_wallet is empty");
    wallet = _wallet;
    uint256 twentyPercent = _tokenSupply.mul(20).div(100);
    lockedTokens = twentyPercent;

    _mint(address(this), _tokenSupply - twentyPercent);
    _transfer(address(this), _wallet, twentyPercent);

    name = _tokenName;
    decimals = _tokenDecimals;
    symbol = _tokenSymbol;

    lockedPeriod = _lockedPeriod;
    price = _price;
    startBlock = _startBlock;
    freezeBlock = _freezeBlock;
    cap = _cap;
    created = now;
  }

  function purchaseTokens()
  external
  payable
  saleHappening
  {
    uint256 excessAmount = msg.value % price;
    uint256 purchaseAmount = msg.value.sub(excessAmount);
    uint256 tokenPurchase = purchaseAmount.div(price);

    require(tokenPurchase > 0, "send value too low to buy token");

    if (excessAmount > 0) {
      msg.sender.transfer(excessAmount);
    }

    uint256 soldAmount = sold.add(tokenPurchase);
    require(soldAmount <= cap, "can't buy more than cap value");
    sold = soldAmount;

    wallet.transfer(purchaseAmount);
    _transfer(address(this), msg.sender, tokenPurchase);
    emit PurchasedTokens(msg.sender, tokenPurchase);
  }

  /* owner only functions */
  function changeBlocks(uint256 _newStartBlock, uint256 _newFreezeBlock)
  external
  onlyOwner {
    require(_newStartBlock != 0, "_newStartBlock != 0");
    require(_newFreezeBlock >= _newStartBlock, "_newFreezeBlock >= _newStartBlock");
    startBlock = _newStartBlock;
    freezeBlock = _newFreezeBlock;
  }

  function changePrice(uint256 _newPrice)
  external
  onlyOwner {
    require(_newPrice > 0, "_newPrice > 0");
    price = _newPrice;
  }

  function changeCap(uint256 _newCap)
  external
  onlyOwner {
    require(_newCap >= 0, "_newCap >= 0");
    cap = _newCap;
  }

  function unlockEscrow()
  external
  onlyOwner {
    require((now - created) > lockedPeriod, "locking period time did not pass");
    _mint(wallet, lockedTokens);
    lockedTokens = 0;
  }

  function toggleFreeze()
  external
  onlyOwner {
    frozen = !frozen;
  }

  function approveAndCall(address _approvalReceiver, uint256 _value)
  external
  returns (bool) {
    approve(_approvalReceiver, _value);

    bool success;

    // signature: bytes4(bytes32(keccak256("receiveApproval(address)")))
    (success, ) = _approvalReceiver.call(abi.encodeWithSelector(bytes4(0x0db18e37), msg.sender));
    require(success, "_token.call.receiveApproval(address) failed");

    return true;
  }
}
