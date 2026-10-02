/**
 * ============================================================
 *  FIX 1: WRITE THE CONTRACT DOWN, THEN ENFORCE IT IN CODE
 * ============================================================
 *  In step 2 the contract was one line: "implement apply()".
 *  That was too weak - SurchargeDiscount honoured the SIGNATURE
 *  while betraying the MEANING.
 *
 *  A real contract has three parts:
 *    PRECONDITION  - what the caller must guarantee
 *    POSTCONDITION - what the subclass must guarantee
 *    INVARIANT     - what stays true no matter what
 *
 *  Below, `apply()` is the TEMPLATE METHOD (a design pattern):
 *  the base class owns the skeleton + the checks, and subclasses
 *  only fill in the one hole `calculate()`.
 *
 *  Now a lying subclass CANNOT ship silently - it throws on the
 *  first test run instead of overcharging a customer in prod.
 * ============================================================
 */
class DiscountStrategy {

  /** TEMPLATE METHOD - final, subclasses must NOT override this. */
  apply(total, order) {
    // --- precondition ---
    if (typeof total !== 'number' || total < 0) {
      throw new Error('DiscountStrategy: total must be a number >= 0');
    }

    const result = this.calculate(total, order);

    // --- postcondition: the promise every discount makes ---
    if (typeof result !== 'number' || Number.isNaN(result)) {
      throw new Error(`${this.constructor.name} must return a number`);
    }
    if (result > total) {
      throw new Error(
        `${this.constructor.name} violates the discount contract: ` +
        `returned ${result} which is MORE than ${total}. ` +
        `A discount can never increase the total. Use a FeeStrategy instead.`
      );
    }
    if (result < 0) {
      throw new Error(`${this.constructor.name} returned a negative total`);
    }
    return result;
  }

  /** THE HOLE subclasses fill. */
  calculate(total, order) {
    throw new Error(`${this.constructor.name} must implement calculate()`);
  }
}
module.exports = DiscountStrategy;
