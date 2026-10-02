const FlatRateTax = require('./FlatRateTax');
const UsSalesTax  = require('./UsSalesTax');

class TaxRegistry {
  constructor() {
    this.policies = new Map();
    this.default_ = new FlatRateTax(0.10);

    this.register('IN', new FlatRateTax(0.18));
    this.register('UK', new FlatRateTax(0.20));
    this.register('AE', new FlatRateTax(0.05));
    this.register('US', new UsSalesTax());        // the weird one, quarantined
  }
  register(country, policy) {
    this.policies.set(country, policy);
    return this;
  }
  resolve(country) {
    return this.policies.get(country) || this.default_;
  }
}
module.exports = TaxRegistry;
