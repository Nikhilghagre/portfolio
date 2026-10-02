# Step 3 — LSP (Liskov Substitution Principle)

> **If code works with a base type, it must keep working when handed ANY
> subtype — without knowing which one it got.**

Barbara Liskov's actual wording, translated: a subclass must keep every
promise its parent made. Not the *signature* — the **promise**.

## Why LSP is the hard one

SRP and OCP violations you can SEE (big file, long if/else).
An LSP violation looks like *good* code. It extends the right base class,
implements every method, passes review — and lies.

The compiler checks **signatures**. Only you can check **meaning**.

## The 4 ways to break it (all four are in `bad/`)

| # | Violation | In our code | Damage |
|---|---|---|---|
| 1 | Break an **invariant** | `SurchargeDiscount` returns MORE than the input | coupon raised the price |
| 2 | **Weaken a postcondition** | COD `charge()` returns `null` | order marked PAID, no money |
| 3 | **Strengthen a precondition** | COD throws above 5000 | crash mid-checkout |
| 4 | **Refuse a method** | COD `refund()` throws | refund batch aborted |

Run `node 03-lsp/bad/demo-broken.js` and watch all four happen.

**Memorise this pair:**
- A subtype may accept **MORE** input than its parent. Never LESS. (preconditions)
- A subtype may promise **MORE** about its output. Never LESS. (postconditions)

> "Require no more, promise no less."

## The 4 fixes (all in `good/`)

### Fix 1 — Make the unwritten contract executable
`pricing/DiscountStrategy.js` uses the **TEMPLATE METHOD pattern**:
the base owns `apply()` (skeleton + pre/post checks), subclasses fill
`calculate()`. A liar now crashes on the first test run instead of in prod.

> If a rule lives only in developers' heads, it WILL be broken.
> Put it in the base class, in an assertion, or in a contract test.

### Fix 2 — Fix the MODEL, not the code
`SurchargeDiscount` wasn't a coding bug, it was a lie about the domain:
"a fee is a kind of discount". It isn't — they're opposites.
So we made `FeeStrategy` a separate concept.

**90% of LSP violations are a false "is-a".** Someone reused a base class
because it was conveniently already wired in.

> Say the sentence out loud: *"a COD surcharge is a kind of discount."*
> If it sounds wrong in English, it is wrong in code.

### Fix 3 — WIDEN the contract so everyone can be honest
COD returned `null` because the contract (`-> paymentId string`) had no
room for "money not received yet".

When a subclass **cannot tell the truth inside your contract, the contract
is too narrow.** So `pay()` now returns a `PaymentResult` with
`SETTLED | PENDING`. COD stopped lying, and `OrderService` stopped
blindly writing `status: 'PAID'`.

### Fix 4 — Capability instead of inheritance
`refund()` was removed from the base entirely. Refundability is now a
marker (`Refundable.js`) you can ASK about.

> **Never put a method in a base class that some subclass must refuse.
> That refusal IS the violation.**

Also: `accepts(order, amount)` turns a hidden limit into a declared one.
**Ask before acting** beats **act and catch**.

## The tool you'll actually use at work: CONTRACT TESTS

`contract-test.js` — write the test suite ONCE against the base type,
then run it against EVERY subtype:

```js
paymentMethodContract('CardPayment',    () => new CardPayment(),   ...);
paymentMethodContract('PaypalPayment',  () => new PaypalPayment(), ...);
paymentMethodContract('CashOnDelivery', () => new CashOnDeliveryPayment(), ...);
```

> **If a subtype cannot pass its base type's test suite, it is not a subtype.**

That single sentence is LSP, made executable. Any new gateway added next
year must pass this suite before it can be registered.

## The canonical example
`node 03-lsp/rectangle-square.js` — a square is a rectangle in maths,
not in OOP. Same family: `Penguin extends Bird` (can't fly),
`ReadOnlyList extends List` (can't add).

## Smell checklist — you are probably breaking LSP if you see:

- `throw new Error('not supported')` in an override
- `if (obj instanceof SpecialCase)` in the CALLER
- an override that silently does nothing
- an override that returns `null` where the parent returned a value
- a subclass adding a restriction the parent never mentioned
- docs saying "don't call X on Y"

## Practical takeaway

**Prefer composition over inheritance.** Most LSP bugs come from
inheriting for code reuse. Inherit to be *substitutable*, not to save typing.

## Run it
```
node 03-lsp/bad/demo-broken.js
node 03-lsp/good/demo-fixed.js
node 03-lsp/rectangle-square.js
node --test 03-lsp/contract-test.js
```
