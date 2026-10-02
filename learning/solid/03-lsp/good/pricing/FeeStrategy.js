/**
 * ============================================================
 *  FIX 2: THE HONEST FIX IS USUALLY A MODELLING FIX
 * ============================================================
 *  SurchargeDiscount wasn't a coding mistake. It was a LIE
 *  about the domain: "a fee is a kind of discount".
 *
 *  It is not. They are opposites.
 *
 *  90% of LSP violations are the same story: someone forced an
 *  "is-a" relationship that isn't true, because the base class
 *  happened to be conveniently plugged in already.
 *
 *  Ask out loud: "is a COD surcharge A KIND OF discount?"
 *  If the sentence sounds wrong in English, the code is wrong too.
 * ============================================================
 */
class FeeStrategy {
  /** @returns {number} the fee AMOUNT to ADD (always >= 0) */
  calculate(total, order) {
    throw new Error(`${this.constructor.name} must implement calculate()`);
  }
}

class NoFee extends FeeStrategy {
  calculate() { return 0; }
}

class CodFee extends FeeStrategy {
  constructor(percent = 2) { super(); this.percent = percent; }
  calculate(total) { return total * (this.percent / 100); }
}

class FlatShippingFee extends FeeStrategy {
  constructor(amount) { super(); this.amount = amount; }
  calculate() { return this.amount; }
}

module.exports = { FeeStrategy, NoFee, CodFee, FlatShippingFee };
