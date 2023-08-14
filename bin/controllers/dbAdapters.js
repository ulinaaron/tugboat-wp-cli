const { WPCLIAdapter } = require('./adapters/wp-cli.js');
const { MySQLAdapter } = require('./adapters/mysql.js');
const { LocalWPAdapter } = require('./adapters/localwp.js');

/**
 * Returns the appropriate database adapter based on the given parameters.
 *
 * @param {string} direction - The direction of the database sync: 'pull' or 'push'.
 * @param {string} localAdapter - The local database adapter: 'wp-cli', 'mysql', or 'localwp'.
 * @param {string} remoteAdapter - The remote database adapter: 'wp-cli' or 'mysql'.
 * @throws {Error} If an invalid direction or database adapter is specified.
 * @return {object} The database adapter instance.
 */
function getDatabaseAdapters(localAdapter, remoteAdapter) {
  const adapters = {};

  if (localAdapter === 'wp-cli') {
    adapters.local = new WPCLIAdapter();
  } else if (localAdapter === 'mysql') {
    adapters.local = new MySQLAdapter();
  } else if (localAdapter === 'localwp') {
    adapters.local = new LocalWPAdapter();
  } else {
    throw new Error(
      `Invalid local database adapter specified: ${localAdapter}`,
    );
  }

  if (remoteAdapter === 'wp-cli') {
    adapters.remote = new WPCLIAdapter();
  } else if (remoteAdapter === 'mysql') {
    adapters.remote = new MySQLAdapter();
  } else {
    throw new Error(
      `Invalid remote database adapter specified: ${remoteAdapter}`,
    );
  }

  return adapters;
}

module.exports = getDatabaseAdapters;
