# Step 4 — ISP (Interface Segregation Principle)

> **No client should be forced to depend on methods it does not use.**
>
> In one line: **many small interfaces beat one big one.**

## It has two sides. Learn both.

### Side A — the IMPLEMENTER's pain  (`simple/1-problem.js`)

A fat base class with `sendEmail/sendSms/sendPush/sendWhatsapp` forces
`EmailNotifier` to write 3 empty methods.

Damage:
- empty methods = **silent bugs** (`emailer.sendSms()` does nothing, nobody knows)
- a 5th channel means **editing every existing class**
- the base class knows 4 vendor names; it should know zero

Fix (`simple/2-fix.js`): 4 methods -> **1 method**, `send()`.
Every channel implements exactly what it needs.

### Side B — the CLIENT's pain  (`simple/3-client-side.js`)  <- the real ISP

`CheckoutService` takes an `OrderRepository` with 8 methods and calls **one**.

Nothing crashes. The damage is quieter:

| Cost | Why |
|---|---|
| **Testing** | the fake needs 8 methods, 7 unused |
| **Change ripple** | change `generateReport()` -> every holder must be re-tested |
| **Intent is hidden** | can CheckoutService delete orders? You must read it all |
| **Blast radius** | it holds a live handle to `delete()` and `bulkImport()` it never needed |

Fix: split into `OrderWriter` / `OrderReader`. The dependency becomes honest:
*"I only write orders."* The test fake drops to 3 lines.

> **Interfaces are defined by what the CLIENT needs,
> not by what the implementation happens to have.**

One class can serve several small interfaces at once. The same
`SqlOrderStore` is an `OrderWriter` to checkout and an `OrderReader`
to the search page. Same object, narrow views.

## ISP vs LSP — the confusion everybody has

| | LSP | ISP |
|---|---|---|
| About | **behaviour** | **coupling** |
| Question | "does the child keep the parent's promises?" | "does anyone depend on more than they use?" |
| Symptom | a child that lies / throws / returns null | empty methods, huge test fakes |
| Who suffers | the **caller**, at runtime | the **codebase**, over time |
| Broken when | you `extends` something you can't honour | your interface has too many methods |

They meet in one place: a fat interface is the most common *cause* of an
LSP violation. Fix the interface (ISP) and the lie disappears (LSP).
That's why removing `refund()` from the base in Step 3 was really an ISP fix.

## In our app (`app/`)

Since Step 1, `NotificationService` hardcoded "email AND sms" in one method.
Now:

```
Channel (send + canReach)
  |- EmailChannel
  |- SmsChannel
  |- WhatsappChannel
Notifier  <- fans out, knows the INTERFACE not the classes
```

Four wins visible in `app/demo.js`:
1. each channel decides for itself if it `canReach()` the customer
2. a dead vendor (`firebase 503`) does not fail the order
3. a new channel = one new file, zero edits (OCP came free)
4. `Notifier` never mentions email, sms or whatsapp

## Don't over-apply this

One interface per method is **not** the goal. That's just a fat interface
smeared over 20 files.

Group by **who uses it together**:
- `save()` + `findById()` are usually used by the same client -> keep together
- `generateReport()` is used by nobody in checkout -> split it out

> Split along the seams of **usage**, not alphabetically.

Rule of thumb: if two clients need different halves of an interface,
that interface is two interfaces.

## Run it
```
node 04-isp/simple/1-problem.js
node 04-isp/simple/2-fix.js
node 04-isp/simple/3-client-side.js
node 04-isp/app/demo.js
```
