const DatabaseAdapter = require('./BaseDBAdapter');

class MySQLAdapter extends DatabaseAdapter {
  async exportDatabase() {
    // Implement the logic to export the database using mysql.
  }

  async importDatabase() {
    // Implement the logic to import the database using mysql.
  }
}

module.export = MySQLAdapter;
