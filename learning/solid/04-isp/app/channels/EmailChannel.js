const Channel = require('./Channel');
class EmailChannel extends Channel {
  canReach(order) { return Boolean(order.customerEmail); }
  send(order, record) {
    console.log(`[smtp] To: ${order.customerEmail} | Order ${record.id} confirmed`);
  }
}
module.exports = EmailChannel;
