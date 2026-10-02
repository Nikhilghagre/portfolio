/**
 * REASON TO CHANGE: invoice FORMAT / legal layout.
 *
 * Note it RETURNS a string, it does not print it.
 * Generating and displaying are two different responsibilities.
 * Because it returns, we can later render it to PDF, email body, or console.
 */
class InvoiceGenerator {
  generate(order, record) {
    const lines = order.items.map(i => `${i.name} x${i.qty} = ${i.price * i.qty}`);
    return [
      '-------- INVOICE --------',
      `Order: ${record.id}`,
      ...lines,
      `TOTAL: ${record.total}`,
      '-------------------------'
    ].join('\n');
  }
}
module.exports = InvoiceGenerator;
