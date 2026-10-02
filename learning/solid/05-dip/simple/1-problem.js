// =====================================================
//  DIP - PART 1: THE PROBLEM
// =====================================================

class MySqlOrderStore {
  save(order) { console.log('[mysql] INSERT INTO orders ...'); }
}

class SmtpMailer {
  send(to, msg) { console.log(`[smtp] connecting to gmail... sending to ${to}`); }
}

class OrderService {
  constructor() {
    // THE PROBLEM IS THESE TWO LINES
    this.store  = new MySqlOrderStore();   // welded to MySQL
    this.mailer = new SmtpMailer();        // welded to Gmail
  }
  placeOrder(order) {
    this.store.save(order);
    this.mailer.send(order.email, 'Order confirmed');
    return { ok: true };
  }
}

console.log('--- it works ---');
new OrderService().placeOrder({ email: 'a@b.com' });

console.log(`
WHY THIS IS BAD

1. YOU CANNOT TEST IT.
   Every test hits a real MySQL and sends a real email.
   No DB running? Test fails. Wrong email sent to a customer? Oops.

2. YOU CANNOT SWAP ANYTHING.
   Move to Postgres -> edit OrderService.
   Move to SendGrid  -> edit OrderService.
   OrderService is your BUSINESS LOGIC. It should not care
   which database or which email vendor you use.

3. THE DEPENDENCY POINTS THE WRONG WAY.

      OrderService  ---->  MySqlOrderStore
      (important,          (a replaceable detail)
       business rules)

   Your most valuable code depends on your most replaceable code.
   That is upside down.

THE ROOT CAUSE
   >> The word 'new' inside a class that has real logic.
`);
