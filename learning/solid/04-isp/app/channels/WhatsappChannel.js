const Channel = require('./Channel');
class WhatsappChannel extends Channel {
  canReach(order) { return Boolean(order.phone && order.whatsappOptIn); }
  send(order, record) {
    console.log(`[wa] WhatsApp ${order.phone}: Order ${record.id} confirmed`);
  }
}
module.exports = WhatsappChannel;
