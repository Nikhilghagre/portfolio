const PaymentResult = require('./PaymentResult');

/**
 * ============================================================
 *  THE HONEST PAYMENT CONTRACT
 * ============================================================
 *  Note what is NOT here: refund().
 *  Not every payment method can refund, so putting refund() in
 *  the base FORCES subclasses to lie ("throw not supported").
 *
 *  RULE: never put a method in a base class that some subclass
 *  will have to refuse. That refusal IS the LSP violation.
 *  -> see Refundable.js for the fix (and hello, Step 4: ISP)
 * ============================================================
 *
 *  CONTRACT:
 *   - accepts(order, amount) : may this method be used at all?
 *       Callers ask FIRST. Limits are now part of the contract,
 *       not a surprise exception halfway through checkout.
 *   - validate(order)        : throws if required data is missing
 *   - pay(order, amount)     : returns a PaymentResult. Never null.
 */
class PaymentMethod {
  get name() { return this.constructor.name; }

  /** Subclasses may NARROW this - but callers must ask first. */
  accepts(order, amount) { return true; }

  validate(order) {}

  /** @returns {PaymentResult} */
  pay(order, amount) {
    throw new Error(`${this.name} must implement pay()`);
  }
}
module.exports = PaymentMethod;
