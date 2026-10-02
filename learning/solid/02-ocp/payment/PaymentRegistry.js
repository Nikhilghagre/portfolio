const CardPayment   = require('./CardPayment');
const UpiPayment    = require('./UpiPayment');
const PaypalPayment = require('./PaypalPayment');

class PaymentRegistry {
  constructor() {
    this.methods = new Map();
    this.register('card',   new CardPayment());
    this.register('upi',    new UpiPayment());
    this.register('paypal', new PaypalPayment());
  }
  register(name, method) {
    this.methods.set(name, method);
    return this;
  }
  /**
   * NOTE: no Null Object here, on purpose.
   * An unknown coupon should be ignored silently (harmless).
   * An unknown PAYMENT method must EXPLODE (charging nothing = free order).
   * Choosing when to fail loudly is a design decision, not a rule.
   */
  resolve(name) {
    const method = this.methods.get(name);
    if (!method) throw new Error('Unsupported payment method: ' + name);
    return method;
  }
}
module.exports = PaymentRegistry;
