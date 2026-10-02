/**
 * REASON TO CHANGE: payment gateways.
 * Stripe bumps their API version -> only THIS file changes.
 * (if/else still here -> fixed in Step 2)
 */
class PaymentProcessor {
  charge(order, amount) {
    if (order.paymentMethod === 'card') {
      if (!order.card || order.card.number.length !== 16) throw new Error('Invalid card number');
      console.log(`[stripe] POST /charges amount=${amount}`);
      return 'ch_' + Math.random().toString(36).slice(2, 10);
    }
    if (order.paymentMethod === 'upi') {
      if (!order.upiId || !order.upiId.includes('@')) throw new Error('Invalid UPI id');
      console.log(`[razorpay] POST /upi amount=${amount}`);
      return 'upi_' + Math.random().toString(36).slice(2, 10);
    }
    if (order.paymentMethod === 'paypal') {
      console.log(`[paypal] POST /v2/payments amount=${amount}`);
      return 'pp_' + Math.random().toString(36).slice(2, 10);
    }
    throw new Error('Unsupported payment method: ' + order.paymentMethod);
  }
}
module.exports = PaymentProcessor;
