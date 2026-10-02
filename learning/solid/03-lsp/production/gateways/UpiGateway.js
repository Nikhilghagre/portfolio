const PaymentGateway = require('../PaymentGateway');
const { Capability } = require('../Capability');

class UpiGateway extends PaymentGateway {
  constructor(config = {}) {
    super({ name: 'upi', capabilities: [Capability.REFUND, Capability.RECURRING], config });
  }

  /** UPI refunds are only allowed within 24 hours. Same capability, tighter window. */
  canPerform(capability, payment) {
    if (!this.supports(capability)) return false;
    if (capability === Capability.REFUND && payment) {
      return (Date.now() - new Date(payment.paidAt)) / 3600000 <= 24;
    }
    return true;
  }

  async pay(payment) {
    console.log(`[upi] collect ${payment.amount}`);
    return { status: 'SETTLED', reference: 'upi_' + payment.id };
  }
  async refund(payment, amount) {
    console.log(`[upi] refund ${amount}`);
    return { refundId: 'rfnd_' + payment.id };
  }
  async scheduleRecurring(payment) {
    console.log('[upi] autopay mandate created');
    return { mandateId: 'mnd_' + payment.id };
  }
}
module.exports = UpiGateway;
