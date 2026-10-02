const NoDiscount         = require('./pricing/NoDiscount');
const PercentageDiscount = require('./pricing/PercentageDiscount');

class DiscountRegistry {
  constructor() {
    this.strategies = new Map();
    this.register('PERCENT20',   new PercentageDiscount(20));
    this.register('BLACKFRIDAY', new PercentageDiscount(50));
  }
  register(code, s) { this.strategies.set(code, s); return this; }
  resolve(code) { return this.strategies.get(code) || new NoDiscount(); }
}
module.exports = DiscountRegistry;
