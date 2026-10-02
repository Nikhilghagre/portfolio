/**
 * REASON TO CHANGE: the MARKETING team.
 *
 * !! NOTE !!  The if/else chain is STILL HERE on purpose.
 * SRP only says "put it in its own box".
 * It does NOT say "stop editing the box".
 * Step 2 (OCP) is what kills this chain.
 */
class DiscountCalculator {
  apply(total, order) {
    let discounted = total;

    if (order.couponCode === 'FLAT10') {
      discounted = total - 10;
    } else if (order.couponCode === 'PERCENT20') {
      discounted = total - total * 0.20;
    } else if (order.couponCode === 'BLACKFRIDAY') {
      discounted = total - total * 0.50;
    } else if (order.couponCode === 'BUY2GET1') {
      const totalQty = order.items.reduce((s, i) => s + i.qty, 0);
      if (totalQty >= 3) discounted = total - Math.min(...order.items.map(i => i.price));
    }

    return discounted < 0 ? 0 : discounted;
  }
}
module.exports = DiscountCalculator;
