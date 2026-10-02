const DiscountStrategy = require('./DiscountStrategy');

/**
 * THIS is why we need classes and not just a rate lookup table.
 * This rule needs the ORDER ITEMS, not just the total.
 * A simple `{ FLAT10: 10 }` config map could never express it.
 */
class Buy2Get1Discount extends DiscountStrategy {
  apply(total, order) {
    const totalQty = order.items.reduce((sum, i) => sum + i.qty, 0);
    if (totalQty < 3) return total;
    const cheapest = Math.min(...order.items.map(i => i.price));
    return Math.max(0, total - cheapest);
  }
}
module.exports = Buy2Get1Discount;
