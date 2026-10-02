/**
 * Production detail that has nothing to do with SOLID but will
 * bite you anyway: NEVER store money as a float.
 *   0.1 + 0.2 === 0.30000000000000004
 * Store integer minor units (paise / cents).
 */
class Money {
  constructor(minorUnits, currency = 'INR') {
    if (!Number.isInteger(minorUnits)) throw new Error('Money must be an integer (minor units)');
    this.minorUnits = minorUnits;
    this.currency   = currency;
    Object.freeze(this);
  }
  static fromMajor(amount, currency = 'INR') {
    return new Money(Math.round(amount * 100), currency);
  }
  isGreaterThan(other) { return this.minorUnits > other.minorUnits; }
  toString() { return `${this.currency} ${(this.minorUnits / 100).toFixed(2)}`; }
}
module.exports = Money;
