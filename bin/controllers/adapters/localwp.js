const DatabaseAdapter = require('./BaseDBAdapter');
const { MySQLAdapter } = require('./mysql');
const { readConfig } = require('../../util/configuration.js');
const config = readConfig();

class LocalWPAdapter extends MySQLAdapter {
  static get CAPABILITIES() {
    return {
      ...DatabaseAdapter.CAPABILITIES,
      pullImportDatabase: true,
      pushExportDatabase: true
    };
  }

  pullImportDatabase() {
    // Call superclass method with new values
    super.pullImportDatabase(config.local.database.localwp);
  }

  pushExportDatabase() {
    // Call superclass method with new values
    super.pushExportDatabase(config.local.database.localwp);
  }
}

module.exports.LocalWPAdapter = LocalWPAdapter;