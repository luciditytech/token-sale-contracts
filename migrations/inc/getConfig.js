const fs = require('fs');

module.exports = (network, accounts) => {
  let config;
  let wallet;
  let options = {};

  if (network === 'production') {
    config = JSON.parse(fs.readFileSync('./conf/production.json'));
    ({ wallet } = config);
  } else if (
    network === 'development'
    || network === 'coverage'
  ) {
    config = JSON.parse(fs.readFileSync('./conf/development.json'));
    wallet = accounts[0];
  } else if (network === 'ropsten') {
    throw new Error(`network ${network} not supported`);
  } else {
    throw new Error(`network ${network} not supported`);
  }

  return {
    options,
    config,
    wallet
  };
};
