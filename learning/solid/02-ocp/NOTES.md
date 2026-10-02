# Step 2 — OCP (Open/Closed Principle)

> **Software should be OPEN for extension, CLOSED for modification.**
> New behaviour arrives as a NEW FILE, not an edit to an old one.

## Why editing working code is the enemy

Every time you edit tested, shipped code you must re-test it and risk a regression.
Every time you ADD a new file, the old code is untouched — it literally cannot break.

That is the whole principle. It is a risk-management rule, not an aesthetic one.

## The pattern that delivers it: STRATEGY

**Strategy pattern** = a family of interchangeable algorithms behind one contract.

```
        DiscountStrategy (contract: apply(total, order))
                 |
   +-------------+-------------+---------------+
FlatDiscount  PercentageDiscount  Buy2Get1  NoDiscount
```

The caller holds a `DiscountStrategy` and never knows which one it has.
That is **polymorphism replacing an if/else chain**.

### The mechanical recipe (memorise this)

1. Find the `if/else` (or `switch`) chain.
2. Each branch becomes a **class**.
3. The thing they have in common becomes the **contract** (base class / interface).
4. A **registry/factory** maps the input key -> the object.
5. The caller now calls ONE method. No branches.

## "But the if/else just moved to the registry!"

Correct, and this is the most important lesson in this step.

**OCP does not delete decisions. It ISOLATES them.**

| | Before | After |
|---|---|---|
| Where the decision lives | tangled inside pricing logic | one dumb lookup map |
| Cost of a new coupon | edit a 150-line method | add a file + 1 registration |
| Can it break payment? | YES | No — different file |
| Can it be added from outside? | No | Yes (`register()`) — see `extend-demo.js` |

`extend-demo.js` adds **2 coupons + 1 gateway + 1 country and modifies ZERO existing files.**
That is the proof.

## Data varies vs. behaviour varies

A rule you will use forever:

| What changes | What you make |
|---|---|
| Only a **number** changes (10% vs 30%) | reuse one class, pass it in the **constructor** |
| The **logic** changes (needs items, needs customer history) | a **new class** |

`FlatDiscount(10)` and `FlatDiscount(500)` = same class.
`Buy2Get1Discount` = new class, because it needs `order.items`.

See `tax/UsSalesTax.js`: a `{ IN: 0.18, US: 0.07 }` config map looks tempting until
the US says "tax depends on the state, and Oregon is 0%". Classes absorb that; maps can't.

## Two more patterns you just used (free of charge)

- **Null Object** — `NoDiscount` returns the total untouched, so callers never null-check.
- **Factory / Registry** — turns a string key into an object.

## Deliberate asymmetry: when to fail loudly

- Unknown **coupon** -> `NoDiscount` (silent, harmless).
- Unknown **payment method** -> `throw` (silence would mean a FREE order).

Same shape, opposite decision. Principles guide you; they do not think for you.

## Don't over-apply this

Do NOT build a strategy hierarchy for an if/else with 2 branches that has
never changed in 3 years. OCP costs indirection — spend it where change
actually happens (payments, pricing, notifications), not everywhere.

Rule of thumb: **write the if/else the first time. Refactor to Strategy the
third time you touch it.**

## Still broken after this step

- `OrderService` constructor still does `new OrderRepository()` -> **DIP**, Step 5.
- `NotificationService` still hardcodes "email AND sms" -> **ISP**, Step 4.
- Nothing yet stops a subclass from LYING about its contract -> **LSP**, Step 3.

## Run it
```
node 02-ocp/run.js
node 02-ocp/extend-demo.js
node --test 02-ocp/test.js
```
