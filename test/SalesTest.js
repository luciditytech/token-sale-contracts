/* eslint-disable */
const Sales = artifacts.require('Sales');
const HumanStandardToken = artifacts.require('HumanStandardToken');


const fs = require('fs');
const BN = require('bn.js');
const conf = require('../conf/development');

const {
  moveForward, takeSnapshot, resetSnapshot, mineBlock,
} = require('./inc/helpers');

const getTotalSupply = function () {
  return new Promise(((resolve, reject) => {
    Sales
      .deployed()
      .then(instance => instance.token.call())
      .then(tokenAddr => HumanStandardToken.at(tokenAddr))
      .then(token => token.totalSupply.call())
      .then((result) => {
        resolve(result.toString());
      })
      .catch((err) => {
        reject(new Error(err));
      });
  }));
};

const getBalanceOf = function (address) {
  return new Promise(((resolve, reject) => {
    Sales
      .deployed()
      .then(instance => instance.token.call())
      .then(tokenAddr => HumanStandardToken.at(tokenAddr))
      .then(token => token.balanceOf.call(address))
      .then((result) => {
        resolve(result.toString());
      })
      .catch((err) => {
        reject(new Error(err));
      });
  }));
};

contract('Sales', (accounts) => {
  let instance;
  let snapshotId;
  const ownerAccount = accounts[0];
  const buyerAccount = accounts[1];

  beforeEach(() => {
    takeSnapshot()
      .then((_snapshotId) => {
        snapshotId = _snapshotId;

        return Sales
          .deployed()
          .then((_instance) => {
            instance = _instance;
          });
      });
  });

  afterEach(() => resetSnapshot(snapshotId));

  describe('when the contract was deployed', () => {
    it('should set the expected total supply', () => getTotalSupply()
      .then((result) => {
        assert.equal(result, conf.total);
      }));

    it('should set the expected number of tokens for the contract as owner', () => getBalanceOf(instance.address)
      .then((result) => {
        const bn = new BN(conf.total, 10);
        assert.equal(result, bn.mul(new BN(6, 10)).div(new BN(10, 10)).toString());
      }));

    it('should set the expected number of tokens for the owner', () => getBalanceOf(ownerAccount)
      .then((result) => {
        const bn = new BN(conf.total, 10);
        assert.equal(result, bn.mul(new BN(2, 10)).div(new BN(10, 10)).toString());
      }));

    it('should set the expected number of tokens in escrow', () => instance.locked.call()
      .then(address => getBalanceOf(address))
      .then((result) => {
        const bn = new BN(conf.total, 10);
        assert.equal(result, bn.mul(new BN(2, 10)).div(new BN(10, 10)).toString());
      }));
  });

  describe('a user tries to buy coins within the sale period', () => {
    let snapshotId;

    beforeEach(() => {
      const blockToMine = new BN(conf.startBlock, 10);
      return mineBlock(blockToMine);
    });

    describe('when there are enough tokens left', () => {
      it('should set the expected token balance', () => {
        // var wei = web3.toWei('0.0030', 'Ether');

        return instance
          .purchaseTokens({
            from: buyerAccount,
            value: new BN('10', 10).mul(new BN(conf.price, 10)),
          })
          .then(() => getBalanceOf(buyerAccount)
          )
          .then((result) => {
            assert.equal(result, 10);
          });
      });
    });

    describe('when the cap has been reached', () => {
      beforeEach(() => {
        const bn = new BN(conf.cap, 10).mul(new BN(conf.price, 10));
        return instance
          .purchaseTokens(
            {
              from: buyerAccount,
              value: bn.toString(10),
            },
          )
          .then(() => instance.sold.call())
          .then((sold) => {
            assert.equal(sold.toString(), conf.cap);
          });
      });

      it('should throw an exception', (done) => {
        const value = new BN('10', 10);

        instance
          .purchaseTokens({
            from: buyerAccount,
            value: value.mul(new BN(conf.price, 10)),
          })
          .then((res) => {
            assert(false, 'should throw');
          })
          .catch((err) => {
            assert.isDefined(err);
            done();
          })
          .then((res) => {
            assert(res === undefined);
          });
      });

      describe('when the cap is increased', () => {
        let blanceBefore;
        const tokenBought = 1000000000;

        beforeEach(() => {
          return instance
            .changeCap('300000000000000', {
              from: ownerAccount
            })
            .then(function() {
              return getBalanceOf(buyerAccount);
            }).then(b => {
              balanceBefore = new BN(b);
              const wei = new BN(tokenBought, 10).mul(new BN(conf.price, 10));

              return instance.purchaseTokens({
                from: buyerAccount,
                value:  wei.toString(10)
              });
            });
        });

        it('should set the expected token balance', () => {
          return getBalanceOf(buyerAccount)
            .then(function(result) {
              assert.equal(result, balanceBefore.add(new BN(tokenBought)).toString(10));
            })
        });
      });
    });
  });

  describe('a user tries to buy coins outside period', () => {
    describe('after the sale period', () => {
      beforeEach(() => {
        const blockToMine = new BN(conf.freezeBlock, 10).add(new BN('10', 10));
        return mineBlock(blockToMine);
      });

      it('should throw an exception', (done) => {
        const value = new BN('10', 10);

        instance
          .purchaseTokens({
            from: buyerAccount,
            value: value.mul(new BN(conf.price, 10)),
          })
          .then(() => getBalanceOf(buyerAccount))
          .catch((err) => {
            assert.isDefined(err);
            done();
          })
          .then((res) => {
            assert(res === undefined);
          });
      });
    });

    describe('before the sale period', () => {
      beforeEach(() => {
        const blockToMine = new BN(conf.startBlock, 10).sub(new BN('10', 10));
        return mineBlock(blockToMine);
      });

      it('should throw an exception', (done) => {
        const value = new BN('100', 10);

        instance
          .purchaseTokens({
            from: buyerAccount,
            value: value.mul(new BN(conf.price, 10)),
          })
          .then(() => getBalanceOf(buyerAccount))
          .catch((err) => {
            assert.isDefined(err);
            done();
          })
          .then((res) => {
            assert(res === undefined);
          });
      });
    });
  });

  describe('when an owner tries to unlock tokens in escrow', () => {
    describe('when the vesting period has not passed', () => {
      it('should throw an exception', (done) => {
        instance
          .unlockEscrow({
            from: ownerAccount,
          })
          .catch((err) => {
            assert.isDefined(err);
            done();
          })
          .then((res) => {
            assert(res === undefined);
          });
      });
    });

    describe('when the vesting period has passed', () => {
      beforeEach(() => moveForward(conf.locked));

      it('should set the expected token value', () => {
        return instance
          .unlockEscrow({
            from: ownerAccount,
          })
          .then(() => {
            return getBalanceOf(ownerAccount);
          })
          .then((result) => {
            // console.log('owner balance after unlock: ' + result);
            const bn = new BN(conf.total, 10);
            assert.equal(result, bn.mul(new BN(4, 10)).div(new BN(10, 10)).toString());
          });
      });
    });
  });
});
