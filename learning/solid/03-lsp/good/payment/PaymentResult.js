/**
 * ============================================================
 *  FIX 3a: A RICHER RETURN TYPE
 * ============================================================
 *  The old contract said charge() -> paymentId (a string).
 *  COD had no string to give, so it returned null and lied.
 *
 *  When a subclass CANNOT tell the truth inside your contract,
 *  the contract is too narrow. WIDEN IT so every honest
 *  implementation fits.
 *
 *  'SETTLED' = money is in our account.
 *  'PENDING' = money is promised, not received (COD, bank transfer).
 *
 *  Now OrderService can stop blindly writing status:'PAID'.
 * ============================================================
 */
class PaymentResult {
  constructor({ status, reference, amount }) {
    if (!['SETTLED', 'PENDING'].includes(status)) {
      throw new Error('PaymentResult: status must be SETTLED or PENDING');
    }
    if (!reference) throw new Error('PaymentResult: reference is required');
    this.status    = status;
    this.reference = reference;   // never null - always traceable
    this.amount    = amount;
    Object.freeze(this);
  }
  static settled(reference, amount) { return new PaymentResult({ status: 'SETTLED', reference, amount }); }
  static pending(reference, amount) { return new PaymentResult({ status: 'PENDING', reference, amount }); }
}
module.exports = PaymentResult;
