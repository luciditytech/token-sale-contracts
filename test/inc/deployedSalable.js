const { assert } = require('chai');

const Salable = artifacts.require('Salable');

const SalableUtil = require('../ministro-contracts/ministroSalable');

async function deployedSalable(owner) {
  const salableInstance = await Salable.deployed();
  assert.isNotEmpty(salableInstance.address);

  const ministroSalable = SalableUtil();
  ministroSalable.setInstanceVar(salableInstance);
  ministroSalable.setFromVar(owner);

  return {
    salableInstance,
    ministroSalable,
  };
}

module.exports = deployedSalable;
