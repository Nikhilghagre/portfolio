const DiscountStrategy = require('./DiscountStrategy');
class PercentageDiscount extends DiscountStrategy {
  constructor(percent) { super(); this.percent = percent; }
  calculate(total) { return total - total * (this.percent / 100); }   // fills the hole
}
module.exports = PercentageDiscount;
