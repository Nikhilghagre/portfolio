const OrderValidator      = require('./OrderValidator');
const PriceCalculator     = require('./PriceCalculator');
const OrderRepository     = require('./OrderRepository');
const NotificationService = require('./NotificationService');
const InvoiceGenerator    = require('./InvoiceGenerator');
const AuditLogger         = require('./AuditLogger');

const DiscountRegistry = require('./discount/DiscountRegistry');
const TaxRegistry      = require('./tax/TaxRegistry');
const PaymentRegistry  = require('./payment/PaymentRegistry');

class OrderService {
  constructor() {
    this.validator  = new OrderValidator();
    this.prices     = new PriceCalculator();
    this.repository = new OrderRepository();
    this.notifier   = new NotificationService();
    this.invoices   = new InvoiceGenerator();
    this.audit      = new AuditLogger();

    // the registries are PUBLIC so the outside world can extend them
    this.discounts = new DiscountRegistry();
    this.taxes     = new TaxRegistry();
    this.payments  = new PaymentRegistry();
  }

  placeOrder(order) {
    this.validator.validate(order);

    // --- PRICING: count the `if` statements below. There are ZERO. ---
    const subtotal   = this.prices.subtotal(order.items);
    const discounted = this.discounts.resolve(order.couponCode).apply(subtotal, order);
    const tax        = this.taxes.resolve(order.country).calculate(discounted, order);
    const total      = Math.round((discounted + tax) * 100) / 100;

    console.log(`[calc] subtotal=${subtotal} discounted=${discounted} tax=${tax} total=${total}`);

    // --- PAYMENT: also zero `if`. Polymorphism replaced the chain. ---
    const gateway = this.payments.resolve(order.paymentMethod);
    gateway.validate(order);
    const paymentId = gateway.charge(order, total);

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
