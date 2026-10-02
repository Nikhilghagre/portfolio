const fs = require('fs');
const path = require('path');

/**
 * REASON TO CHANGE: the DATABASE.
 * JSON file today, Postgres tomorrow, Mongo next year.
 * All that churn is now trapped inside these 15 lines.
 *
 * This pattern (hide storage behind a class) has a name:
 * >>> the REPOSITORY PATTERN <<<  - we will formalise it in Step 5.
 */
class OrderRepository {
  constructor(file = path.join(__dirname, 'orders.json')) {
    this.file = file;
  }

  save(record) {
    const db = fs.existsSync(this.file)
      ? JSON.parse(fs.readFileSync(this.file, 'utf8'))
      : [];
    db.push(record);
    fs.writeFileSync(this.file, JSON.stringify(db, null, 2));
    console.log(`[db] saved order ${record.id}`);
    return record;
  }
}
module.exports = OrderRepository;
