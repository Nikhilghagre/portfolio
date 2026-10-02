const fs = require('fs');
const path = require('path');

/** REASON TO CHANGE: compliance / audit requirements. */
class AuditLogger {
  constructor(file = path.join(__dirname, 'audit.log')) {
    this.file = file;
  }
  log(message) {
    fs.appendFileSync(this.file, `${new Date().toISOString()} ${message}\n`);
  }
}
module.exports = AuditLogger;
