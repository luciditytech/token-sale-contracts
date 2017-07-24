# dreamcoin-sales-contracts

A collection of contracts used for the DreamCoin ICO.
They are based on Consensys' standard implementation of ERC20.

## Overview

The DreamCoin sales contract implements the HumanStandardToken and inherits the following properties:

* Initial Finite Supply (specified up initial deployment of the smart contract to the blockchain.)
* Listing symbol: `DRM`, and name: `DreamCoin`

Additionally we implement the following properties:

* A pre-sale period that's capped at a configurable goal.
* A sale period capped at a different configurable goal.
* Pre-sale token holders may liquidate their tokens during the official sale.
* A time-lock that distributes founder's tokens at configurable cliff periods.
* A central token reserve that requires approval from all founders to unlock.

## TODO

Should we implement sending tokens to other contract?

* Implement caps
* Implement founders distribution
* * Implement founders distribution w/ vesting dates
