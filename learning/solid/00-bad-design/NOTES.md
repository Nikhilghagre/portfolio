# Step 0 — The Bad Design

The app: an **Order Checkout System**. One method, `placeOrder()`, does 9 things.

## The 9 jobs inside one method

| # | Job                | Why it changes                          |
|---|--------------------|-----------------------------------------|
| 1 | Validation         | Business rules change                    |
| 2 | Subtotal           | Rarely                                   |
| 3 | Discount           | Marketing team, every festival           |
| 4 | Tax                | Government, every budget                 |
| 5 | Payment            | New gateway / gateway API version bump   |
| 6 | Save to DB         | JSON file -> Postgres -> Mongo           |
| 7 | Notify             | Email -> +SMS -> +WhatsApp -> +Push      |
| 8 | Invoice            | Design/format changes                    |
| 9 | Audit log          | Compliance                               |

**9 different reasons for this one file to change.**
9 different teams touching the same 150 lines => merge conflicts, regressions.

## Concrete pain, not theory

1. **Marketing wants a new coupon `DIWALI30`.**
   You must open the *payment + database + email* file to add it.
   Risk: you break payment while editing a discount.

2. **You want to unit-test the tax calculation.**
   You can't. Calling `placeOrder()` writes a real file, "charges" a card,
   and "sends" an email. There is no seam to test just tax.

3. **Move from JSON file to Postgres.**
   `fs.writeFileSync` is hardcoded in the middle of business logic.
   You must edit the checkout brain to change the storage.

4. **Add WhatsApp notification.**
   Edit `placeOrder()` again. Every new channel = editing the same method.

5. **New payment method `netbanking`.**
   Another `else if`. The chain grows forever. This is the
   **if/else cancer** — every new feature edits old, working code.

## Which SOLID principle each smell breaks

| Smell in the code                                      | Principle broken |
|--------------------------------------------------------|------------------|
| One class does validation+tax+payment+db+email          | **S**RP |
| `if/else` chains for coupon, tax, payment               | **O**CP |
| (we will introduce this smell in step 3)                | **L**SP |
| (we will introduce this smell in step 4)                | **I**SP |
| `fs.writeFileSync`, `stripe`, `smtp` hardcoded inside   | **D**IP |

## The one-line definition of good design

> Good design = **things that change together live together,
> things that change for different reasons live apart.**

Everything we do next is just this sentence, applied 5 ways.
