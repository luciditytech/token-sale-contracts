module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*' // Match any network id
    },
    ropsten: {
      host: '172.31.80.135',
      port: 8545,
      network_id: '*',
      gas: 4600000
    },
    live: {
      host: '10.0.0.15',
      port: 8545,
      network_id: 1
    }
  }
};
