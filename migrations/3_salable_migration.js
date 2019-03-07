const SalableDeployer = require('./deployers/Salable');

const Salable = artifacts.require('Salable');

module.exports = (deployer, network, accounts) => SalableDeployer(
  deployer, network, accounts, Salable,
);
