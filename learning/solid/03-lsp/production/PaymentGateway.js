const { Capability } = require('./Capability');
const { CapabilityNotSupported } = require('./errors');

/**
 * ============================================================
 *  PRODUCTION BASE CLASS
 * ============================================================
 *  Same LSP rule as before - the base contains ONLY what every
 *  gateway can honestly do. The change is HOW we express "extra":
 *
 *      before:  a subclass position    (instanceof RefundablePayment)
 *      now:     declared data          (gateway.supports('refund'))
 *
 *  Why data wins - all five are impossible with instanceof:
 *   1. many capabilities combine freely, no class explosion
 *   2. per-merchant config can switch a capability off
 *   3. per-transaction rules (UPI: refundable only within 24h)
 *   4. survives JSON / HTTP / a DB row
 *   5. third-party gateways don't need your base class
 * ============================================================
 */
class PaymentGateway {

  /**
   * @param {object} config - comes from your config service / DB,
   *                          which is exactly why capability is dynamic.
   */
  constructor({ name, capabilities = [], config = {} } = {}) {
    if (new.target === PaymentGateway) throw new Error('PaymentGateway is abstract');
    this.name = name || this.constructor.name;
    this.config = config;
    this._capabilities = new Set(capabilities);
  }

  // ---------- capability API ----------

  /**
   * STATIC capability: "can this gateway EVER do X, for this merchant?"
   * Note the config check - a class-based design can never do this.
   */
  supports(capability) {
    if (this.config.disabledCapabilities?.includes(capability)) return false;
    return this._capabilities.has(capability);
  }

  /**
   * DYNAMIC capability: "can it do X to THIS payment, right now?"
   * Reality #3: card refunds expire, UPI refunds expire faster.
   * Subclasses narrow this. Default: same as the static answer.
   */
  canPerform(capability, payment) {
    return this.supports(capability);
  }

  /** Guard used by services so the error is uniform and typed. */
  require(capability, payment = null) {
    const ok = payment ? this.canPerform(capability, payment) : this.supports(capability);
    if (!ok) throw new CapabilityNotSupported(this.name, capability);
  }

  // ---------- the contract EVERY gateway must keep ----------

  /** @returns {Promise<{status:'SETTLED'|'PENDING', reference:string}>} */
  async pay(payment) {
    throw new Error(`${this.name} must implement pay()`);
  }

  /** Serialisable - this is what crosses the wire to your frontend/BFF. */
  toJSON() {
    return { name: this.name, capabilities: [...this._capabilities].filter(c => this.supports(c)) };
  }
}
module.exports = PaymentGateway;
