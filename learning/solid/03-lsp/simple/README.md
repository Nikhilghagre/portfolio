# LSP — the beginner version

## The whole principle in one sentence

> **Code written for the parent class must keep working when you
> give it any child class.**

That's it. Everything else is detail.

## A non-code way to feel it

You order **"a car"** from a rental company.
Any car must: start, drive, **brake**.

They hand you a car where pressing the brake throws an error.
It still calls itself a car. Your driving code was correct.
**The car lied.**

That is an LSP violation.

## The 2 shapes it takes (only these 2 matter)

### Shape 1 — the child CANNOT do something the parent promised
`1-problem.js` — cash cannot refund, so it throws.
- Loud. Crashes. You find it quickly.

**Fix (`2-fix.js`): take the method OUT of the base class.**
Only keep in the base what EVERY child can truly do.

```
Payment            (pay only)
 |- CashPayment
 |- RefundablePayment   (pay + refund)
      |- CardPayment
      |- UpiPayment
```

### Shape 2 — the child does something DIFFERENT than the parent meant
`3-the-silent-one.js` — a "discount" that increases the price.
- Silent. No crash. Wrong money. Much worse.

**Fix: stop faking the family relationship.** A fee is not a discount.

## The 2 rules to memorise

1. **Never put a method in a base class that some child must refuse.**
2. **Say "a X IS A KIND OF Y" out loud. If it sounds wrong in English,
   it is wrong in code.**

## The 1 question to ask before writing `extends`

> *"Can this child keep EVERY promise the parent made?"*

- Yes -> `extends` is fine.
- No  -> do not extend. Make a separate class, or split the base.

## Common signs you broke LSP

- `throw new Error('not supported')` inside an override
- `if (x instanceof SomeSpecialCase)` inside the **caller**
- an override that returns `null` where the parent returned a value
- a comment saying "don't call this method on that class"

## Run these in order
```
node 03-lsp/simple/1-problem.js
node 03-lsp/simple/2-fix.js
node 03-lsp/simple/3-the-silent-one.js
```

## When you're ready for the full version

The big files in `03-lsp/good/` are the same 2 ideas, plus 3 extras
you can learn later, one at a time:

| Extra | File | What it adds |
|---|---|---|
| `PaymentResult` | `good/payment/PaymentResult.js` | lets COD say "PENDING" instead of returning null |
| `accepts()` | `good/payment/CashOnDeliveryPayment.js` | declares a limit up front instead of throwing later |
| contract tests | `contract-test.js` | runs the parent's tests against every child, automatically |

Ignore them until the two simple shapes above feel obvious.
