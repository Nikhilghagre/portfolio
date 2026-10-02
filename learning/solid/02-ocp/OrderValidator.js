/**
 * REASON TO CHANGE: business rules about what a valid order is.
 * (e.g. "minimum order value 100", "max 10 items per order")
 *
 * Notice: no fs, no network, no console. Pure rules.
 * That means: trivially testable.
 */
class OrderValidator {
  validate(order) {
    if (!order.customerEmail || !order.customerEmail.includes('@')) {
      throw new Error('Invalid email');
    }
    if (!order.items || order.items.length === 0) {
      throw new Error('Order must have at least one item');
    }
    for (const item of order.items) {
      if (item.qty <= 0) throw new Error(`Bad quantity for ${item.name}`);
      if (item.price < 0) throw new Error(`Bad price for ${item.name}`);
    }
  }
}
module.exports = OrderValidator;
