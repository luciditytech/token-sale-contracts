const ministroExecute = require('ministro-tool');

const BN = require('bignumber.js');

const CONF = require('../../conf/development');

function MinistroContract() {
  const app = {};

  /* eslint-disable-next-line */
  app.__proto__ = ministroExecute();

  app.purchaseTokens = async (txAttr, expectThrow) => {
    let prevTotalBalance;
    let prevBalance;

    const txAttrLocal = app.getTxAttr(txAttr);

    if (!expectThrow) {
      prevTotalBalance = await app.balanceOf(app.instance.address);
      prevBalance = await app.balanceOf(txAttrLocal.from);
    }

    const action = () => app.instance.purchaseTokens(txAttrLocal);

    const results = await app.executeAction(action, txAttrLocal, null, null, expectThrow);

    if (!expectThrow) {
      const tokensBought = BN(txAttrLocal.value).div(CONF.price);
      assert(BN(prevBalance).plus(tokensBought).eq(await app.balanceOf(txAttrLocal.from)), 'invalid balance');
      assert(BN(prevTotalBalance).minus(tokensBought).eq(await app.balanceOf(app.instance.address)), 'invalid total balance');
    }

    return results;
  };

  app.changeCap = async (newCap, txAttr, expectThrow) => {
    const txAttrLocal = app.getTxAttr(txAttr);

    const action = () => app.instance.changeCap(newCap, txAttrLocal);

    const results = await app.executeAction(action, txAttrLocal, null, null, expectThrow);

    if (!expectThrow) {
      assert(BN(newCap).eq(await app.cap()), 'invalid cap');
    }

    return results;
  };

  app.unlockEscrow = async (txAttr, expectThrow) => {
    let prevTotal;
    let prevBalance;
    let lockedTokens;

    const txAttrLocal = app.getTxAttr(txAttr);

    if (!expectThrow) {
      prevTotal = await app.totalSupply();
      prevBalance = await app.balanceOf(txAttrLocal.from);
      lockedTokens = await app.lockedTokens();
    }

    const action = () => app.instance.unlockEscrow(txAttrLocal);

    const results = await app.executeAction(action, txAttrLocal, null, null, expectThrow);

    if (!expectThrow) {
      assert(BN(prevBalance).plus(lockedTokens).eq(await app.balanceOf(txAttrLocal.from)), 'invalid balance');
      assert(BN(prevTotal).plus(lockedTokens).eq(await app.totalSupply()), 'invalid totalSupply');
      assert(BN(await app.lockedTokens()).eq(0), 'invalid lockedTokens');
    }

    return results;
  };

  app.approveAndCall = async (tokenAddr, value, txAttr, expectThrow) => {
    const txAttrLocal = app.getTxAttr(txAttr);

    const action = () => app.instance.approveAndCall(tokenAddr, value, txAttrLocal);

    return app.executeAction(action, txAttrLocal, null, null, expectThrow);
  };

  app.totalSupply = async () => app.instance.totalSupply.call();
  app.balanceOf = async owner => app.instance.balanceOf.call(owner);
  app.lockedTokens = async () => app.instance.lockedTokens.call();
  app.sold = async () => app.instance.sold.call();
  app.cap = async () => app.instance.cap.call();

  return app;
}

module.exports = MinistroContract;
