const DatabaseAdapter = require('./BaseDBAdapter.js');

class WPCLIAdapter extends DatabaseAdapter {
  pullExportDatabase() {}
}

module.exports.WPCLIAdapter = WPCLIAdapter;
