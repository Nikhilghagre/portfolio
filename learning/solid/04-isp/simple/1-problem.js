// =====================================================
//  ISP - PART 1: THE FAT INTERFACE
// =====================================================
//  One big base class that tries to cover every channel.
// =====================================================

class Notifier {
  sendEmail(msg)    { throw new Error('not implemented'); }
  sendSms(msg)      { throw new Error('not implemented'); }
  sendPush(msg)     { throw new Error('not implemented'); }
  sendWhatsapp(msg) { throw new Error('not implemented'); }
}

class EmailNotifier extends Notifier {
  sendEmail(msg) { console.log('[email]', msg); }
  // and now the garbage begins:
  sendSms()      {}   // empty, because email can't send sms
  sendPush()     {}   // empty
  sendWhatsapp() {}   // empty
}

class SmsNotifier extends Notifier {
  sendSms(msg)   { console.log('[sms]', msg); }
  sendEmail()    {}   // empty
  sendPush()     {}   // empty
  sendWhatsapp() {}   // empty
}

console.log('--- it "works" ---');
new EmailNotifier().sendEmail('order confirmed');
new SmsNotifier().sendSms('order confirmed');

console.log('\n--- but look what happens here ---');
const emailer = new EmailNotifier();
emailer.sendSms('URGENT: your order failed');     // silently does NOTHING
console.log('sendSms() returned quietly. The customer was never told.');

console.log(`
THE 3 PROBLEMS

1. EVERY class must write 3 useless empty methods.
   Add a 5th channel (Telegram) -> you must edit EVERY existing class.

2. Empty methods are silent bugs. sendSms() on an emailer does nothing,
   and nobody finds out until a customer complains.

3. The base class knows about 4 channels. It should know about ZERO.

>> ISP: a class should not be forced to have methods it does not need.
`);
