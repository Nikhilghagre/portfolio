const DiscountStrategy = require('./DiscountStrategy');

/**
 * Note it takes `amount` in the CONSTRUCTOR.
 * One class now serves FLAT10, FLAT50, FLAT500...
 * Data varies -> constructor. Behaviour varies -> new class.
 */
class FlatDiscount extends DiscountStrategy {
  constructor(amount) {
    super();
    this.amount = amount;
  }
  apply(total) {
    return Math.max(0, total - this.amount);
  }
}
module.exports = FlatDiscount;
