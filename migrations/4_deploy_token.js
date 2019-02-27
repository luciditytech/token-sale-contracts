const getConfig = require('./inc/getConfig');
const abi = require('ethereumjs-abi');

const ContractRegistry = artifacts.require('ContractRegistry');
const HumanStandardTokenStorage = artifacts.require('HumanStandardTokenStorage');
const HumanStandardToken = artifacts.require('HumanStandardToken');

module.exports = (deployer, network, accounts) => {
  deployer.then(async () => {
    const { config } = getConfig(network, accounts);

    if (!config.contractRegistry) {
      const instance = await ContractRegistry.deployed();
      config.contractRegistry = instance.address;
    }

    if (!config.humanStandardTokenStorage) {
      const instance = await HumanStandardTokenStorage.deployed();
      config.humanStandardTokenStorage = instance.address;
    }

    var args = [
      config.contractRegistry,
      config.humanStandardTokenStorage
    ];

    console.log('args: ' + args.join(','));

    var encoded = abi.rawEncode(
      [
        'address',
        'address'
      ],
      args
    );

    console.log('encoded argument for HumanStandardToken contract: ' + encoded.toString('hex'));

    const instance = await deployer.deploy(
      HumanStandardToken,
      config.contractRegistry,
      config.humanStandardTokenStorage
    );
  });
};
