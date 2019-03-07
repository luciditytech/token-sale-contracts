const developmentConfig = require('../../conf/development');
const productionConfig = require('../../conf/production');

module.exports = (network, accounts) => {
  let config;
  let wallet;
  let options = {};

  if (
    network === 'development'
    || network === 'coverage'
  ) {
    config = developmentConfig;
    [wallet] = accounts;
  } else if (network === 'staging') {
    config = developmentConfig;
    ({ wallet } = config);
  } else if (network === 'production') {
    config = productionConfig;
    ({ wallet } = config);
  }

  if (wallet) {
    options = { from: wallet };
  }

  return {
    options,
    config,
    wallet,
  };
};
