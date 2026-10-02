const TaxPolicy = require('./TaxPolicy');

/** The boring 90% case: one country, one rate. */
class FlatRateTax extends TaxPolicy {
  constructor(rate) {
    super();
    this.rate = rate;
  }
  calculate(total) {
    return total * this.rate;
  }
}
module.exports = FlatRateTax;
