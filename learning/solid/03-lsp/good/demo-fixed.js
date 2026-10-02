const OrderService     = require('./OrderService');
const RefundService    = require('./RefundService');
const DiscountStrategy = require('./pricing/DiscountStrategy');

const service = new OrderService();

console.log('\n######## FIX 1: a lying discount now CANNOT ship ########');
class SneakySurcharge extends DiscountStrategy {
  calculate(total) { return total + total * 0.02; }
}
service.discounts.register('CODFEE', new SneakySurcharge());
try {
  service.placeOrder({ customerEmail: 'a@b.com', country: 'IN', couponCode: 'CODFEE',
                       paymentMethod: 'paypal', items: [{ name: 'X', price: 1000, qty: 1 }] });
} catch (e) {
  console.log('>> BLOCKED at runtime:\n   ' + e.message);
}

console.log('\n######## FIX 2: the fee is modelled honestly, price is correct ########');
const cod = service.placeOrder({
  customerEmail: 'a@b.com', country: 'IN', address: 'Pune',
  paymentMethod: 'cod', items: [{ name: 'Headphones', price: 1000, qty: 1 }]
});
console.log(`>> subtotal=${cod.subtotal} fee=${cod.fee} tax=${cod.tax} total=${cod.total}`);
console.log(`>> status=${cod.status}  reference=${cod.paymentReference}  <-- honest, and traceable`);

console.log('\n######## FIX 3: the limit is declared, not sprung mid-checkout ########');
try {
  service.placeOrder({ customerEmail: 'a@b.com', country: 'IN', address: 'Pune',
                       paymentMethod: 'cod', items: [{ name: 'Laptop', price: 90000, qty: 1 }] });
} catch (e) {
  console.log('>> Rejected BEFORE charging, with a useful message:\n   ' + e.message);
}

console.log('\n######## FIX 4: the refund batch no longer aborts ########');
const refunds = new RefundService(service.payments);
console.log('>>', JSON.stringify(refunds.refundAll([
  { id: 'ORD-1', paymentMethod: 'paypal', paymentReference: 'pp_1', total: 100 },
  { id: 'ORD-2', paymentMethod: 'cod',    paymentReference: 'cod_2', total: 200 },
  { id: 'ORD-3', paymentMethod: 'card',   paymentReference: 'ch_3',  total: 300 }
]), null, 2));
