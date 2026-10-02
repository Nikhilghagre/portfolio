// =====================================================
//  LSP, THE SIMPLE VERSION - PART 1: THE PROBLEM
// =====================================================

// The base class. It says: "every payment can pay AND refund."
class Payment {
  pay(amount)    { console.log('paying', amount); }
  refund(amount) { console.log('refunding', amount); }
}

class CardPayment extends Payment {
  pay(amount)    { console.log('[card] paid', amount); }
  refund(amount) { console.log('[card] refunded', amount); }
}

class CashPayment extends Payment {
  pay(amount)    { console.log('[cash] paid', amount); }
  refund(amount) { throw new Error('Cash cannot be refunded!'); }   // <-- THE LIE
}


// Somebody writes this. It looks totally fine.
// It only knows about "Payment". It does not know about card or cash.
function cancelOrder(payment) {
  payment.refund(100);
}

console.log('--- card works ---');
cancelOrder(new CardPayment());

console.log('\n--- cash CRASHES ---');
try {
  cancelOrder(new CashPayment());
} catch (e) {
  console.log('BOOM:', e.message);
}

console.log(`
WHAT WENT WRONG
  The base class 'Payment' PROMISED that every payment can refund.
  CashPayment cannot keep that promise, so it throws.

  cancelOrder() did nothing wrong. It trusted the promise.

  >> LSP says: if I write code for the PARENT,
  >> it must keep working for EVERY CHILD.
  >> CashPayment broke that. So CashPayment is not really a Payment.
`);
