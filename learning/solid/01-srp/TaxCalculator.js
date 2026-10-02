/**
 * REASON TO CHANGE: the GOVERNMENT.
 * Marketing changing a coupon must NEVER force us to touch this file.
 * (if/else still here -> fixed in Step 2)
 */
class TaxCalculator {
  apply(total, country) {
    let rate;
    if (country === 'IN') rate = 0.18;
    else if (country === 'US') rate = 0.07;
    else if (country === 'UK') rate = 0.20;
    else rate = 0.10;

    return Math.round((total + total * rate) * 100) / 100;
  }
}
module.exports = TaxCalculator;
