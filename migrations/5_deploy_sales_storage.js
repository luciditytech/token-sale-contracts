const getConfig = require('./inc/getConfig');
const abi = require('ethereumjs-abi');

const SalesStorage = artifacts.require('SalesStorage');

module.exports = (deployer, network, accounts) => {
  deployer.then(async () => {
    const { config, wallet } = getConfig(network, accounts);

    var args = [
      wallet,
      config.price,
      config.startBlock,
      config.freezeBlock,
      config.cap
    ];

    console.log('args: ' + args.join(','));

    var encoded = abi.rawEncode(
      [
        'address',
        'uint256',
        'uint256',
        'uint256',
        'uint256'
      ],
      args
    );

    console.log('encoded argument for SalesStorage contract: ' + encoded.toString('hex'));

    await deployer.deploy(
      SalesStorage,
      wallet,
      config.price,
      config.startBlock,
      config.freezeBlock,
      config.cap,
    );
  });
};
