# Why `instanceof RefundablePayment` dies in production

| # | Production reality | What breaks |
|---|---|---|
| 1 | **A gateway has many capabilities** (refund, partial refund, recurring, tokenize, 3DS, payouts) | single inheritance -> 2^n combination classes |
| 2 | **Capability depends on CONFIG, not on the class** | Stripe supports refunds — but *this merchant* is not KYC-approved for them, or the account is in a region where refunds are disabled. Same class, different capability. `instanceof` is fixed at code-write time and can never express that. |
| 3 | **Capability depends on the TRANSACTION** | you can refund a card charge for 6 months, then never again. UPI refunds only within 24h. It is not "can this class refund", it is "can this class refund THIS payment TODAY". |
| 4 | **The object crosses a process boundary** | the gateway list comes from a DB row, a config service, or another microservice over HTTP. A JSON object is not `instanceof` anything. |
| 5 | **Plugins / third-party gateways** | a partner ships a gateway class. It cannot extend YOUR `RefundablePayment` unless it imports your package and matches your version. |

Add the everyday ones:
- **mocks and test doubles** are not `instanceof` your class
- `instanceof` breaks across duplicated copies of a module (two `node_modules` copies = two different classes = false)

## The production answer

**Stop asking about the TYPE. Ask the OBJECT what it can do.**

```js
if (gateway.supports(Capability.REFUND)) ...     // data, not type
```

Capabilities become **declared data**, which means they can be:
- combined freely (no class explosion)
- read from config per merchant
- computed per transaction
- serialised over the wire
- validated **at boot**, so a lying gateway can never reach production

That last one is the real win: the check moves from
*"crash at 2am when a customer asks for a refund"*
to *"the service refuses to start"*.
