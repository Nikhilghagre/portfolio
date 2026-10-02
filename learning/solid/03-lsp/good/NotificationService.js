/**
 * REASON TO CHANGE: how we talk to customers.
 * Add WhatsApp -> only this file.
 *
 * (Still not perfect: it hardcodes "email AND sms".
 *  Steps 2 & 4 fix that.)
 */
class NotificationService {
  notify(order, record) {
    console.log(`[smtp] To: ${order.customerEmail} | Subject: Order ${record.id} confirmed`);
    if (order.phone) {
      console.log(`[twilio] SMS to ${order.phone}: Order ${record.id} confirmed, paid ${record.total}`);
    }
  }
}
module.exports = NotificationService;
