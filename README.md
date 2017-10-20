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
  --account="0x72fc90dc0ec9bc20efd2c47791605406564a6b25b3b479bca53134fe6c2dd2aa,10000000000000000000000000" \
  --gasPrice 40000000000
```

## Testing

```
truffle test
```
## Licensed under MIT.

This code is licensed under MIT.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Except as contained in this notice, the name of the ZeroX Affiliate, LLC DBA Kr8os shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from ZeroX Affiliate, LLC DBA Kr8os.
