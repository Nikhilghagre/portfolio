/**
 * ============================================================
 *  OPTION A  -  YOUR IDEA:  a RefundablePayment SUBCLASS
 * ============================================================
 *      PaymentMethod            (what EVERYONE can do)
 *        |            \
 *        |             CashOnDelivery
 *        |
 *      RefundablePayment        (adds refund())
 *        |          \
 *      CardPayment   PaypalPayment
 *
 *  This is CORRECT. It does not break LSP:
 *   - COD is a PaymentMethod -> can keep every promise. TRUE.
 *   - Card is a RefundablePayment -> can keep every promise. TRUE.
 *  Nobody is forced to refuse a method. That was the whole goal.
 *
 *  It is also SIMPLER than mixins. For most apps, USE THIS.
 * ============================================================
 */
class PaymentMethod {
  get name() { return this.constructor.name; }
  accepts(order, amount) { return true; }
  validate(order) {}
  pay(order, amount) { throw new Error(`${this.name} must implement pay()`); }
}

/** The extra capability, as a plain subclass. */
class RefundablePayment extends PaymentMethod {
  refund(reference, amount) { throw new Error(`${this.name} must implement refund()`); }
}

class CardPayment extends RefundablePayment {
  pay(o, amt)          { return { status: 'SETTLED', reference: 'ch_1' }; }
  refund(ref, amt)     { console.log(`[stripe] refund ${ref} ${amt}`); return true; }
}

class PaypalPayment extends RefundablePayment {
  pay(o, amt)          { return { status: 'SETTLED', reference: 'pp_1' }; }
  refund(ref, amt)     { console.log(`[paypal] refund ${ref} ${amt}`); return true; }
}

class CashOnDeliveryPayment extends PaymentMethod {          // NOT refundable
  pay(o, amt)          { return { status: 'PENDING', reference: 'cod_1' }; }
}

// --- the caller asks with instanceof, which is now HONEST ---
function refundAll(methods) {
  for (const m of methods) {
    if (m instanceof RefundablePayment) m.refund('ref_x', 100);
    else console.log(`   skip ${m.name} - not refundable`);
  }
}

console.log('OPTION A (subclass):');
refundAll([new CardPayment(), new CashOnDeliveryPayment(), new PaypalPayment()]);
