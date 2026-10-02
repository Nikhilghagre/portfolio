const PaymentMethod = require('./PaymentMethod');

class UpiPayment extends PaymentMethod {
  validate(order) {
    if (!order.upiId || !order.upiId.includes('@')) throw new Error('Invalid UPI id');
  }
  charge(order, amount) {
    console.log(`[razorpay] POST /upi amount=${amount}`);
    return 'upi_' + Math.random().toString(36).slice(2, 10);
  }
}
module.exports = UpiPayment;
