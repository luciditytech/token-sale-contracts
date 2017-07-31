const Sales = artifacts.require('Sales');
const HumanStandardToken = artifacts.require('HumanStandardToken');

const fs = require(`fs`);
const BN = require(`bn.js`);
const HttpProvider = require('ethjs-provider-http');
const EthRPC = require('ethjs-rpc');
const EthQuery = require('ethjs-query');
const ethRPC = new EthRPC(new HttpProvider('http://localhost:8545'));
const ethQuery = new EthQuery(new HttpProvider('http://localhost:8545'));

var takeSnapshot = function() {
  return new Promise((resolve, reject) => {
    ethRPC.sendAsync({method: 'evm_snapshot'}, function(err, res) {
      if (err !== undefined && err !== null) { 
        reject(err);
      }

      var id = parseInt(res, 16);
      resolve(id);
    });
  });
}

var resetSnapshot = function(id) {
  return new Promise((resolve, reject) => {
    ethRPC.sendAsync({method: 'evm_revert', params: [id]}, function(err) {
      if (err !== undefined && err !== null) { 
        reject(err);
      }

      // console.log(err);
      resolve();
    });
  });
}

var mineBlock = function(newBlockNumber) {
  return new Promise((resolve, reject) => {
    if (!BN.isBN(newBlockNumber)) {
      return reject('not a valid block number');
    }

    return ethQuery.blockNumber()
      .then(function(blockNumber) {
        if (new BN(blockNumber, 10).lt(newBlockNumber)) {
          ethRPC.sendAsync({method: 'evm_mine'}, function(err) {
            if (err !== undefined && err !== null) { 
              reject(err);
            }

            resolve(mineBlock(newBlockNumber));
          });
        } else {
          resolve();
        }
      });
  });
}

var getTotalSupply = function() {
  var promise = new Promise(function(resolve, reject) {
    Sales
      .deployed()
      .then(function (instance) {
        return instance.token.call();
      })
      .then(function (tokenAddr) {
        return HumanStandardToken.at(tokenAddr);
      })
      .then(function (token) {
        return token.totalSupply.call()
      })
      .then(function (result) {
        resolve(result.toNumber());
      })
      .catch(function(err) { 
        reject(new Error(err));
      });
  });

  return promise;
}

var getBalanceOf = function(address) {
  var promise = new Promise(function(resolve, reject) {
    Sales
      .deployed()
      .then(function (instance) {
        return instance.token.call();
      })
      .then(function(tokenAddr) {
        return HumanStandardToken.at(tokenAddr);
      })
      .then(function(token) {
        return token.balanceOf.call(address)
      })
      .then(function (result) {
        resolve(result.toNumber());
      })
      .catch(function(err) { 
        reject(new Error(err));
      });
  });

  return promise;
}

contract('Sales', function(accounts) {
  var instance;
  var ownerAccount = accounts[0];
  var buyerAccount = accounts[1];
  var conf = JSON.parse(fs.readFileSync('./conf/development.json'));

  describe('when the contract was deployed', function() {
    it('should set the expected number of tokens', function() {
      return Sales.deployed()
        .then(function(_instance) {
          instance = _instance;
        })
        .then(function() {
          return getTotalSupply();
        })
        .then(function(result) {
          assert.equal(result, 1000000000000000000);
        });
    });

    it('should set the expected number of tokens for the contract as owner', function() {
      return Sales
        .deployed()
        .then(function(_instance) {
          instance = _instance;
        })
        .then(function() {
          return getBalanceOf(instance.address);
        })
        .then(function(result) {
          assert.equal(result, 1000000000000000000);
        });
    });
  });

  describe('a user tries to buy coins within the sale period', function() {
    var snapshotId;

    beforeEach(function() {
      return takeSnapshot()
        .then(function(_snapshotId) {
          snapshotId = _snapshotId;
          var blockToMine = new BN(conf['startBlock'], 10);
          return mineBlock(blockToMine);
        });
    });

    afterEach(function() {
      return resetSnapshot(snapshotId);
    });

    describe('when there are enough tokens left', function() {
      it('should set the expect eth balance', function() {
        return Sales
          .deployed()
          .then(function(_instance) {
            instance = _instance;
          })
          .then(function() {
            var value = new BN('10', 10);

            return instance.purchaseTokens({
              from: buyerAccount,
              value: value.mul(new BN(conf['price'], 10))
            });
          })
          .then(function() {
            return getBalanceOf(buyerAccount);
          })
          .then(function(result) {
            assert.equal(result, 10);
          });
      });
    });
  });

  describe('a user tries to buy coins outside period', function() {
    var snapshotId;

    describe('after the sale period', function() {
      beforeEach(function() {
        return takeSnapshot()
          .then(function(_snapshotId) {
            snapshotId = _snapshotId;

            var blockToMine = new BN(conf['freezeBlock'], 10)
              .add(new BN('10', 10));

            return mineBlock(blockToMine);
          });
      });

      afterEach(function() {
        return resetSnapshot(snapshotId);
      });

      it('should throw an exception', function(done) {
        Sales
          .deployed()
          .then(function(_instance) {
            instance = _instance;
          })
          .then(function() {
            var value = new BN('10', 10);
  
            return instance.purchaseTokens({
              from: buyerAccount,
              value: value.mul(new BN(conf['price'], 10))
            });
          })
          .then(function() {
            return getBalanceOf(buyerAccount);
          })
          .catch(function(err) {
            assert.isDefined(err);
            done();
          })
          .then(function(res) {
            assert(res === undefined);
          });
      });
    });

    describe('before the sale period', function() {
      beforeEach(function() {
        return takeSnapshot()
          .then(function(_snapshotId) {
            snapshotId = _snapshotId;

            var blockToMine = new BN(conf['startBlock'], 10)
              .sub(new BN('10', 10));

            return mineBlock(blockToMine);
          });
      });

      afterEach(function() {
        return resetSnapshot(snapshotId);
      });

      it('should throw an exception', function(done) {
        Sales
          .deployed()
          .then(function(_instance) {
            instance = _instance;
          })
          .then(function() {
            var value = new BN('100', 10);
  
            return instance.purchaseTokens({
              from: buyerAccount,
              value: value.mul(new BN(conf['price'], 10))
            });
          })
          .then(function() {
            return getBalanceOf(buyerAccount);
          })
          .catch(function(err) {
            assert.isDefined(err);
            done();
          })
          .then(function(res) {
            assert(res === undefined);
          });
      });
    });
  });
});
