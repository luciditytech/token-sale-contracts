const getConfig = require('./inc/getConfig');
const abi = require('ethereumjs-abi');

const HumanStandardToken = artifacts.require('HumanStandardToken.sol');
const ContractRegistry = artifacts.require('ContractRegistry.sol');
const SalesStorage = artifacts.require('SalesStorage.sol');
const Sales = artifacts.require('Sales');

const deployAllDependiencies = async (conf) => {
  let config = conf;

  if (!config.humanStandardToken) {
    const instance = await HumanStandardToken.deployed();
    config.humanStandardToken = instance.address;
  }

  if (!config.contractRegistry) {
    const instance = await ContractRegistry.deployed();
    config.contractRegistry = instance.address;
  }

  if (!config.salesStorage) {
    const instance = await SalesStorage.deployed();
    config.salesStorage = instance.address;
  }

  return config;
};

module.exports = function(deployer, network, accounts) {
  deployer.then(async () => {
    const { config, wallet } = getConfig(network, accounts);

    const conf = await deployAllDependiencies(config);

    // assert.ok(wallet);

    var args = [
      config.total,
      config.name,
      config.decimals,
      config.symbol,

      wallet,
      conf.locked,
      conf.humanStandardToken,
      conf.contractRegistry,
      conf.salesStorage
    ];

    console.log('args: ' + args.join(','));

    var encoded = abi.rawEncode(
      [
        'uint256',
        'string',
        'uint8',
        'string',

        'address',
        'uint256',
        'address',
        'address',
        'address'
      ],
      args
    );

    console.log('encoded argument for Sales contract: ' + encoded.toString('hex'));

    const instance = await deployer.deploy(
      Sales,

      config.total,
      config.name,
      config.decimals,
      config.symbol,

      wallet,
      conf.locked,
      conf.humanStandardToken,
      conf.contractRegistry,
      conf.salesStorage,
    );

    const tokenAddr = await instance.token.call();
    const deployedStorage = await instance.humanStandardTokenStorage.call();
    const token = await HumanStandardToken.at(tokenAddr);

    await token.changeStorage(deployedStorage);

    const salesStorage = await SalesStorage.deployed();
    salesStorage.initStorageOwner(instance.address);
  });
};
