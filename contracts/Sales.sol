pragma solidity ^0.5.0;

import "contract-registry/contracts/RegistrableWithSingleStorage.sol";

import "./interfaces/ISalesStorage.sol";
import "./interfaces/IHumanStandardToken.sol";
import "./HumanStandardTokenStorage.sol";
import "./Owned.sol";
import "./Locked.sol";

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Sales is Owned, RegistrableWithSingleStorage {

  using SafeMath for uint256;

  ISalesStorage sStorage;
  IHumanStandardToken public token;
  Locked public locked;

  address public humanStandardTokenStorage;

  event PurchasedTokens(address indexed purchaser, uint256 amount);

  modifier saleHappening {
    require(block.number >= sStorage.startBlock(), "block.number >= startBlock");
    require(block.number <= sStorage.freezeBlock(), "block.number <= freezeBlock");
    require(!sStorage.frozen(), "tokens are frozen");
    require(sStorage.sold() < sStorage.cap(), "tokens sold out");
    _;
  }

  constructor (
    uint256 _initialAmount,
    string memory _tokenName,
    uint8 _decimalUnits,
    string memory _tokenSymbol,

    address _wallet,
    uint256 _locked,
    IHumanStandardToken _token,
    address _registry,
    IStorageBase _salesStorage
  )
  public
  RegistrableWithSingleStorage(_registry, _salesStorage) {
    sStorage = ISalesStorage(address(_salesStorage));
    token = _token;
    require(sStorage.wallet() == _wallet, "token need to have same wallet");

    locked = new Locked(_locked);

    HumanStandardTokenStorage tokenStorage = new HumanStandardTokenStorage(
      _initialAmount,
      _tokenName,
      _decimalUnits,
      _tokenSymbol
    );
    humanStandardTokenStorage = address(tokenStorage);

    tokenStorage.initStorageOwner(address(this));

    uint256 ownersValue = _initialAmount.mul(20).div(100);
    tokenStorage.setBalance(_wallet, ownersValue);

    uint256 saleValue = _initialAmount.mul(60).div(100);
    tokenStorage.setBalance(address(this), saleValue);

    uint256 lockedValue = _initialAmount.sub(ownersValue.add(saleValue));
    tokenStorage.setBalance(address(locked), lockedValue);

    require(tokenStorage.switchOwnerTo(address(_token)), "switching owner for tokens storage failed");

    // DEBUG ONLY!
    require(_initialAmount == 10000000000000000, "_initialAmount == ");
    require(ownersValue == 2000000000000000, "ownersValue ==");
    require(saleValue == 6000000000000000, "saleValue ==");
    require(lockedValue == 2000000000000000, "lockedValue ==");

    require(tokenStorage.balances(_wallet)==ownersValue, "invalid ownersValue");
    require(tokenStorage.balances(address(this))==saleValue, "invalid saleValue");
    require(tokenStorage.balances(address(locked))==lockedValue, "invalid lockedValue");
  }

  function purchaseTokens()
    public
    payable
    saleHappening
  {
    uint256 excessAmount = msg.value % sStorage.price();
    uint256 purchaseAmount = SafeMath.sub(msg.value, excessAmount);
    uint256 tokenPurchase = SafeMath.div(purchaseAmount, sStorage.price());

    require(tokenPurchase <= token.balanceOf(address(this)), "tokenPurchase <= token.balanceOf(this)");

    if (excessAmount > 0) {
      msg.sender.transfer(excessAmount);
    }

    uint256 sold = sStorage.sold().add(tokenPurchase);
    sStorage.setSold(sold);
    assert(sold <= sStorage.cap());
    sStorage.wallet().transfer(purchaseAmount);
    assert(token.transfer(msg.sender, tokenPurchase));
    emit PurchasedTokens(msg.sender, tokenPurchase);
  }

  /* owner only functions */
  function changeBlocks(uint256 _newStartBlock, uint256 _newFreezeBlock) public
    onlyOwner {
    require(_newStartBlock != 0);
    require(_newFreezeBlock >= _newStartBlock);
    sStorage.setStartBlock(_newStartBlock);
    sStorage.setFreezeBlock(_newFreezeBlock);
  }

  function changePrice(uint256 _newPrice) public
    onlyOwner {
    require(_newPrice > 0);
    sStorage.setPrice(_newPrice);
  }

  function changeCap(uint256 _newCap) public
    onlyOwner {
    require(_newCap > 0);
    sStorage.setCap(_newCap);
  }

  function unlockEscrow() public
    onlyOwner {
    assert((now - sStorage.created()) > locked.period());
    assert(token.transfer(sStorage.wallet(), token.balanceOf(address(locked))));
  }

  function toggleFreeze() public
    onlyOwner {
    sStorage.toggleFrozen();
  }


  function startBlock() external view returns (uint256) {
    return sStorage.startBlock();
  }
  function freezeBlock() external view returns (uint256){
    return sStorage.freezeBlock();
  }
  function frozen() external view returns (bool){
    return sStorage.frozen();
  }
  function sold() external view returns (uint256){
    return sStorage.sold();
  }
  function cap() external view returns (uint256){
    return sStorage.cap();
  }
  function price() external view returns (uint256){
    return sStorage.price();
  }
  function wallet() external view returns (address payable){
    return sStorage.wallet();
  }
  function created() external view returns (uint256){
    return sStorage.created();
  }
}
