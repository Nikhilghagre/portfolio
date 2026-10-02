const Notifier        = require('./Notifier');
const EmailChannel    = require('./channels/EmailChannel');
const SmsChannel      = require('./channels/SmsChannel');
const WhatsappChannel = require('./channels/WhatsappChannel');
const Channel         = require('./channels/Channel');

const record = { id: 'ORD-1', total: 3398.4 };

console.log('--- customer with email + phone + whatsapp opt-in ---');
const notifier = new Notifier([new EmailChannel(), new SmsChannel(), new WhatsappChannel()]);
notifier.notify({ customerEmail: 'a@b.com', phone: '+9199', whatsappOptIn: true }, record);

console.log('\n--- customer with email only: others skip themselves ---');
notifier.notify({ customerEmail: 'a@b.com' }, record);

console.log('\n--- a vendor is down: the order still completes ---');
class BrokenPushChannel extends Channel {
  send() { throw new Error('firebase 503'); }
}
new Notifier([new EmailChannel(), new BrokenPushChannel()])
  .notify({ customerEmail: 'a@b.com' }, record);

console.log('\n--- new channel added from outside, zero files edited ---');
class SlackChannel extends Channel {
  send(order, r) { console.log(`[slack] #orders: ${r.id} placed`); }
}
notifier.add(new SlackChannel()).notify({ customerEmail: 'a@b.com' }, record);
