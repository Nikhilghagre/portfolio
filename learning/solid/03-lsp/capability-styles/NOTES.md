# Sidebar — two ways to model a capability

Your reading was right, and it is the important part:

> **The base class holds only what EVERY subclass can honestly do.**
> Anything only SOME can do becomes a separate type.

`PaymentMethod` = `accepts` + `validate` + `pay`. COD can honour all three.
`refund` is not there, because COD would have to refuse it.

Both designs below satisfy that rule. Neither breaks LSP.

## Option A — capability as a SUBCLASS  (your idea)

```
PaymentMethod
  |- CashOnDeliveryPayment
  |- RefundablePayment
       |- CardPayment
       |- PaypalPayment
```

- Plain, boring inheritance. Anyone can read it.
- `m instanceof RefundablePayment` is the honest check.
- **Use this by default.** Simpler is better until it isn't.

## Option B — capability as a MIXIN

```js
const refundable = (Base) => class extends Base { refund() {...} };
class CardPayment extends recurring(refundable(PaymentMethod)) {}
```

A mixin is just a function: takes a class, returns a subclass. Nothing magic.

## The one thing that decides between them: **how many capabilities?**

| Capabilities | Winner |
|---|---|
| 1 | **Option A** — subclass. Less machinery. |
| 2+ that combine freely | **Option B** — mixin. |

### Why A breaks at 2 (`optionA-breaks.js`)

|        | refund? | recurring? |
|--------|---------|------------|
| Card   | YES     | YES        |
| Paypal | YES     | no         |
| UPI    | no      | YES        |
| COD    | no      | no         |

JavaScript has **single inheritance**. Card needs both, so you must invent
`RefundableRecurringPayment` and copy-paste one contract into it.

- 2 capabilities -> 4 combination classes
- 3 capabilities -> 8
- **2^n class explosion**

And worse, it silently lies:
```
card instanceof RecurringPayment  ->  false
```
even though Card *can* do subscriptions — because its parent chain
happened to route through `RefundablePayment`.

Mixins stack instead of branching, so the capability matrix matches reality.

## In TypeScript / Java / C#, this whole debate disappears

There you just declare multiple interfaces:

```ts
class CardPayment extends PaymentMethod implements Refundable, Recurring {}
```

Mixins are the JavaScript workaround for not having that.

## The rule to remember

> Inheritance answers **"what IS it?"** — one answer only.
> Capabilities answer **"what CAN it do?"** — many answers.
> Never model a many-answer question with a one-answer tool.

## Run it
```
node 03-lsp/capability-styles/optionA-subclass.js
node 03-lsp/capability-styles/optionA-breaks.js
node 03-lsp/capability-styles/optionB-mixin.js
```
