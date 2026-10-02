const OrderValidator      = require('./OrderValidator');
const PriceCalculator     = require('./PriceCalculator');
const OrderRepository     = require('./OrderRepository');
const NotificationService = require('./NotificationService');
const InvoiceGenerator    = require('./InvoiceGenerator');
const AuditLogger         = require('./AuditLogger');
const DiscountRegistry    = require('./DiscountRegistry');
const TaxRegistry         = require('./tax/TaxRegistry');
const PaymentRegistry     = require('./payment/PaymentRegistry');
const { NoFee, CodFee }   = require('./pricing/FeeStrategy');

class OrderService {
  constructor() {
    this.validator  = new OrderValidator();
    this.prices     = new PriceCalculator();
    this.repository = new OrderRepository();
    this.notifier   = new NotificationService();
    this.invoices   = new InvoiceGenerator();
    this.audit      = new AuditLogger();
    this.discounts  = new DiscountRegistry();
    this.taxes      = new TaxRegistry();
    this.payments   = new PaymentRegistry();
    this.fees       = new Map([['cod', new CodFee(2)]]);   // fees are their OWN concept now
  }

  placeOrder(order) {
    this.validator.validate(order);

    const subtotal   = this.prices.subtotal(order.items);
    const discounted = this.discounts.resolve(order.couponCode).apply(subtotal, order);
    const fee        = (this.fees.get(order.paymentMethod) || new NoFee()).calculate(discounted, order);
    const tax        = this.taxes.resolve(order.country).calculate(discounted + fee, order);
    const total      = Math.round((discounted + fee + tax) * 100) / 100;

    const gateway = this.payments.resolve(order.paymentMethod);

    // ASK BEFORE ACTING - the limit is part of the contract now
    if (!gateway.accepts(order, total)) {
      throw new Error(
        `${gateway.name} cannot handle this order (${total}). ` +
        `Available: ${this.payments.available(order, total).join(', ') || 'none'}`
      );
    }
    gateway.validate(order);
    const result = gateway.pay(order, total);

    const record = {
      id: 'ORD-' + Date.now(),
      email: order.customerEmail,
      items: order.items,
      subtotal, discount: subtotal - discounted, fee, tax, total,
      paymentMethod: order.paymentMethod,
      paymentReference: result.reference,
      // THE TRUTH, not a hardcoded 'PAID'
      status: result.status === 'SETTLED' ? 'PAID' : 'AWAITING_PAYMENT',
      createdAt: new Date().toISOString()
    };

    this.repository.save(record);
    this.notifier.notify(order, record);
    this.audit.log(`ORDER ${record.id} ${total} ${record.status}`);
    return record;
  }
}
module.exports = OrderService;
