const DiscountStrategy = require('./DiscountStrategy');

/** Serves PERCENT20, BLACKFRIDAY(50%), and every future % coupon. */
class PercentageDiscount extends DiscountStrategy {
  constructor(percent) {
    super();
    this.percent = percent;
  }
  apply(total) {
    return Math.max(0, total - total * (this.percent / 100));
  }
}
module.exports = PercentageDiscount;
