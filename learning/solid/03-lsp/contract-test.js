const { test, describe } = require('node:test');
const assert = require('node:assert');

const PaymentResult = require('./good/payment/PaymentResult');
const PaymentMethod = require('./good/payment/PaymentMethod');
const { isRefundable } = require('./good/payment/Refundable');

const CardPayment           = require('./good/payment/CardPayment');
const PaypalPayment         = require('./good/payment/PaypalPayment');
const CashOnDeliveryPayment = require('./good/payment/CashOnDeliveryPayment');
const DiscountStrategy      = require('./good/pricing/DiscountStrategy');
const PercentageDiscount    = require('./good/pricing/PercentageDiscount');
const NoDiscount            = require('./good/pricing/NoDiscount');

/**
 * ============================================================
 *  THE CONTRACT TEST  (a.k.a. "the LSP test suite")
 * ============================================================
 *  THIS is how you enforce LSP in a real codebase.
 *
 *  You write the test ONCE against the BASE type, then run it
 *  against EVERY subtype. A new gateway added next year must
 *  pass this suite before it can be registered.
 *
 *  If a subtype cannot pass the base's test suite,
 *  it is not a subtype. That IS the Liskov definition.
 * ============================================================
 */
function paymentMethodContract(name, makeMethod, sampleOrder) {
  describe(`PaymentMethod contract: ${name}`, () => {

    test('is a PaymentMethod', () => {
      assert.ok(makeMethod() instanceof PaymentMethod);
    });

    test('accepts() answers before any money moves', () => {
      assert.strictEqual(typeof makeMethod().accepts(sampleOrder, 100), 'boolean');
    });

    test('pay() returns a PaymentResult, NEVER null', () => {
      const result = makeMethod().pay(sampleOrder, 100);
      assert.ok(result instanceof PaymentResult, 'must return a PaymentResult');
      assert.ok(result.reference, 'reference must never be empty');
      assert.ok(['SETTLED', 'PENDING'].includes(result.status));
    });

    test('validate() throws only for genuinely invalid input', () => {
      assert.doesNotThrow(() => makeMethod().validate(sampleOrder));
    });

    test('if it claims Refundable, refund() actually works', () => {
      const m = makeMethod();
      if (isRefundable(m)) assert.strictEqual(m.refund('ref_1', 100), true);
      else assert.strictEqual(typeof m.refund, 'undefined',
        'a non-refundable method must NOT have a refund() that throws');
    });
  });
}

// Run the SAME suite against all three. This is the whole idea.
paymentMethodContract('CardPayment',   () => new CardPayment(),
  { card: { number: '4111111111111111' } });
paymentMethodContract('PaypalPayment', () => new PaypalPayment(), {});
paymentMethodContract('CashOnDelivery',() => new CashOnDeliveryPayment(),
  { address: 'Pune' });

// ---------- discount contract ----------
function discountContract(name, makeStrategy) {
  describe(`DiscountStrategy contract: ${name}`, () => {
    const order = { items: [{ price: 100, qty: 2 }] };
    test('never increases the total', () => {
      assert.ok(makeStrategy().apply(1000, order) <= 1000);
    });
    test('never goes negative', () => {
      assert.ok(makeStrategy().apply(1, order) >= 0);
    });
    test('is a DiscountStrategy', () => {
      assert.ok(makeStrategy() instanceof DiscountStrategy);
    });
  });
}
discountContract('PercentageDiscount', () => new PercentageDiscount(20));
discountContract('NoDiscount',         () => new NoDiscount());

// ---------- and prove the suite CATCHES a liar ----------
test('the contract suite rejects a lying subclass', () => {
  class Liar extends DiscountStrategy { calculate(total) { return total * 1.5; } }
  assert.throws(() => new Liar().apply(1000, {}), /violates the discount contract/);
});
