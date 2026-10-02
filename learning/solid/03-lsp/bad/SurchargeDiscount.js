const DiscountStrategy = require('../../02-ocp/discount/DiscountStrategy');

/**
 * ============================================================
 *  LIE #1 - "Cash on delivery costs us money, so charge +2%"
 * ============================================================
 *  The dev needed a price adjustment. DiscountStrategy already
 *  plugs into the pricing pipeline. So... reuse it, right?
 *
 *  It EXTENDS DiscountStrategy.
 *  It IMPLEMENTS apply(total, order).
 *  It compiles. It runs. Tests pass. Code review approves.
 *
 *  And it breaks an UNWRITTEN promise:
 *      "a discount never increases the total"
 *
 *  That promise lives nowhere in the code - only in every
 *  developer's head. Which is exactly why it gets broken.
 * ============================================================
 */
class SurchargeDiscount extends DiscountStrategy {
  apply(total, order) {
    return total + total * 0.02;      // <-- goes UP
  }
}
module.exports = SurchargeDiscount;
