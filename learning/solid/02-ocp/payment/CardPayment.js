const PaymentMethod = require('./PaymentMethod');

class CardPayment extends PaymentMethod {
  validate(order) {
    if (!order.card || String(order.card.number).length !== 16) {
      throw new Error('Invalid card number');
    }
  }
  charge(order, amount) {
    console.log(`[stripe] POST /charges amount=${amount}`);
    return 'ch_' + Math.random().toString(36).slice(2, 10);
  }
}
module.exports = CardPayment;
