const { Capability } = require('./Capability');
const { CapabilityNotSupported } = require('./errors');

/** The caller. Note: zero `instanceof`, zero knowledge of gateway classes. */
class RefundService {
  constructor(registry) { this.registry = registry; }

  async refund(payment, amount) {
    const gateway = this.registry.get(payment.gateway);

    // per-transaction check, not per-class
    gateway.require(Capability.REFUND, payment);

    if (amount.isGreaterThan(payment.amount)) throw new Error('Refund exceeds payment');
    const isPartial = amount.minorUnits < payment.amount.minorUnits;
    if (isPartial) gateway.require(Capability.PARTIAL_REFUND, payment);

    return gateway.refund(payment, amount);
  }

  async refundBatch(payments, amountOf) {
    const report = { ok: [], skipped: [], failed: [] };
    for (const p of payments) {
      try {
        await this.refund(p, amountOf(p));
        report.ok.push(p.id);
      } catch (err) {
        if (err instanceof CapabilityNotSupported) {
          report.skipped.push({ id: p.id, reason: err.message });   // expected, not a failure
        } else if (err.retryable) {
          report.failed.push({ id: p.id, reason: err.message, willRetry: true });
        } else {
          report.failed.push({ id: p.id, reason: err.message, willRetry: false });
        }
      }
    }
    return report;
  }
}
module.exports = RefundService;
