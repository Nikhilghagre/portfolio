# Step 5 — DIP (Dependency Inversion Principle)

> 1. **High-level modules must not depend on low-level modules.
>    Both must depend on an abstraction.**
> 2. **The abstraction must not depend on details.
>    Details must depend on the abstraction.**

Plain version: **your business logic must not know what database,
what email vendor, or what framework you use.**

## The one-word smell

```js
constructor() {
  this.store = new MySqlOrderStore();   // <-- this
}
```

> A class containing real logic should never say `new` for anything
> that touches the outside world: db, http, files, email, clock, random.

## Three words people mix up

| Term | Meaning |
|---|---|
| **DI** (Dependency Injection) | the *technique*: pass dependencies in, don't create them |
| **IoC** (Inversion of Control) | the *idea*: someone else decides what you get |
| **DIP** | the *principle*: **plus** the abstraction belongs to the high-level side |

**DI alone is not DIP.** You can inject a concrete `MySqlOrderStore` and
still be fully coupled to MySQL. DIP needs the abstraction *and* the
right owner for it.

## Where the "inversion" actually is (`simple/3-the-inversion.js`)

```
BEFORE                      AFTER
OrderService                OrderService
     |                           |
     v                           v
MySqlOrderStore            OrderStore  <<interface>>   <- owned by business
                                 ^
                                 |
                           MySqlOrderStore             <- points UP
```

The low-level module's arrow now points **up**. That flip is the inversion.

### Who owns the interface — the part most tutorials skip

The interface lives **next to the business code**, and is written in
**business words**:

```js
// WRONG - database language leaking into your domain
executeQuery(sql); beginTransaction(); getConnectionPool();

// RIGHT - business language
save(order); findByCustomer(email);
```

Read your interface out loud. If it sounds like a *tool*, the wrong
team owns it. If it sounds like your *business*, you got it right.

### Two tests for "did I really invert it?"

1. **Delete the whole database folder.** Does the business logic still
   make sense and compile? Yes -> inverted. No -> you only did injection.
2. Can you run every unit test with **no docker, no network**? Yes -> inverted.

## "Then who calls `new`?" (`simple/4-composition-root.js`)

**ONE** place, at the edge of the app: the **composition root**
(`index.js` / `main.js` / `server.js`).

```
index.js       <- the ONLY 'new'. Knows every vendor.
   v
services/      <- business rules. Zero vendors, zero 'new'.
   v
interfaces/    <- OrderStore, Mailer, Logger (business words)
   ^
adapters/      <- mysql, smtp, stripe... all point UPWARD
```

`production`, `development` and `test` become three **wirings** of the
same business code. That is why the dev wiring can use a fake mailer and
never email a real customer by accident.

## Constructor injection vs the alternatives

| Style | Verdict |
|---|---|
| **Constructor** `new Svc(store, mailer)` | **Default. Use this.** Dependencies are visible and mandatory. |
| Setter `svc.setStore(x)` | only for genuinely optional things; object can exist half-built |
| Service locator `container.get('store')` | avoid — hides dependencies, just a global in disguise |

You do **not** need a DI framework (inversify, awilix, nest). Plain
constructor arguments plus one composition root is enough for most apps.

## Don't over-apply this

Do not create an interface for everything. An interface earns its place when:
- it crosses a boundary you might swap (db, vendor, queue, clock), **or**
- it makes something testable that otherwise isn't.

A `PriceCalculator` that is pure arithmetic needs **no** interface —
it has no vendor and is already testable.

> Invert dependencies that point at the **outside world**.
> Leave pure logic alone.

## Run it
```
node 05-dip/simple/1-problem.js
node 05-dip/simple/2-fix.js
node 05-dip/simple/3-the-inversion.js
node 05-dip/simple/4-composition-root.js
```
