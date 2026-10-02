/** Capabilities are DATA, not positions in a class tree. */
const Capability = Object.freeze({
  REFUND:         'refund',
  PARTIAL_REFUND: 'partial_refund',
  RECURRING:      'recurring',
  TOKENIZE:       'tokenize',
});

/** Which method must exist if a gateway claims a capability. Used at boot. */
const REQUIRED_METHOD = Object.freeze({
  [Capability.REFUND]:         'refund',
  [Capability.PARTIAL_REFUND]: 'refund',
  [Capability.RECURRING]:      'scheduleRecurring',
  [Capability.TOKENIZE]:       'tokenize',
});

module.exports = { Capability, REQUIRED_METHOD };
