const OrderValidator      = require('./OrderValidator');
const PriceCalculator     = require('./PriceCalculator');
const DiscountCalculator  = require('./DiscountCalculator');
const TaxCalculator       = require('./TaxCalculator');
const PaymentProcessor    = require('./PaymentProcessor');
const OrderRepository     = require('./OrderRepository');
const NotificationService = require('./NotificationService');
const InvoiceGenerator    = require('./InvoiceGenerator');
const AuditLogger         = require('./AuditLogger');

/**
 * ============================================================
 *  THE ORCHESTRATOR
 * ============================================================
 *  Its ONE responsibility: define the ORDER OF STEPS in a checkout.
 *  It does not know HOW to tax, HOW to charge, HOW to save.
 *  It only knows WHAT happens, and in WHAT SEQUENCE.
 *
 *  Read placeOrder() below - it now reads like the business
 *  process written in English. That is the goal.
 * ============================================================
 *
 *  !! STILL BROKEN !!  Look at the constructor.
 *  It says `new OrderRepository()` - it hardcodes its own
 *  dependencies. That is the DIP violation, fixed in Step 5.
 */
class OrderService {
  constructor() {
    this.validator    = new OrderValidator();
    this.prices       = new PriceCalculator();
    this.discounts    = new DiscountCalculator();
    this.taxes        = new TaxCalculator();
    this.payments     = new PaymentProcessor();
    this.repository   = new OrderRepository();
    this.notifier     = new NotificationService();
    this.invoices     = new InvoiceGenerator();
    this.audit        = new AuditLogger();
  }

  placeOrder(order) {
    this.validator.validate(order);

    let total = this.prices.subtotal(order.items);
    total     = this.discounts.apply(total, order);
    total     = this.taxes.apply(total, order.country);

    const paymentId = this.payments.charge(order, total);

    const record = {
      id: 'ORD-' + Date.now(),
      email: order.customerEmail,
      items: order.items,
      total,
      paymentId,
      status: 'PAID',
      createdAt: new Date().toISOString()
    };

    this.repository.save(record);
    this.notifier.notify(order, record);
    console.log(this.invoices.generate(order, record));
    this.audit.log(`ORDER ${record.id} ${total}`);

    return record;
  }
}
module.exports = OrderService;
