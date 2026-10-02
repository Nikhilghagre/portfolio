/**
 * ============================================================
 *  OPTION B  -  MIXIN:  capabilities STACK instead of branching
 * ============================================================
 *  A mixin is just a FUNCTION that takes a class and returns a
 *  new class with extra behaviour bolted on. Nothing magic.
 *
 *      const refundable = (Base) => class extends Base { ... }
 *
 *  Because it is a function, you can nest calls:
 *
 *      class CardPayment extends recurring(refundable(PaymentMethod)) {}
 *                                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 *                                 built at runtime: PaymentMethod
 *                                   -> +refund -> +scheduleMonthly
 *
 *  This is how JS fakes MULTIPLE INHERITANCE.
 *  No combination classes. No copy-paste. No 2^n explosion.
 * ============================================================
 */
class PaymentMethod {
  get name() { return this.constructor.name; }
  pay() { throw new Error('implement pay()'); }
}

const REFUNDABLE = Symbol('Refundable');
const RECURRING  = Symbol('Recurring');

const refundable = (Base) => class extends Base {
  get [REFUNDABLE]() { return true; }
  refund() { throw new Error(`${this.name} must implement refund()`); }
};

const recurring = (Base) => class extends Base {
  get [RECURRING]() { return true; }
  scheduleMonthly() { throw new Error(`${this.name} must implement scheduleMonthly()`); }
};

const canRefund   = (m) => Boolean(m && m[REFUNDABLE]);
const canRecur    = (m) => Boolean(m && m[RECURRING]);

// ---- each class declares EXACTLY the capabilities it truly has ----
class CardPayment extends recurring(refundable(PaymentMethod)) {
  pay() { return 'ch_1'; }
  refund() { console.log('[stripe] refund'); return true; }
  scheduleMonthly() { console.log('[stripe] subscription created'); return true; }
}

class PaypalPayment extends refundable(PaymentMethod) {
  pay() { return 'pp_1'; }
  refund() { console.log('[paypal] refund'); return true; }
}

class UpiPayment extends recurring(PaymentMethod) {
  pay() { return 'upi_1'; }
  scheduleMonthly() { console.log('[upi] autopay mandate'); return true; }
}

class CashOnDeliveryPayment extends PaymentMethod {
  pay() { return 'cod_1'; }
}

const all = [new CardPayment(), new PaypalPayment(), new UpiPayment(), new CashOnDeliveryPayment()];

console.log('capability matrix (matches reality exactly):');
console.table(all.map(m => ({ method: m.name, refund: canRefund(m), recurring: canRecur(m) })));

console.log('\nrefund batch:');
all.forEach(m => canRefund(m) ? m.refund() : console.log(`   skip ${m.name}`));

console.log('\nsubscription batch:');
all.forEach(m => canRecur(m) ? m.scheduleMonthly() : console.log(`   skip ${m.name}`));
