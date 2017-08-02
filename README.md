# Token Sale Contracts

A collection of contracts used for typical token sales.
They are based on Consensys' standard implementation of ERC20.

## Overview

The token sales contract implements the HumanStandardToken and inherits the following properties:

## Token Distribution

  * 20% will be distributed to owner's wallet
  * 10% will be sold during the pre-sale (capped @ configurable value)
  * 50% will be sold during the official sale (capped @ configurable value)
  * 20% will held in a time-locked wallet, distributed to the owner after a configurable vesting period

## Handling contractors during pre-sale period

It is recommended that contractors are paid by transferring tokens from the owner's wallet to the contractor.

## Development

## Launch testrpc

```
testrpc \
  --account="0xb44d5ae914d16e93972f70a4a73d87420e0150173bef79d9945b736d69825247,10000000000000000000000000" \
  --account="0x72fc90dc0ec9bc20efd2c47791605406564a6b25b3b479bca53134fe6c2dd2aa,10000000000000000000000000"
```

## Testing

```
truffle test
```
