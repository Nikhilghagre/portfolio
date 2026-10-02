const { test } = require('node:test');
const assert   = require('node:assert');

const TaxCalculator      = require('./TaxCalculator');
const DiscountCalculator = require('./DiscountCalculator');
const PriceCalculator    = require('./PriceCalculator');
const OrderValidator     = require('./OrderValidator');

/**
 * THIS FILE IS THE WHOLE POINT OF STEP 1.
 *
 * In 00-bad-design, writing ANY of these tests was impossible,
 * because touching the tax logic also charged a card and wrote a file.
 *
 * Now each test runs in microseconds. No network. No disk. No mocks.
 */

test('India tax is 18%', () => {
  assert.strictEqual(new TaxCalculator().apply(100, 'IN'), 118);
});

test('unknown country falls back to 10%', () => {
  assert.strictEqual(new TaxCalculator().apply(100, 'XX'), 110);
});

test('PERCENT20 takes 20% off', () => {
  const order = { couponCode: 'PERCENT20', items: [] };
  assert.strictEqual(new DiscountCalculator().apply(1000, order), 800);
});

test('discount never makes the total negative', () => {
  const order = { couponCode: 'FLAT10', items: [] };
  assert.strictEqual(new DiscountCalculator().apply(5, order), 0);
});

test('subtotal multiplies price by qty', () => {
  const items = [{ price: 2000, qty: 1 }, { price: 800, qty: 2 }];
  assert.strictEqual(new PriceCalculator().subtotal(items), 3600);
});

test('empty cart is rejected', () => {
  assert.throws(
    () => new OrderValidator().validate({ customerEmail: 'a@b.com', items: [] }),
    /at least one item/
  );
});
