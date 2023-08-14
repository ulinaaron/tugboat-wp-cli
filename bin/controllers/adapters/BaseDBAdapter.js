class DatabaseAdapter {
  constructor(direction) {
    this.direction = direction;
  }
  async importDatabase() {
    this.pushImportDatabase();
    this.pullImportDatabase();
  }

  pushImportDatabase() {
    // Implement the logic to push the database using the adapter.
    console.log('Import database on remote');
  }

  pullImportDatabase() {
    // Implement the logic to pull the database using the adapter.
    console.log('Import database on local');
  }

  async exportDatabase() {
    this.pushExportDatabase();
    this.pullExportDatabase();
  }

  pushExportDatabase() {
    // Implement the logic to push the database using the adapter.
    console.log('Export database on local');
  }

  pullExportDatabase() {
    // Implement the logic to pull the database using the adapter.
    console.log('Export database on remote');
  }
}

module.exports = DatabaseAdapter;
