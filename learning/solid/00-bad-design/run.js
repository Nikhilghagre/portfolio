const OrderService = require('./OrderService');

const service = new OrderService();

const order = {
  customerEmail: 'nikhil@example.com',
  phone: '+919999999999',
  country: 'IN',
  couponCode: 'PERCENT20',
  paymentMethod: 'card',
  card: { number: '4111111111111111' },
  items: [
    { name: 'Keyboard', price: 2000, qty: 1 },
    { name: 'Mouse',    price: 800,  qty: 2 }
  ]
};

const saved = service.placeOrder(order);
console.log('\nRESULT:', saved);
