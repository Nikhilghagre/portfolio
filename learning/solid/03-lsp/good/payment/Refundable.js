/**
 * ============================================================
 *  FIX 3b: CAPABILITY, NOT INHERITANCE
 * ============================================================
 *  Instead of a refund() that some classes throw from, we make
 *  refundability something you can ASK about and TEST for.
 *
 *  JS has no interfaces, so we mark capability with a Symbol.
 *  (In TypeScript this would be `interface Refundable`.)
 *
 *  Now the refund loop from demo-broken.js can safely skip COD
 *  instead of crashing on it.
 * ============================================================
 */
const REFUNDABLE = Symbol('Refundable');

/** Mixin: adds the marker + forces a real refund() implementation. */
function asRefundable(BaseClass) {
  return class extends BaseClass {
    get [REFUNDABLE]() { return true; }
    refund(reference, amount) {
      throw new Error(`${this.name} claims Refundable but has no refund()`);
    }
  };
}

const isRefundable = (obj) => Boolean(obj && obj[REFUNDABLE]);

module.exports = { asRefundable, isRefundable, REFUNDABLE };
