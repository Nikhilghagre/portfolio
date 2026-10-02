// =====================================================
//  DIP - PART 4: "SO WHO CALLS new?"
// =====================================================
//  The most common beginner question:
//  "If nobody creates their dependencies, who creates anything?"
//
//  ANSWER: ONE place, at the very edge of your app.
//  It is called the COMPOSITION ROOT.
//  In Node it is usually index.js / main.js / server.js.
//
//  Everything else in your codebase becomes 'new'-free.
// =====================================================

// ---------- business layer (no 'new', no vendors) ----------
class OrderService {
  constructor({ store, mailer, logger }) {
    this.store = store; this.mailer = mailer; this.logger = logger;
  }
  placeOrder(order) {
    this.store.save(order);
    this.mailer.send(order.email, 'Order confirmed');
    this.logger.info(`order placed for ${order.email}`);
  }
}

// ---------- adapters (the details) ----------
class MySqlOrderStore   { save(o)      { console.log('[mysql] INSERT'); } }
class InMemoryStore     { constructor(){ this.rows=[]; } save(o){ this.rows.push(o); } }
class SmtpMailer        { send(to)     { console.log(`[smtp] -> ${to}`); } }
class ConsoleMailer     { send(to)     { console.log(`[dev-mailer] pretend email -> ${to}`); } }
class ConsoleLogger     { info(m)      { console.log('[log]', m); } }
class SilentLogger      { info()       {} }


// ==========================================================
//  THE COMPOSITION ROOT - the ONLY file allowed to say 'new'
// ==========================================================
function buildApp(env) {
  if (env === 'production') {
    return new OrderService({
      store:  new MySqlOrderStore(),
      mailer: new SmtpMailer(),
      logger: new ConsoleLogger()
    });
  }
  if (env === 'development') {
    return new OrderService({
      store:  new InMemoryStore(),
      mailer: new ConsoleMailer(),      // never emails a real person
      logger: new ConsoleLogger()
    });
  }
  // test
  return new OrderService({
    store:  new InMemoryStore(),
    mailer: { sent: [], send(to) { this.sent.push(to); } },
    logger: new SilentLogger()
  });
}

console.log('--- production ---');
buildApp('production').placeOrder({ email: 'customer@real.com' });

console.log('\n--- development (no real db, no real email) ---');
buildApp('development').placeOrder({ email: 'dev@local' });

console.log('\n--- test (silent, in memory) ---');
buildApp('test').placeOrder({ email: 'test@test' });
console.log('(nothing printed above - that is the point)');

console.log(`
THE SHAPE OF A DIP-CORRECT APP

  index.js            <- the ONLY 'new'. Knows every vendor.
     |
     v
  services/           <- business rules. Zero vendors. Zero 'new'.
     |
     v
  interfaces/         <- OrderStore, Mailer, Logger (business words)
     ^
     |
  adapters/           <- mysql, smtp, s3, stripe... point UPWARD

  Notice: 'production', 'development' and 'test' are now just
  three different wirings of the SAME business code.

WHAT DIP REALLY BUYS YOU
  - unit tests with no docker, no network, no waiting
  - swap a vendor by editing ONE file
  - your business logic outlives every framework and database
    you will use in your career
`);
