const PaymentMethod  = require('./PaymentMethod');
const PaymentResult  = require('./PaymentResult');
const { asRefundable } = require('./Refundable');

/** Cards settle immediately AND can be refunded -> opt into the capability. */
class CardPayment extends asRefundable(PaymentMethod) {
  validate(order) {
    if (!order.card || String(order.card.number).length !== 16) {
      throw new Error('Invalid card number');
    }
  }
  pay(order, amount) {
    console.log(`[stripe] POST /charges amount=${amount}`);
    return PaymentResult.settled('ch_' + Math.random().toString(36).slice(2, 10), amount);
  }
  refund(reference, amount) {
    console.log(`[stripe] POST /refunds ${reference} amount=${amount}`);
    return true;
  }
}
module.exports = CardPayment;
