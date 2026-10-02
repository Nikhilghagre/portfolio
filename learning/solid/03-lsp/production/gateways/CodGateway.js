const PaymentGateway = require('../PaymentGateway');

/** Declares NO capabilities. Honest, and no refund() to lie with. */
class CodGateway extends PaymentGateway {
  constructor(config = {}) {
    super({ name: 'cod', capabilities: [], config });
    this.maxAmount = config.maxAmount ?? 500000;   // in minor units
  }
  accepts(payment) { return payment.amount.minorUnits <= this.maxAmount; }
  async pay(payment) {
    console.log(`[cod] courier collects ${payment.amount}`);
    return { status: 'PENDING', reference: 'cod_' + payment.id };
  }
}
module.exports = CodGateway;
