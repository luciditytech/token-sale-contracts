var Sales = artifacts.require('Sales');
const fs = require(`fs`);

module.exports = function(deployer, network, accounts) {
  var conf;
  var wallet;

  if (network === 'development') {
    conf = JSON.parse(fs.readFileSync(`./conf/development.json`));
    wallet = accounts[0];
  } else {
    conf = JSON.parse(fs.readFileSync(`./conf/production.json`));
    wallet = conf['wallet'];
  }

  // assert.ok(wallet);

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
    conf['cap']
  );
};
