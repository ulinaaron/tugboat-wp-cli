class DatabaseAdapter {
  importDatabase() {
    this.pushImportDatabase();
    this.pullImportDatabase();
  }

  pushImportDatabase() {
    // Remote Import
    console.log('Import database on remote');
  }

  pullImportDatabase() {
    // Local Import
    console.log('Import database on local');
  }

  exportDatabase() {
    this.pushExportDatabase();
    this.pullExportDatabase();
  }

  pushExportDatabase() {
    // Local Export
    console.log('Export database on local');
  }

  pullExportDatabase() {
    // Remote Export
    console.log('Export database on remote');
  }
}

module.exports = DatabaseAdapter;
