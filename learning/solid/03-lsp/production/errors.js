/**
 * Typed errors. In production "throw new Error(string)" is not enough:
 * the caller must decide RETRY vs FAIL vs ALERT, and a string can't tell it.
 */
class PaymentError extends Error {
  constructor(message, { retryable = false, code = 'PAYMENT_ERROR' } = {}) {
    super(message);
    this.name = this.constructor.name;
    this.retryable = retryable;
    this.code = code;
  }
}
class CapabilityNotSupported extends PaymentError {
  constructor(gatewayName, capability) {
    super(`${gatewayName} does not support '${capability}'`,
          { retryable: false, code: 'CAPABILITY_NOT_SUPPORTED' });
    this.gatewayName = gatewayName;
    this.capability  = capability;
  }
}
class GatewayTimeout extends PaymentError {
  constructor(gatewayName) {
    super(`${gatewayName} timed out`, { retryable: true, code: 'GATEWAY_TIMEOUT' });
  }
}
module.exports = { PaymentError, CapabilityNotSupported, GatewayTimeout };
