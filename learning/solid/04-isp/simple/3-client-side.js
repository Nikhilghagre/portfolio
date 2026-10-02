// =====================================================
//  ISP - PART 3: THE PART EVERYONE MISSES
// =====================================================
//  Part 1 was about the class that IMPLEMENTS.
//  This is about the class that USES. That is the real ISP.
//
//  "Clients should not be forced to depend on methods
//   they do not use."
//                       ^^^^^^ CLIENTS. Not implementers.
// =====================================================

// A big repository. Nobody "lied", nobody threw. It's all real code.
class OrderRepository {
  save(order)        { console.log('[db] insert'); }
  findById(id)       { console.log('[db] select by id'); }
  findAll()          { console.log('[db] select all'); }
  update(order)      { console.log('[db] update'); }
  delete(id)         { console.log('[db] delete'); }
  search(query)      { console.log('[db] full text search'); }
  bulkImport(rows)   { console.log('[db] bulk import'); }
  generateReport()   { console.log('[db] heavy report query'); }
}

// This class needs exactly ONE of those 8 methods.
class CheckoutService {
  constructor(repository) { this.repository = repository; }
  checkout(order) {
    this.repository.save(order);        // <- the only method it ever calls
  }
}

console.log('--- works fine ---');
new CheckoutService(new OrderRepository()).checkout({ id: 1 });

console.log(`
SO WHAT'S THE PROBLEM? NOTHING CRASHED.

The problem is COUPLING. CheckoutService now depends on all 8 methods:

  1. TESTING
     To unit-test checkout you must build a fake with 8 methods,
     7 of which are never called. Write that fake for 20 services
     and you will feel it.

  2. CHANGE RIPPLE
     Someone changes generateReport()'s signature.
     Every class holding an OrderRepository is now "affected" and
     must be re-reviewed and re-tested. Including CheckoutService,
     which never calls it.

  3. THE LIE ABOUT INTENT
     Reading the constructor, you cannot tell what CheckoutService
     actually does with the DB. Can it delete orders? You must
     read the whole class to find out.

  4. SECURITY / BLAST RADIUS
     CheckoutService is holding a live handle to delete() and
     bulkImport(). It only ever needed save().
`);

// ---------- THE FIX: split the fat one into small ones ----------

class OrderWriter { save(order) { throw new Error('implement save()'); } }
class OrderReader { findById(id) { throw new Error('implement findById()'); } }

/** The real DB class can provide many small interfaces at once. */
class SqlOrderStore extends OrderWriter {
  save(order)  { console.log('[db] insert'); }
  findById(id) { console.log('[db] select by id'); }
  delete(id)   { console.log('[db] delete'); }
}

/** Now the dependency is HONEST: "I only write orders." */
class BetterCheckoutService {
  constructor(orderWriter) { this.orders = orderWriter; }
  checkout(order) { this.orders.save(order); }
}

console.log('--- after the split ---');
new BetterCheckoutService(new SqlOrderStore()).checkout({ id: 1 });

// and the test double is now 3 lines, not 8
const fakeWriter = { saved: [], save(o) { this.saved.push(o); } };
new BetterCheckoutService(fakeWriter).checkout({ id: 99 });
console.log('fake used in test:', fakeWriter.saved);

console.log(`
THE KEY INSIGHT
  Interfaces are defined by what the CLIENT needs,
  not by what the implementation happens to have.

  One class can serve many small interfaces.
  SqlOrderStore is an OrderWriter to CheckoutService,
  and an OrderReader to a search page. Same object, narrow views.
`);
