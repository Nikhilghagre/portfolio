/**
 * ============================================================
 *  THE CANONICAL EXAMPLE (interviews always ask this one)
 * ============================================================
 *  "A square IS-A rectangle" is true in MATHEMATICS.
 *  It is FALSE in OOP, and this file shows why.
 * ============================================================
 */
class Rectangle {
  constructor(w, h) { this._w = w; this._h = h; }
  setWidth(w)  { this._w = w; }
  setHeight(h) { this._h = h; }
  get area()   { return this._w * this._h; }
}

class Square extends Rectangle {
  // a square must keep sides equal, so it "helpfully" syncs them
  setWidth(w)  { this._w = w; this._h = w; }
  setHeight(h) { this._w = h; this._h = h; }
}

/** Written against Rectangle. Perfectly reasonable code. */
function resizeAndCheck(rect) {
  rect.setWidth(5);
  rect.setHeight(4);
  console.log(`   expected area 20, got ${rect.area}`);
  return rect.area === 20;
}

console.log('Rectangle:'); console.log('   pass =', resizeAndCheck(new Rectangle(1, 1)));
console.log('Square:');    console.log('   pass =', resizeAndCheck(new Square(1, 1)));

console.log(`
WHY IT BROKE
  Rectangle promises: "setting height leaves width alone."
  Square breaks that promise. The caller can't see it coming.

THE LESSON
  IS-A in OOP is not about real-world taxonomy.
  It is about BEHAVIOURAL SUBSTITUTABILITY.
  Ask: "can this subclass keep every promise the parent made?"
  If no -> it is NOT a subclass, no matter what your biology teacher said.

THE FIX
  - Make Rectangle IMMUTABLE (no setters -> no promise to break), or
  - Make Shape the base with a read-only 'area', and let
    Rectangle and Square be siblings, not parent and child.

FAMOUS COUSINS OF THIS BUG
  Bird.fly()      -> Penguin extends Bird ... throws
  Stack extends ArrayList -> someone calls add(0, x) and corrupts the stack
  ReadOnlyList extends List -> add() throws
  All the same mistake: inheriting a promise you cannot keep.
`);
