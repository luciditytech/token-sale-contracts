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

### Install Dependencies

```
npm install
```


## Launch testrpc

```
ganache-cli
```

## Testing

```
npm run test
```

## Verifying w/ Oyente

```
docker pull everconfusedguy/oyente
docker run -it -v `echo $PWD`:/data everconfusedguy/oyente
python oyente.py -dl 500 -ll 500 -s /data/contracts/Sales.sol
```
## Deploying to TestNet

Edit `truffle.js` if necessary to point to Ethereum RPC node connected to the Ethereum testnet.
Also, make sure you have some test ether in the account to deploy contracts.

During development we used the revived Ropstent, testnet and the following faucet to send Ether to it:

http://ipfs.b9lab.com:8080/ipfs/QmTHdYEYiJPmbkcth3mQvEQQgEamFypLhc9zapsBatQW7Y/throttled_faucet.html

```
truffle deploy --network live
```

## Licensed under MIT.

This code is licensed under MIT.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Notice

Except as contained in this notice, the name of the ZeroX Affiliate, LLC DBA Kr8os shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from ZeroX Affiliate, LLC DBA Kr8os.
