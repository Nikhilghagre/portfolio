/**
 * Contract for every payment gateway.
 *
 * Two methods, because each gateway needs DIFFERENT data checked:
 *   - card needs a 16-digit number
 *   - upi  needs an id containing '@'
 * In Step 0 that validation was smeared across the if/else chain.
 * Now each gateway owns its own rules.
 */
class PaymentMethod {
  /** @returns {void} - throws if the order lacks what this gateway needs */
  validate(order) {
    throw new Error(`${this.constructor.name} must implement validate()`);
  }
  /** @returns {string} paymentId */
  charge(order, amount) {
    throw new Error(`${this.constructor.name} must implement charge()`);
  }
}
module.exports = PaymentMethod;
