const TaxPolicy = require('./TaxPolicy');

/**
 * ============================================================
 *  WHY WE USED CLASSES AND NOT A CONFIG MAP
 * ============================================================
 *  You might think: "just use { IN: 0.18, US: 0.07 }".
 *  Then the US ships this rule at you:
 *    - tax depends on the STATE, not the country
 *    - Delaware / Oregon have NO sales tax
 *
 *  A rate map cannot express that. A class can, and no other
 *  country's tax file has to know this madness exists.
 * ============================================================
 */
class UsSalesTax extends TaxPolicy {
  constructor() {
    super();
    this.stateRates = { CA: 0.0725, NY: 0.04, TX: 0.0625, DE: 0, OR: 0 };
  }
  calculate(total, order) {
    const rate = this.stateRates[order.state] ?? 0.07;   // 0.07 = federal fallback
    return total * rate;
  }
}
module.exports = UsSalesTax;
