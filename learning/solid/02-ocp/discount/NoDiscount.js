const DiscountStrategy = require('./DiscountStrategy');

/**
 * THE NULL OBJECT PATTERN.
 * Instead of `if (discount) discount.apply(...)` scattered everywhere,
 * we return an object that does nothing. Callers never null-check again.
 */
class NoDiscount extends DiscountStrategy {
  apply(total) {
    return total;
  }
}
module.exports = NoDiscount;
