const PaymentMethod = require('./PaymentMethod');
const PaymentResult = require('./PaymentResult');

/**
 * ============================================================
 *  COD, NOW TELLING THE TRUTH
 * ============================================================
 *  Compare with bad/CashOnDeliveryPayment.js line by line:
 *
 *  | Lie (before)                | Truth (now)                        |
 *  |-----------------------------|------------------------------------|
 *  | throws for amount > 5000    | accepts() declares the limit UP FRONT |
 *  | returns null                | returns a real PENDING PaymentResult  |
 *  | refund() throws             | no refund() at all - not Refundable   |
 *
 *  Nothing was "added to support COD" in the caller.
 *  We only stopped pretending COD was something it isn't.
 * ============================================================
 */
class CashOnDeliveryPayment extends PaymentMethod {
  constructor(maxAmount = 5000) { super(); this.maxAmount = maxAmount; }

  /** The limit is now DECLARED, not sprung on the caller mid-checkout. */
  accepts(order, amount) {
    return amount <= this.maxAmount && Boolean(order.address);
  }

  validate(order) {
    if (!order.address) throw new Error('COD needs a delivery address');
  }

  pay(order, amount) {
    console.log(`[cod] courier will collect ${amount} on delivery`);
    return PaymentResult.pending('cod_' + Math.random().toString(36).slice(2, 10), amount);
  }
}
module.exports = CashOnDeliveryPayment;
