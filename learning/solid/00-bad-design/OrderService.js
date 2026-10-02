const fs = require('fs');
const path = require('path');

/**
 * ============================================================
 *  THE "GOD CLASS"  -  everything lives here
 * ============================================================
 *  This class works. It ships. Customers are happy.
 *  And it will slowly destroy your team's velocity.
 *
 *  Read it once fully, then read the notes in NOTES.md
 * ============================================================
 */
class OrderService {

  placeOrder(order) {

    // ---------- 1. VALIDATION ----------
    if (!order.customerEmail || !order.customerEmail.includes('@')) {
      throw new Error('Invalid email');
    }
    if (!order.items || order.items.length === 0) {
      throw new Error('Order must have at least one item');
    }
    for (const item of order.items) {
      if (item.qty <= 0) throw new Error(`Bad quantity for ${item.name}`);
      if (item.price < 0) throw new Error(`Bad price for ${item.name}`);
    }

    // ---------- 2. SUB TOTAL ----------
    let total = 0;
    for (const item of order.items) {
      total += item.price * item.qty;
    }
    console.log(`[calc] subtotal = ${total}`);

    // ---------- 3. DISCOUNT ----------
    if (order.couponCode === 'FLAT10') {
      total = total - 10;
    } else if (order.couponCode === 'PERCENT20') {
      total = total - (total * 0.20);
    } else if (order.couponCode === 'BLACKFRIDAY') {
      total = total - (total * 0.50);
    } else if (order.couponCode === 'BUY2GET1') {
      const cheapest = Math.min(...order.items.map(i => i.price));
      if (order.items.reduce((s, i) => s + i.qty, 0) >= 3) total = total - cheapest;
    }
    if (total < 0) total = 0;
    console.log(`[calc] after discount = ${total}`);

    // ---------- 4. TAX ----------
    if (order.country === 'IN') {
      total = total + total * 0.18;
    } else if (order.country === 'US') {
      total = total + total * 0.07;
    } else if (order.country === 'UK') {
      total = total + total * 0.20;
    } else {
      total = total + total * 0.10;
    }
    total = Math.round(total * 100) / 100;
    console.log(`[calc] after tax = ${total}`);

    // ---------- 5. PAYMENT ----------
    let paymentId;
    if (order.paymentMethod === 'card') {
      if (!order.card || order.card.number.length !== 16) {
        throw new Error('Invalid card number');
      }
      console.log(`[stripe] POST https://api.stripe.com/charges  amount=${total}`);
      paymentId = 'ch_' + Math.random().toString(36).slice(2, 10);

    } else if (order.paymentMethod === 'upi') {
      if (!order.upiId || !order.upiId.includes('@')) {
        throw new Error('Invalid UPI id');
      }
      console.log(`[razorpay] POST https://api.razorpay.com/upi  amount=${total}`);
      paymentId = 'upi_' + Math.random().toString(36).slice(2, 10);

    } else if (order.paymentMethod === 'paypal') {
      console.log(`[paypal] POST https://api.paypal.com/v2/payments  amount=${total}`);
      paymentId = 'pp_' + Math.random().toString(36).slice(2, 10);

    } else {
      throw new Error('Unsupported payment method: ' + order.paymentMethod);
    }

    // ---------- 6. SAVE TO "DATABASE" ----------
    const record = {
      id: 'ORD-' + Date.now(),
      email: order.customerEmail,
      items: order.items,
      total,
      paymentId,
      status: 'PAID',
      createdAt: new Date().toISOString()
    };

    const dbFile = path.join(__dirname, 'orders.json');
    let db = [];
    if (fs.existsSync(dbFile)) {
      db = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
    }
    db.push(record);
    fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
    console.log(`[db] saved order ${record.id}`);

    // ---------- 7. NOTIFY CUSTOMER ----------
    console.log(`[smtp] connecting to smtp.gmail.com:587 ...`);
    console.log(`[smtp] To: ${order.customerEmail}`);
    console.log(`[smtp] Subject: Your order ${record.id} is confirmed`);
    if (order.phone) {
      console.log(`[twilio] SMS to ${order.phone}: Order ${record.id} confirmed, paid ${total}`);
    }

    // ---------- 8. INVOICE ----------
    let invoice = `-------- INVOICE --------\n`;
    invoice += `Order: ${record.id}\n`;
    for (const item of order.items) {
      invoice += `${item.name} x${item.qty} = ${item.price * item.qty}\n`;
    }
    invoice += `TOTAL: ${total}\n`;
    invoice += `-------------------------`;
    console.log(invoice);

    // ---------- 9. AUDIT LOG ----------
    fs.appendFileSync(
      path.join(__dirname, 'audit.log'),
      `${new Date().toISOString()} ORDER ${record.id} ${total}\n`
    );

    return record;
  }
}

module.exports = OrderService;
