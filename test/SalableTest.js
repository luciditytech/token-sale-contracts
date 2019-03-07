const BN = require('bn.js');
const BigNumber = require('bignumber.js');

const conf = require('../conf/development');

const deployedSalable = require('./inc/deployedSalable');

const {
  moveForward, takeSnapshot, resetSnapshot, mineBlock, mineToStartPurchase,
} = require('./inc/helpers');

const TWENTY = 20;
const SALE_PERCENT = 60;

contract('Salable', (accounts) => {
  let ministroSalable;
  let snapshotId;
  const ownerAccount = accounts[0];
  const buyerAccount = accounts[1];


  beforeEach(async () => {
    snapshotId = await takeSnapshot();
    ({ ministroSalable } = await deployedSalable(ownerAccount));
  });

  afterEach(async () => {
    await resetSnapshot(snapshotId);
  });

  describe('when the contract was deployed', async () => {
    it('should set the expected number of tokens in escrow', async () => {
      assert(BigNumber(conf.total).times(TWENTY).div(100).eq(await ministroSalable.lockedTokens()));
    });

    it('should set the expected total supply', async () => {
      assert(
        BigNumber(conf.total).times(100 - TWENTY).div(100).eq(await ministroSalable.totalSupply()),
      );
    });

    it('should set the expected number of tokens for the contract as owner', async () => {
      assert(BigNumber(conf.total).times(SALE_PERCENT).div(100).eq(
        await ministroSalable.balanceOf(ministroSalable.instance.address),
      ));
    });

    it('should set the expected number of tokens for the owner', async () => {
      assert(BigNumber(conf.total).times(TWENTY).div(100).eq(
        await ministroSalable.balanceOf(ownerAccount),
      ));
    });
  });

  describe('a user tries to buy coins within the sale period', async () => {
    beforeEach(async () => {
      await mineToStartPurchase();
    });

    describe('when there are enough tokens left', async () => {
      it('should be possible to buy', async () => {
        await ministroSalable.purchaseTokens({
          from: buyerAccount,
          value: conf.price,
        });
      });
    });

    describe('when the cap has been reached', async () => {
      beforeEach(async () => {
        const cap = BigNumber(conf.cap).div(2);
        await ministroSalable.changeCap(cap);
        const bn = BigNumber(cap).times(conf.price);
        await ministroSalable.purchaseTokens({ from: buyerAccount, value: bn.toString(10) });
        assert(BigNumber(cap).eq(await ministroSalable.sold()), 'invalid sold value');
      });

      it('should throw an exception', async () => {
        await ministroSalable.purchaseTokens({ from: buyerAccount, value: conf.price }, true);
      });

      describe('when the cap is increased', async () => {
        beforeEach(async () => {
          await ministroSalable.changeCap(conf.cap);
        });

        it('should be possible to buy tokens', async () => {
          await ministroSalable.purchaseTokens({
            from: buyerAccount,
            value: conf.price,
          });
        });
      });
    });
  });

  describe('a user tries to buy coins outside period', async () => {
    describe('before the sale period', async () => {
      it('should throw an exception', async () => {
        await ministroSalable.purchaseTokens({
          from: buyerAccount,
          value: conf.price,
        }, true);

        await mineToStartPurchase();
        await ministroSalable.purchaseTokens({
          from: buyerAccount,
          value: conf.price,
        });
      });
    });

    describe('after the sale period', async () => {
      beforeEach(async () => {
        const blockToMine = BigNumber(conf.freezeBlock);
        await mineBlock(new BN(blockToMine.toString(10), 10));
      });

      it('should throw an exception', async () => {
        await ministroSalable.purchaseTokens({
          from: buyerAccount,
          value: conf.price,
        }, true);
      });
    });
  });

  describe('when an owner tries to unlock tokens in escrow', async () => {
    describe('when the vesting period has not passed', async () => {
      it('should throw an exception', async () => {
        await ministroSalable.unlockEscrow({}, true);
      });
    });

    describe('when the vesting period has passed', async () => {
      beforeEach(async () => moveForward(conf.locked));

      it('should set the expected token value', async () => {
        await ministroSalable.unlockEscrow();
      });
    });
  });
});
