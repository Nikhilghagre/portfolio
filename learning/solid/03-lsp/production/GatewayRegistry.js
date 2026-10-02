const PaymentGateway = require('./PaymentGateway');
const { REQUIRED_METHOD } = require('./Capability');

/**
 * ============================================================
 *  FAIL AT BOOT, NOT AT 2AM
 * ============================================================
 *  This is the part that makes capability-as-data SAFER than
 *  instanceof, not just more flexible.
 *
 *  If a gateway DECLARES 'refund' but has no refund() method,
 *  register() throws during startup. Deploy fails. Nobody's
 *  refund request ever reaches a broken gateway.
 *
 *  With instanceof you would only find out when a real customer
 *  asked for a real refund.
 * ============================================================
 */
class GatewayRegistry {
  constructor() { this.gateways = new Map(); }

  register(gateway) {
    if (!(gateway instanceof PaymentGateway)) {
      throw new Error('register(): not a PaymentGateway');
    }
    if (typeof gateway.pay !== 'function') {
      throw new Error(`${gateway.name}: missing pay()`);
    }

    // THE CHECK: every declared capability must have a real method behind it.
    for (const capability of gateway._capabilities) {
      const method = REQUIRED_METHOD[capability];
      if (!method) throw new Error(`${gateway.name}: unknown capability '${capability}'`);
      if (typeof gateway[method] !== 'function') {
        throw new Error(
          `BOOT FAILED - ${gateway.name} declares capability '${capability}' ` +
          `but has no ${method}() method. Fix the gateway or drop the capability.`
        );
      }
    }

    this.gateways.set(gateway.name, gateway);
    return this;
  }

  get(name) {
    const g = this.gateways.get(name);
    if (!g) throw new Error(`Unknown gateway: ${name}`);
    return g;
  }

  /** Query by capability - replaces every `instanceof` in your callers. */
  withCapability(capability, payment = null) {
    return [...this.gateways.values()]
      .filter(g => payment ? g.canPerform(capability, payment) : g.supports(capability));
  }

  /** Send this to the frontend. Try doing THAT with instanceof. */
  toJSON() { return [...this.gateways.values()].map(g => g.toJSON()); }
}
module.exports = GatewayRegistry;
