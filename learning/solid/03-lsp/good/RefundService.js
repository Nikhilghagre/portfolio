const { isRefundable } = require('./payment/Refundable');

/**
 * The batch loop from DAMAGE 4, rewritten.
 * It ASKS about capability instead of calling and praying.
 * One non-refundable order can no longer abort the whole batch.
 */
class RefundService {
  constructor(paymentRegistry) { this.payments = paymentRegistry; }

  refundAll(orders) {
    const report = { refunded: [], skipped: [] };
    for (const order of orders) {
      const method = this.payments.resolve(order.paymentMethod);
      if (!isRefundable(method)) {
        report.skipped.push({ id: order.id, reason: `${method.name} cannot refund` });
        continue;
      }
      method.refund(order.paymentReference, order.total);
      report.refunded.push(order.id);
    }
    return report;
  }
}
module.exports = RefundService;
