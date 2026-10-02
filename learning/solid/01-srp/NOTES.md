# Step 1 — SRP (Single Responsibility Principle)

> **A class should have only ONE reason to change.**

Not "one function". Not "small class". **One reason to change.**

## The test question

For each class ask: *"Who is the one person/team that can make me edit this file?"*
If you can name TWO different people, the class breaks SRP.

| Class | Who makes it change |
|---|---|
| `OrderValidator`      | Product team (business rules) |
| `PriceCalculator`     | Pricing team |
| `DiscountCalculator`  | Marketing team |
| `TaxCalculator`       | Government |
| `PaymentProcessor`    | Payment gateway vendor |
| `OrderRepository`     | DBA / infra |
| `NotificationService` | Growth / comms team |
| `InvoiceGenerator`    | Finance / legal |
| `AuditLogger`         | Compliance |
| `OrderService`        | Whoever changes the checkout SEQUENCE |

Ten classes, ten distinct owners. Zero overlap. That is SRP.

## What we gained

1. **Testability.** `test.js` — 6 unit tests, no disk, no network, no mocks.
   In Step 0 this was literally impossible.
2. **Blast radius.** A coupon bug can no longer break payments — different file.
3. **Readability.** `placeOrder()` now reads like the business process in English.
4. **Parallel work.** 4 devs, 4 files, no merge conflicts.

## SRP myths — get these right

| Myth | Truth |
|---|---|
| "SRP means one method per class" | No. A class can have 10 methods if they serve one reason to change. |
| "More files = better" | No. Splitting things that change TOGETHER is just as bad. |
| "SRP fixes everything" | No — see below. |

## What SRP did NOT fix (deliberately!)

Open `DiscountCalculator.js`. The `if/else` chain is **still there**.
To add `DIWALI30` you must still EDIT existing, working, tested code.

SRP said "put it in its own box".
It never said "stop opening the box".

Same for `TaxCalculator` and `PaymentProcessor`.

Also open `OrderService.js` constructor:
```js
this.repository = new OrderRepository();   // hardcoded!
```
The orchestrator builds its own dependencies. It is welded to the JSON-file
repository. Swapping in Postgres, or a fake repo for testing, is impossible.

=> if/else chains are fixed by **Step 2: OCP**
=> `new` in the constructor is fixed by **Step 5: DIP**

## Run it
```
node 01-srp/run.js
node --test 01-srp/test.js
```
