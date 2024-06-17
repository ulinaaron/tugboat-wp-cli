const { MySQLAdapter } = require('./mysql');
const { readConfig } = require('../../util/configuration.js');
const config = readConfig();

class LocalWPAdapter extends MySQLAdapter {
  pullImportDatabase() {
    const socketPath = config.local.database.localwp.socket;
    const username = 'root';
    const password = 'root';
    const database = 'local';

    // Call superclass method with new values
    super.pullImportDatabase(socketPath, username, password, database);
  }

  pushExportDatabase() {
    const socketPath = config.local.database.localwp.socket;
    const username = 'root';
    const password = 'root';
    const database = 'local';

    // Call superclass method with new values
    super.pushExportDatabase(socketPath, username, password, database);
  }
}

module.exports.LocalWPAdapter = LocalWPAdapter;