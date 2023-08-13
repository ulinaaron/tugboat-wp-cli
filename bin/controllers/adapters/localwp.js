const DatabaseAdapter = require('./BaseDBAdapter');

class LocalWPAdapter extends DatabaseAdapter {
  async exportDatabase() {
    // Implement the logic to export the database using Local WP.
  }

  async importDatabase() {
    // Implement the logic to import the database using Local WP.
  }
}

module.export = LocalWPAdapter;
