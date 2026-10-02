const DiscountStrategy = require('./DiscountStrategy');
class NoDiscount extends DiscountStrategy {
  calculate(total) { return total; }
}
module.exports = NoDiscount;
