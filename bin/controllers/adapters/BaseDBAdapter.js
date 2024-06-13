class DatabaseAdapter {

  pushImportDatabase() {
    // Remote Import
    console.log('Import database on remote');
  }

  pullImportDatabase() {
    // Local Import
    console.log('Import database on local');
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
