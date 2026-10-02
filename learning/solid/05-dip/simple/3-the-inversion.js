// =====================================================
//  DIP - PART 3: WHERE IS THE "INVERSION"?
// =====================================================
//  Part 2 was Dependency INJECTION. Useful, but not the
//  whole principle. DIP has a second half that decides
//  WHO OWNS THE INTERFACE.
//
//  The full statement:
//   1. High-level modules must not depend on low-level modules.
//      BOTH must depend on an abstraction.
//   2. The abstraction must not depend on details.
//      Details must depend on the abstraction.
// =====================================================

console.log(`
WITHOUT DIP - the arrow points down
-----------------------------------
      OrderService            (high level: business rules)
            |
            v
      MySqlOrderStore         (low level: a detail)

  Business rules depend on MySQL. If MySQL changes, business changes.


WITH DIP - the arrow is INVERTED
--------------------------------
      OrderService            (high level)
            |
            v
      OrderStore  <<interface>>      <-- OWNED BY THE BUSINESS SIDE
            ^
            |
      MySqlOrderStore         (low level implements it)

  The low-level module now points UP at the business rules.
  That upward arrow is the "inversion" in the name.
`);

// ============ THE KEY IDEA: WHO DEFINES THE INTERFACE ============

/**
 * WRONG: the interface is written by the database team, so it leaks
 * database words into your business code.
 */
class BadOrderRepository {
  executeQuery(sql) {}
  beginTransaction() {}
  getConnectionPool() {}
}

/**
 * RIGHT: the interface is written by the BUSINESS side, in BUSINESS words.
 * It describes what checkout NEEDS, not what a database HAS.
 *
 * This file belongs next to OrderService, not next to the DB code.
 */
class OrderStore {
  save(order)               { throw new Error('implement save()'); }
  findByCustomer(email)     { throw new Error('implement findByCustomer()'); }
}

// -------- high level: pure business, knows nothing about storage --------
class OrderService {
  constructor(orderStore) { this.orders = orderStore; }

  placeOrder(order) {
    const past = this.orders.findByCustomer(order.email);
    const isLoyal = past.length >= 3;                 // a BUSINESS rule
    const record = { ...order, loyal: isLoyal };
    this.orders.save(record);
    return record;
  }
}

// -------- low level: adapters, each points UP at OrderStore --------
class MySqlOrderStore extends OrderStore {
  save(order)           { console.log('[mysql] INSERT'); }
  findByCustomer(email) { console.log('[mysql] SELECT'); return [1, 2, 3]; }
}

class MongoOrderStore extends OrderStore {
  save(order)           { console.log('[mongo] insertOne'); }
  findByCustomer(email) { console.log('[mongo] find'); return []; }
}

class InMemoryOrderStore extends OrderStore {
  constructor() { super(); this.rows = []; }
  save(order)           { this.rows.push(order); }
  findByCustomer(email) { return this.rows.filter(r => r.email === email); }
}

console.log('--- same business logic, three different worlds ---');
console.log('mysql :', new OrderService(new MySqlOrderStore()).placeOrder({ email: 'a@b.com' }));
console.log('mongo :', new OrderService(new MongoOrderStore()).placeOrder({ email: 'a@b.com' }));
console.log('memory:', new OrderService(new InMemoryOrderStore()).placeOrder({ email: 'a@b.com' }));

console.log(`
THE TEST FOR "DID I ACTUALLY INVERT IT?"

  Ask: if I DELETE the entire database folder, does my business
  logic still COMPILE and make sense?

  - Yes -> you inverted the dependency. Well done.
  - No  -> you only did injection, the arrow still points down.

SECOND TEST - read the interface out loud:
  'executeQuery(sql)'        -> database language. WRONG owner.
  'findByCustomer(email)'    -> business language. RIGHT owner.

  The interface should read like your BUSINESS, not like your tools.
`);
