module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*' // Match any network id
    },
    live: {
      host: '10.0.0.15',
      port: 8545,
      network_id: 1
    }
  }
};
