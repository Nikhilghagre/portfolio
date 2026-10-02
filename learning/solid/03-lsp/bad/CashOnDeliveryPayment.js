const PaymentMethod = require('../../02-ocp/payment/PaymentMethod');

/**
 * ============================================================
 *  LIE #2 - Cash on Delivery pretending to be a gateway
 * ============================================================
 *  The base contract says:
 *      charge(order, amount) -> takes the money, returns a paymentId
 *
 *  COD cannot take money now. The courier collects it next week.
 *  So this class breaks the contract in TWO ways:
 *
 *  (a) POSTCONDITION WEAKENED:
 *      returns null instead of a paymentId.
 *      -> OrderService still writes status: 'PAID'.
 *      -> Order marked PAID with no money and no payment id.
 *
 *  (b) PRECONDITION STRENGTHENED:
 *      throws for amount > 5000. The base class accepts ANY amount,
 *      so callers never expect this. A high-value order explodes
 *      somewhere deep in the stack.
 *
 *  Rule: a subclass may accept MORE than its parent, never LESS.
 * ============================================================
 */
class CashOnDeliveryPayment extends PaymentMethod {
  validate(order) {
    if (!order.address) throw new Error('COD needs a delivery address');
  }
  charge(order, amount) {
    if (amount > 5000) throw new Error('COD not allowed above 5000');  // (b)
    console.log(`[cod] courier will collect ${amount} later`);
    return null;                                                        // (a)
  }
  refund() {
    throw new Error('Cannot refund a COD order');                       // Lie #3
  }
}
module.exports = CashOnDeliveryPayment;
