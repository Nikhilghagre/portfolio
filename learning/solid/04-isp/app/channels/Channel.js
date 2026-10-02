/**
 * The tiny interface. ONE method.
 * Compare with 01-srp/NotificationService.js, which hardcoded
 * "email AND sms" inside one method and knew both vendors.
 */
class Channel {
  get name() { return this.constructor.name; }
  /** @returns {boolean} can this channel reach THIS customer? */
  canReach(order) { return true; }
  send(order, record) { throw new Error(`${this.name} must implement send()`); }
}
module.exports = Channel;
