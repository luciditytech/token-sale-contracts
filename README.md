# Token Sale Contracts

A collection of contracts used for typical token sales.
They are based on Consensys' standard implementation of ERC20.

## Overview

The token sales contract implements the HumanStandardToken and inherits the following properties:

* Initial Finite Supply (specified up initial deployment of the smart contract to the blockchain.)

## Initial Token Distribution

  * All tokens are initial given to the contract itself.
  * 10% will be distributed to owner's wallet
  * 10% will be sold during the pre-sale (capped @ $1MM)

## TODO
  - [ ] pre-sale
  - [ ] official sale
  - [ ] emergency toggle
