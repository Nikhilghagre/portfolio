const PaymentGateway = require('../PaymentGateway');
const { Capability } = require('../Capability');

class StripeGateway extends PaymentGateway {
  constructor(config = {}) {
    super({
      name: 'stripe',
      capabilities: [Capability.REFUND, Capability.PARTIAL_REFUND,
                     Capability.RECURRING, Capability.TOKENIZE],
      config
    });
  }

  /** Reality #3: Stripe refunds expire after 180 days. */
  canPerform(capability, payment) {
    if (!this.supports(capability)) return false;
    if (capability === Capability.REFUND && payment) {
      const days = (Date.now() - new Date(payment.paidAt)) / 86400000;
      return days <= 180;
    }
    return true;
  }

  async pay(payment) {
    // idempotencyKey: if the network drops and we retry, the customer
    // is charged ONCE. Non-negotiable in production.
    console.log(`[stripe] charge ${payment.amount} idempotency=${payment.idempotencyKey}`);
    return { status: 'SETTLED', reference: 'ch_' + payment.id };
  }
  async refund(payment, amount) {
    console.log(`[stripe] refund ${amount} of ${payment.reference}`);
    return { refundId: 're_' + payment.id };
  }
  async scheduleRecurring(payment, interval) {
    console.log(`[stripe] subscription every ${interval}`);
    return { subscriptionId: 'sub_' + payment.id };
  }
  async tokenize(card) { return { token: 'tok_xxx' }; }
}
module.exports = StripeGateway;
