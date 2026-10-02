const NoDiscount         = require('./NoDiscount');
const FlatDiscount       = require('./FlatDiscount');
const PercentageDiscount = require('./PercentageDiscount');
const Buy2Get1Discount   = require('./Buy2Get1Discount');

/**
 * ============================================================
 *  THE REGISTRY  (a lookup-table flavour of the FACTORY pattern)
 * ============================================================
 *  BE HONEST: the decision "which coupon?" cannot be deleted.
 *  Somewhere, a string must become an object.
 *
 *  OCP does not delete decisions. It ISOLATES them.
 *
 *  Before: the decision was tangled INSIDE the pricing logic.
 *  Now:    the decision lives in ONE dumb map, and the pricing
 *          logic never sees a coupon code at all.
 *
 *  Better still: `register()` is public, so new coupons can be added
 *  from OUTSIDE this file - zero edits here. See extend-demo.js.
 * ============================================================
 */
class DiscountRegistry {
  constructor() {
    this.strategies = new Map();

    // built-in coupons
    this.register('FLAT10',      new FlatDiscount(10));
    this.register('PERCENT20',   new PercentageDiscount(20));
    this.register('BLACKFRIDAY', new PercentageDiscount(50));
    this.register('BUY2GET1',    new Buy2Get1Discount());
  }

  register(code, strategy) {
    this.strategies.set(code, strategy);
    return this;                       // chainable
  }

  /** Always returns a usable strategy - never null. (Null Object) */
  resolve(code) {
    return this.strategies.get(code) || new NoDiscount();
  }
}
module.exports = DiscountRegistry;
