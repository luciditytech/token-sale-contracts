const Sales = artifacts.require('Sales');
const HumanStandardToken = artifacts.require('HumanStandardToken');

const fs = require(`fs`);
const BN = require(`bn.js`);
const HttpProvider = require('ethjs-provider-http');
const EthRPC = require('ethjs-rpc');
const EthQuery = require('ethjs-query');
const ethRPC = new EthRPC(new HttpProvider('http://localhost:8545'));
const ethQuery = new EthQuery(new HttpProvider('http://localhost:8545'));

var mineBlock = function(blockNumber) {
  return new Promise((resolve, reject) => {
    if (!BN.isBN(blockNumber)) {
      return reject('not a valid block number');
    }

    return ethQuery.blockNumber()
      .then(function(blockNumber) {
        if (new BN(blockNumber, 10).lt(blockNumber)) {
          ethRPC.sendAsync({method: 'evm_mine'}, function(err) {
            if (err !== undefined && err !== null) { 
              reject(err);
            }

            resolve(forceMine(blockNumber));
          });
        } else {
          resolve();
        }
      });
  });
}

var getTotalSupply = function() {
  var promise = new Promise(function(resolve, reject) {
    Sales.deployed()
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
    Sales.deployed()
      .then(function (instance) {
        return instance.token.call();
      })
      .then(function (tokenAddr) {
        return HumanStandardToken.at(tokenAddr);
      })
      .then(function (token) {
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
      return Sales.deployed().then(function(_instance) {
        instance = _instance;
      }).then(function() {
        return getTotalSupply();
      }).then(function(result) {
        assert.equal(result, 1000000000000000000);
      });
    });

    it('should set the expected number of tokens for the owner', function() {
      return Sales.deployed().then(function(_instance) {
        instance = _instance;
      }).then(function() {
        return getBalanceOf(ownerAccount);
      }).then(function(result) {
        assert.equal(result, 0);
      });
    });
  });

  describe('a user tries to buy coins outside period', function() {
    beforeEach(function() {
      var blockToMine = new BN(conf['preSaleStartBlock'], 10)
        .sub(new BN('100', 10));

      return mineBlock(blockToMine);
    });

    describe('before the sale period', function() {
      it('should throw an exception', function(done) {
        Sales.deployed().then(function(_instance) {
          instance = _instance;
        }).then(function() {
          var value = new BN('100', 10);

          return instance.purchaseTokens({
            from: buyerAccount,
            value: value.mul(new BN(conf['price'], 10))
          });
        }).then(function() {
          return getBalanceOf(buyerAccount);
        }).catch(function(err) {
          assert.isDefined(err);
          done();
        }).then(function(res) {
          assert(res === undefined);
        });
      });
    });
  });
});
