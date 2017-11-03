const Sales = artifacts.require('Sales');
const fs = require('fs');
const abi = require('ethereumjs-abi');

module.exports = function(deployer, network, accounts) {
  var conf;
  var wallet;

  if (network === 'development' || network === 'ropsten') {
    conf = JSON.parse(fs.readFileSync('./conf/development.json'));
    wallet = accounts[0];
  } else {
    conf = JSON.parse(fs.readFileSync('./conf/production.json'));
    wallet = conf['wallet'];
  }

  // assert.ok(wallet);

  var args = [
    wallet,
    conf['total'],
    conf['name'],
    conf['decimals'],
    conf['symbol'],
    conf['price'],
    conf['startBlock'],
    conf['freezeBlock'],
    conf['cap'],
    conf['locked']
  ];

  console.log('args: ' + args.join(','));

  var encoded = abi.rawEncode(
    [ 
      'address',
      'uint256',
      'string',
      'uint8',
      'string',
      'uint256',
      'uint256',
      'uint256',
      'uint256',
      'uint256'
    ],
    args
  );

  console.log('encoded argument for Sales contract: ' + encoded.toString('hex'));

  return deployer.deploy(
    Sales,
    wallet,
    conf['total'],
    conf['name'],
    conf['decimals'],
    conf['symbol'],
    conf['price'],
    conf['startBlock'],
    conf['freezeBlock'],
    conf['cap'],
    conf['locked']
  );
};
