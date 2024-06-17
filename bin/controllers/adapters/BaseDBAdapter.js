class DatabaseAdapter {
  static get CAPABILITIES() {
    return {
      pushImportDatabase: false,
      pullImportDatabase: false,
      pushExportDatabase: false,
      pullExportDatabase: false,
    };
  }

  callMethod(methodName, ...params) {
    if (
      !(methodName in this.constructor.CAPABILITIES) ||
      !this.constructor.CAPABILITIES[methodName]
    ) {
      throw new Error(
        `The method '${methodName}' is not supported by this adapter.`,
      );
    }
    this[methodName](...params);
  }

  pullExportDatabase() {
    // Remote Export
    console.log('Export database on remote');
  }
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
}

module.exports = DatabaseAdapter;
