const getConfig = require('./inc/getConfig');

const ContractRegistry = artifacts.require('ContractRegistry');

module.exports = (deployer, network, accounts) => {
  deployer.then(async () => {
    const { config } = getConfig(network, accounts);

    if (!config.contractRegistry) {
      await deployer.deploy(ContractRegistry);
    }
  });
};
