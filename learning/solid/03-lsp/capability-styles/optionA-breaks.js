/**
 * ============================================================
 *  WHERE OPTION A STARTS TO HURT
 * ============================================================
 *  Product adds SUBSCRIPTIONS. Now a second capability exists:
 *      Recurring  -> can charge the customer every month
 *
 *  Reality of who can do what:
 *
 *      method   | refund? | recurring? |
 *      ---------|---------|------------|
 *      Card     |   YES   |    YES     |
 *      Paypal   |   YES   |    NO      |
 *      UPI      |   NO    |    YES     |   (UPI autopay, no auto-refund)
 *      COD      |   NO    |    NO      |
 *
 *  With single inheritance you must build a class for every COMBINATION:
 *
 *      PaymentMethod
 *        |- RefundablePayment              -> Paypal
 *        |- RecurringPayment               -> UPI
 *        |- RefundableRecurringPayment     -> Card    <-- duplicate code!
 *
 *  JavaScript has NO multiple inheritance. So
 *  RefundableRecurringPayment must COPY-PASTE the refund contract
 *  from RefundablePayment. Two sources of truth.
 *
 *  2 capabilities -> 4 combinations
 *  3 capabilities -> 8 combinations   (add Tokenizable, PartialRefund, Installments...)
 *
 *  That is the CLASS EXPLOSION problem: 2^n.
 * ============================================================
 */
class PaymentMethod {
  get name() { return this.constructor.name; }
  pay() { throw new Error('implement pay()'); }
}

class RefundablePayment extends PaymentMethod {
  refund() { throw new Error('implement refund()'); }
}

class RecurringPayment extends PaymentMethod {
  scheduleMonthly() { throw new Error('implement scheduleMonthly()'); }
}

/** Card needs BOTH. JS allows only one parent. So we duplicate. */
class RefundableRecurringPayment extends RefundablePayment {
  scheduleMonthly() { throw new Error('implement scheduleMonthly()'); }   // <-- COPIED
}

class CardPayment extends RefundableRecurringPayment {
  pay() { return 'ch_1'; }
  refund() { console.log('[stripe] refund'); return true; }
  scheduleMonthly() { console.log('[stripe] subscription created'); return true; }
}

class UpiPayment extends RecurringPayment {
  pay() { return 'upi_1'; }
  scheduleMonthly() { console.log('[upi] autopay mandate created'); return true; }
}

const card = new CardPayment();
const upi  = new UpiPayment();

console.log('THE BUG THIS CREATES:');
console.log('  card instanceof RecurringPayment ?', card instanceof RecurringPayment);
console.log('  upi  instanceof RecurringPayment ?', upi  instanceof RecurringPayment);
console.log(`
  Card CAN do subscriptions, but 'card instanceof RecurringPayment' is FALSE,
  because its parent chain went through RefundablePayment instead.

  So this caller silently skips cards:
      if (m instanceof RecurringPayment) m.scheduleMonthly();

  The type system now LIES about what the object can do.
`);
