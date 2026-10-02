/**
 * THE CONTRACT (in Java/TS this would be an `interface`).
 *
 * JavaScript has no interfaces, so we fake one with a base class
 * that THROWS if you forget to implement the method.
 * This turns "silent wrong behaviour" into a loud crash. Good trade.
 *
 * Every discount in the system promises exactly one thing:
 *   give me a total + the order, I give you the new total.
 */
class DiscountStrategy {
  /**
   * @param {number} total
   * @param {object} order
   * @returns {number} the discounted total
   */
  apply(total, order) {
    throw new Error(`${this.constructor.name} must implement apply()`);
  }
}
module.exports = DiscountStrategy;
