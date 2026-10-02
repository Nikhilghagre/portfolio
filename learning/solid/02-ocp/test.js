const { test } = require('node:test');
const assert   = require('node:assert');

const DiscountRegistry   = require('./discount/DiscountRegistry');
const DiscountStrategy   = require('./discount/DiscountStrategy');
const TaxRegistry        = require('./tax/TaxRegistry');
const PaymentRegistry    = require('./payment/PaymentRegistry');
const PercentageDiscount = require('./discount/PercentageDiscount');
const Buy2Get1Discount   = require('./discount/Buy2Get1Discount');

test('each strategy is testable in isolation', () => {
  assert.strictEqual(new PercentageDiscount(30).apply(1000, {}), 700);
});

test('buy2get1 removes the cheapest item when qty >= 3', () => {
  const order = { items: [{ price: 500, qty: 2 }, { price: 100, qty: 1 }] };
  assert.strictEqual(new Buy2Get1Discount().apply(1100, order), 1000);
});

test('buy2get1 does nothing under 3 items', () => {
  const order = { items: [{ price: 500, qty: 1 }] };
  assert.strictEqual(new Buy2Get1Discount().apply(500, order), 500);
});

test('unknown coupon returns NoDiscount, never null', () => {
  const strategy = new DiscountRegistry().resolve('TOTALLY_FAKE');
  assert.strictEqual(strategy.apply(999, {}), 999);
});

test('unknown payment method throws loudly', () => {
  assert.throws(() => new PaymentRegistry().resolve('barter'), /Unsupported/);
});

test('US tax varies by state - Oregon is free', () => {
  const us = new TaxRegistry().resolve('US');
  assert.strictEqual(us.calculate(1000, { state: 'OR' }), 0);
  assert.strictEqual(us.calculate(1000, { state: 'CA' }), 72.5);
});

test('the base contract crashes if a strategy forgets apply()', () => {
  class Broken extends DiscountStrategy {}
  assert.throws(() => new Broken().apply(100, {}), /must implement apply/);
});

test('OCP: registering a new coupon needs no change to any core file', () => {
  const registry = new DiscountRegistry();
  registry.register('NEWYEAR', new PercentageDiscount(25));
  assert.strictEqual(registry.resolve('NEWYEAR').apply(400, {}), 300);
});
