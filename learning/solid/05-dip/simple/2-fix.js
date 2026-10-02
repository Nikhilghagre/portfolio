// =====================================================
//  DIP - PART 2: THE FIX
// =====================================================
//  Don't CREATE your dependencies. ASK for them.
//  (that "asking" is called DEPENDENCY INJECTION)
// =====================================================

class OrderService {
  // it no longer says 'new'. It just receives what it needs.
  constructor(store, mailer) {
    this.store  = store;
    this.mailer = mailer;
  }
  placeOrder(order) {
    this.store.save(order);
    this.mailer.send(order.email, 'Order confirmed');
    return { ok: true };
  }
}

// ---- production wiring ----
class MySqlOrderStore { save(o) { console.log('[mysql] INSERT'); } }
class SmtpMailer      { send(to, m) { console.log(`[smtp] -> ${to}`); } }

console.log('--- production ---');
new OrderService(new MySqlOrderStore(), new SmtpMailer()).placeOrder({ email: 'a@b.com' });

// ---- swap the database: OrderService was NOT touched ----
class PostgresOrderStore { save(o) { console.log('[postgres] INSERT'); } }
console.log('\n--- moved to postgres, zero changes to OrderService ---');
new OrderService(new PostgresOrderStore(), new SmtpMailer()).placeOrder({ email: 'a@b.com' });

// ---- and NOW you can test it, with no DB and no emails ----
console.log('\n--- unit test: fakes, 2 lines each ---');
const fakeStore  = { saved: [],  save(o) { this.saved.push(o); } };
const fakeMailer = { sent:  [],  send(to, m) { this.sent.push({ to, m }); } };

new OrderService(fakeStore, fakeMailer).placeOrder({ email: 'test@test.com' });

console.log('order was saved:  ', fakeStore.saved.length === 1);
console.log('email was sent to:', fakeMailer.sent[0].to);
console.log('no DB was touched, no email left the building');

console.log(`
WHAT CHANGED
  Before: OrderService CREATED its tools -> stuck with them forever.
  After:  OrderService RECEIVES its tools -> works with any of them.

  Same class, three different setups: mysql, postgres, and fakes.

REMEMBER
  >> A class with business logic should never contain 'new'
  >> for things that touch the outside world (db, http, files, email).
`);
