/**
 * ============================================================
 *  THE PROOF THAT OCP WORKS
 * ============================================================
 *  Marketing, Finance and the Payments team all land tickets today:
 *
 *   1. new coupon  DIWALI30       (30% off)
 *   2. new coupon  FIRSTORDER     (50% off, first-time buyers only)
 *   3. new gateway CRYPTO
 *   4. new country JAPAN (10%)
 *
 *  Scroll every file in 02-ocp/.  NOT ONE of them is modified.
 *  Everything below is NEW code, added from the outside.
 *
 *  In 00-bad-design this was 4 edits to the same 150-line method.
 * ============================================================
 */
const OrderService       = require('./OrderService');
const DiscountStrategy   = require('./discount/DiscountStrategy');
const PercentageDiscount = require('./discount/PercentageDiscount');
const PaymentMethod      = require('./payment/PaymentMethod');
const FlatRateTax        = require('./tax/FlatRateTax');

// ---- NEW BEHAVIOUR #1: a rule that needs customer history ----
class FirstOrderDiscount extends DiscountStrategy {
  apply(total, order) {
    return order.isFirstOrder ? total * 0.5 : total;
  }
}

// ---- NEW BEHAVIOUR #2: a whole new gateway ----
class CryptoPayment extends PaymentMethod {
  validate(order) {
    if (!order.wallet || !order.wallet.startsWith('0x')) throw new Error('Invalid wallet');
  }
  charge(order, amount) {
    console.log(`[coinbase] transfer ${amount} to ${order.wallet}`);
    return 'btc_' + Math.random().toString(36).slice(2, 10);
  }
}

// ---- PLUG THEM IN (no core file touched) ----
const service = new OrderService();
service.discounts
  .register('DIWALI30',   new PercentageDiscount(30))
  .register('FIRSTORDER', new FirstOrderDiscount());
service.payments.register('crypto', new CryptoPayment());
service.taxes.register('JP', new FlatRateTax(0.10));

console.log('\n=== NEW COUPON + NEW GATEWAY + NEW COUNTRY ===');
service.placeOrder({
  customerEmail: 'nikhil@example.com',
  country: 'JP',
  couponCode: 'DIWALI30',
  paymentMethod: 'crypto',
  wallet: '0xABC123',
  isFirstOrder: true,
  items: [{ name: 'Monitor', price: 10000, qty: 1 }]
});

console.log('\n=== US ORDER: same country, DIFFERENT state, different tax ===');
service.placeOrder({
  customerEmail: 'john@example.com',
  country: 'US', state: 'OR',            // Oregon = 0% sales tax
  paymentMethod: 'paypal',
  items: [{ name: 'Monitor', price: 10000, qty: 1 }]
});
