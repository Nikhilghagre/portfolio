const PaymentMethod   = require('./PaymentMethod');
const PaymentResult   = require('./PaymentResult');
const { asRefundable } = require('./Refundable');

class PaypalPayment extends asRefundable(PaymentMethod) {
  pay(order, amount) {
    console.log(`[paypal] POST /v2/payments amount=${amount}`);
    return PaymentResult.settled('pp_' + Math.random().toString(36).slice(2, 10), amount);
  }
  refund(reference, amount) {
    console.log(`[paypal] POST /v2/refunds ${reference} amount=${amount}`);
    return true;
  }
}
module.exports = PaypalPayment;
