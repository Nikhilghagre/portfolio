// =====================================================
//  ISP - PART 2: THE FIX  (make the interface TINY)
// =====================================================
//  4 methods -> 1 method.
//  Every channel implements exactly what it needs. Nothing empty.
// =====================================================

class Channel {
  send(message) { throw new Error(`${this.constructor.name} must implement send()`); }
}

class EmailChannel extends Channel {
  send(msg) { console.log('[email]', msg); }
}
class SmsChannel extends Channel {
  send(msg) { console.log('[sms]', msg); }
}
class WhatsappChannel extends Channel {
  send(msg) { console.log('[whatsapp]', msg); }
}

// Adding Telegram = ONE new class. No existing file is touched. (that's OCP too)
class TelegramChannel extends Channel {
  send(msg) { console.log('[telegram]', msg); }
}


// Someone still needs to send on many channels at once.
// That is a SEPARATE job - so it is a separate class.
class Notifier {
  constructor(channels) { this.channels = channels; }
  notify(message) { this.channels.forEach(c => c.send(message)); }
}

console.log('--- customer wants email + whatsapp ---');
new Notifier([new EmailChannel(), new WhatsappChannel()]).notify('Order confirmed');

console.log('\n--- another customer wants sms only ---');
new Notifier([new SmsChannel()]).notify('Order confirmed');

console.log('\n--- add telegram: no existing class was edited ---');
new Notifier([new EmailChannel(), new TelegramChannel()]).notify('Order shipped');

console.log(`
WHAT CHANGED
  before: 1 fat base with 4 methods, every class stubs 3 empty ones
  after:  1 tiny base with 1 method, every class implements exactly 1

  No empty methods -> no silent bugs.
  New channel -> new file only.
  The base class no longer knows any channel names.

REMEMBER
  >> Many small interfaces beat one big one.
`);
