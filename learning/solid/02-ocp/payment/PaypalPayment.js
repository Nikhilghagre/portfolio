const PaymentMethod = require('./PaymentMethod');

class PaypalPayment extends PaymentMethod {
  validate() { /* paypal validates on their side - nothing to check here */ }
  charge(order, amount) {
    console.log(`[paypal] POST /v2/payments amount=${amount}`);
    return 'pp_' + Math.random().toString(36).slice(2, 10);
  }
}
module.exports = PaypalPayment;
