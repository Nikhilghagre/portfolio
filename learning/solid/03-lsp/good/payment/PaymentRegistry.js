const CardPayment           = require('./CardPayment');
const PaypalPayment         = require('./PaypalPayment');
const CashOnDeliveryPayment = require('./CashOnDeliveryPayment');

class PaymentRegistry {
  constructor() {
    this.methods = new Map();
    this.register('card',   new CardPayment());
    this.register('paypal', new PaypalPayment());
    this.register('cod',    new CashOnDeliveryPayment());
  }
  register(name, method) { this.methods.set(name, method); return this; }

  resolve(name) {
    const m = this.methods.get(name);
    if (!m) throw new Error('Unsupported payment method: ' + name);
    return m;
  }

  /** Callers can now ASK before committing to a method. */
  available(order, amount) {
    return [...this.methods.entries()]
      .filter(([, m]) => m.accepts(order, amount))
      .map(([name]) => name);
  }
}
module.exports = PaymentRegistry;
