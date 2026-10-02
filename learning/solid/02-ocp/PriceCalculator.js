/**
 * REASON TO CHANGE: how we compute the raw price of a cart.
 * (e.g. later: bulk pricing, weight-based shipping)
 */
class PriceCalculator {
  subtotal(items) {
    return items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }
}
module.exports = PriceCalculator;
