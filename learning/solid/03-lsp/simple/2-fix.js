// =====================================================
//  LSP, THE SIMPLE VERSION - PART 2: THE FIX
// =====================================================
//
//  ONE IDEA:
//  Only put a method in the base class if EVERY child can do it.
//
//  Everybody can pay      -> pay() goes in the base
//  Not everybody can refund -> refund() does NOT go in the base
//
//        Payment              (pay only)
//          |
//          |-- CashPayment            (that's all cash can do)
//          |
//          |-- RefundablePayment      (pay + refund)
//                 |
//                 |-- CardPayment
//                 |-- UpiPayment
// =====================================================

class Payment {
  pay(amount) { console.log('paying', amount); }
  // no refund() here. Cash is off the hook.
}

class RefundablePayment extends Payment {
  refund(amount) { console.log('refunding', amount); }
}

class CardPayment extends RefundablePayment {
  pay(amount)    { console.log('[card] paid', amount); }
  refund(amount) { console.log('[card] refunded', amount); }
}

class UpiPayment extends RefundablePayment {
  pay(amount)    { console.log('[upi] paid', amount); }
  refund(amount) { console.log('[upi] refunded', amount); }
}

class CashPayment extends Payment {
  pay(amount) { console.log('[cash] paid', amount); }
  // no refund at all - and that is now HONEST
}


// The caller ASKS first, instead of assuming.
function cancelOrder(payment) {
  if (payment instanceof RefundablePayment) {
    payment.refund(100);
  } else {
    console.log('cannot refund this payment - handle manually');
  }
}

console.log('--- everything works now, nothing crashes ---');
cancelOrder(new CardPayment());
cancelOrder(new UpiPayment());
cancelOrder(new CashPayment());

console.log(`
WHAT CHANGED
  Before: base class promised refund -> cash was FORCED to lie.
  After:  base class promises only pay -> cash tells the truth.

  Nothing throws. Nothing is skipped by accident.

REMEMBER THIS ONE LINE
  >> Never put a method in a base class that some child
  >> will have to refuse.
`);
