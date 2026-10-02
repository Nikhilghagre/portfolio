const OrderService          = require('../../02-ocp/OrderService');
const SurchargeDiscount     = require('./SurchargeDiscount');
const CashOnDeliveryPayment = require('./CashOnDeliveryPayment');
const PaypalPayment         = require('../../02-ocp/payment/PaypalPayment');

const service = new OrderService();
service.discounts.register('CODFEE', new SurchargeDiscount());
service.payments.register('cod',     new CashOnDeliveryPayment());

const base = {
  customerEmail: 'nikhil@example.com',
  country: 'IN',
  address: 'Pune',
  items: [{ name: 'Headphones', price: 1000, qty: 1 }]
};

console.log('\n########  DAMAGE 1: a "discount" that raises the price  ########');
const r1 = service.placeOrder({ ...base, couponCode: 'CODFEE', paymentMethod: 'paypal' });
console.log(`>> customer applied a COUPON and paid MORE: ${r1.total} (no coupon would be 1180)`);

console.log('\n########  DAMAGE 2: order marked PAID with no payment  ########');
const r2 = service.placeOrder({ ...base, paymentMethod: 'cod' });
console.log(`>> status=${r2.status}  paymentId=${r2.paymentId}  <-- money never collected`);

console.log('\n########  DAMAGE 3: subclass rejects what the base accepts  ########');
try {
  service.placeOrder({ ...base, paymentMethod: 'cod',
                       items: [{ name: 'Laptop', price: 90000, qty: 1 }] });
} catch (e) {
  console.log(`>> CRASH mid-checkout: "${e.message}"`);
  console.log('>> OrderService has no idea this method had a limit. Nothing in the contract said so.');
}

console.log('\n########  DAMAGE 4: a refund loop that dies on one bad order  ########');
const gateways = [new PaypalPayment(), new CashOnDeliveryPayment(), new PaypalPayment()];
try {
  gateways.forEach((g, i) => {
    if (typeof g.refund === 'function') { g.refund(); }
    else { console.log(`   order ${i}: no refund support`); }
  });
} catch (e) {
  console.log(`>> Refund batch ABORTED at order 1: "${e.message}"`);
  console.log('>> Order 2 never got refunded. Customer is angry. This is an LSP violation.');
}
