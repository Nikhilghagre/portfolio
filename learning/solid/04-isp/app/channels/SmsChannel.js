const Channel = require('./Channel');
class SmsChannel extends Channel {
  canReach(order) { return Boolean(order.phone); }
  send(order, record) {
    console.log(`[twilio] SMS ${order.phone}: Order ${record.id} confirmed, ${record.total}`);
  }
}
module.exports = SmsChannel;
