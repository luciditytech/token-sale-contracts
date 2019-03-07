const BN = require('bn.js');

const HttpProvider = require('ethjs-provider-http');
const EthRPC = require('ethjs-rpc');
const EthQuery = require('ethjs-query');
const CONF = require('../../conf/development');

const ethRPC = new EthRPC(new HttpProvider('http://localhost:8545'));
const ethQuery = new EthQuery(new HttpProvider('http://localhost:8545'));

const moveForward = seconds => new Promise((resolve, reject) => {
  ethRPC.sendAsync({ method: 'evm_increaseTime', params: [seconds] }, (err) => {
    if (err !== undefined && err !== null) {
      reject(err);
    }

    resolve();
  });
});

const takeSnapshot = () => new Promise((resolve, reject) => {
  ethRPC.sendAsync({
    jsonrpc: '2.0',
    method: 'evm_snapshot',
  }, (err, res) => {
    if (err !== undefined && err !== null) {
      reject(err);
    }

    const id = parseInt(res, 16);
    resolve(id);
  });
});

const resetSnapshot = id => new Promise((resolve, reject) => {
  ethRPC.sendAsync({ method: 'evm_revert', params: [id] }, (err) => {
    if (err !== undefined && err !== null) {
      reject(err);
    }
    resolve();
  });
});

const mineBlock = newBlockNumber => new Promise((resolve, reject) => {
  if (!BN.isBN(newBlockNumber)) {
    throw new Error('not a valid block number');
  }

  return ethQuery.blockNumber()
    .then((blockNumber) => {
      if (new BN(blockNumber, 10).lt(newBlockNumber)) {
        ethRPC.sendAsync({ jsonrpc: '2.0', method: 'evm_mine' }, (err) => {
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

const mineToStartPurchase = async () => mineBlock(new BN(CONF.startBlock, 10));

module.exports = {
  moveForward,
  takeSnapshot,
  resetSnapshot,
  mineBlock,
  mineToStartPurchase,
};
