/**
 * Fanning out to many channels is its own job (SRP),
 * so it is its own class - separate from any channel.
 *
 * Note: it knows the Channel INTERFACE, not any channel CLASS.
 */
class Notifier {
  constructor(channels = []) { this.channels = channels; }

  add(channel) { this.channels.push(channel); return this; }

  notify(order, record) {
    for (const channel of this.channels) {
      if (!channel.canReach(order)) {
        console.log(`   (skip ${channel.name}: customer not reachable)`);
        continue;
      }
      try {
        channel.send(order, record);
      } catch (err) {
        // one dead vendor must not fail the whole order
        console.log(`   (${channel.name} failed: ${err.message} - order still fine)`);
      }
    }
  }
}
module.exports = Notifier;
