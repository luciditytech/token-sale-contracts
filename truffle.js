module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*', // Match any network id
      gasPrice: 0x01
    },
    ropsten: {
      host: '172.31.47.145',
      port: 8545,
      network_id: 1,
      gas: 4600000
    },
    live: {
      host: '10.0.0.15',
      port: 8545,
      network_id: 1
    }
  }
};
