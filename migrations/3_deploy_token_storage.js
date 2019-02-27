const getConfig = require('./inc/getConfig');
const abi = require('ethereumjs-abi');

const HumanStandardTokenStorage = artifacts.require('HumanStandardTokenStorage');

module.exports = (deployer, network, accounts) => {
  deployer.then(async () => {
    const { config } = getConfig(network, accounts);

    var args = [
      config.total,
      config.name,
      config.decimals,
      config.symbol
    ];

    console.log('args: ' + args.join(','));

    var encoded = abi.rawEncode(
      [
        'uint256',
        'string',
        'uint8',
        'string'
      ],
      args
    );

    console.log('encoded argument for HumanStandardTokenStorage contract: ' + encoded.toString('hex'));

    await deployer.deploy(
      HumanStandardTokenStorage,
      config.total,
      config.name,
      config.decimals,
      config.symbol
    );
  });
};
