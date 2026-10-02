// =====================================================
//  LSP, THE SIMPLE VERSION - PART 3: THE SILENT KILLER
// =====================================================
//  Part 1 crashed, so you would find it fast.
//  This one never crashes. It just quietly charges the
//  customer the wrong amount. Those are the expensive bugs.
// =====================================================

class Discount {
  apply(total) { return total; }
}

class TenPercentOff extends Discount {
  apply(total) { return total - total * 0.10; }     // 1000 -> 900   good
}

class CodExtraCharge extends Discount {
  apply(total) { return total + 50; }               // 1000 -> 1050  BAD
}

// The caller. Simple, correct-looking code.
function checkout(discount) {
  const finalPrice = discount.apply(1000);
  console.log('customer pays:', finalPrice);
}

console.log('--- no error anywhere, but look at the last line ---');
checkout(new Discount());          // 1000
checkout(new TenPercentOff());     // 900
checkout(new CodExtraCharge());    // 1050  <-- a DISCOUNT made it MORE EXPENSIVE

console.log(`
WHAT WENT WRONG
  'Discount' has an UNWRITTEN promise:
        "the price after a discount is never higher than before."

  Nothing in the code says that. It lives in your head.
  CodExtraCharge broke it, and nothing complained.

THE REAL MISTAKE
  A surcharge is NOT a kind of discount. They are opposites.
  Somebody used 'extends Discount' just because it was convenient.

TRY SAYING IT OUT LOUD
  "A COD extra charge IS A KIND OF discount."
  Sounds wrong in English -> it is wrong in code.

THE FIX
  Make a separate 'Fee' class. Don't fake a family relationship.
`);

// -------- the fix, in 6 lines --------
class Fee { calculate(total) { return 0; } }
class CodFee extends Fee { calculate(total) { return 50; } }

function checkoutFixed(discount, fee) {
  console.log('customer pays:', discount.apply(1000) + fee.calculate(1000));
}
console.log('--- fixed: discount and fee are separate things ---');
checkoutFixed(new TenPercentOff(), new CodFee());   // 900 + 50 = 950
