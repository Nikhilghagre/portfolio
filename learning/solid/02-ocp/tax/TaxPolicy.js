/** Contract: given a total and the order, return the tax AMOUNT (not the new total). */
class TaxPolicy {
  calculate(total, order) {
    throw new Error(`${this.constructor.name} must implement calculate()`);
  }
}
module.exports = TaxPolicy;
