const config = readConfig();

const { WPCLIAdapter } = require('../adapters/wp-cli.js');
const { MySQLAdapter } = require('../adapters/mysql.js');
const { LocalWPAdapter } = require('../adapters/localwp.js');

/**
 * Returns the appropriate database adapter based on the given parameters.
 *
 * @param {string} direction - The direction of the database sync: 'pull' or 'push'.
 * @param {string} localAdapter - The local database adapter: 'wp-cli', 'mysql', or 'localwp'.
 * @param {string} remoteAdapter - The remote database adapter: 'wp-cli' or 'mysql'.
 * @throws {Error} If an invalid direction or database adapter is specified.
 * @return {object} The database adapter instance.
 */
function getDatabaseAdapter(direction, localAdapter, remoteAdapter) {
  let databaseAdapter;

  if (direction === 'pull') {
    if (remoteAdapter === 'wp-cli') {
      databaseAdapter = new WPCLIAdapter(direction);
    } else if (remoteAdapter === 'mysql') {
      databaseAdapter = new MySQLAdapter(direction);
    } else {
      throw new Error(
        `Invalid remote database adapter specified: ${remoteAdapter}`,
      );
    }
  } else if (direction === 'push') {
    if (localAdapter === 'wp-cli') {
      databaseAdapter = new WPCLIAdapter(direction);
    } else if (localAdapter === 'mysql') {
      databaseAdapter = new MySQLAdapter(direction);
    } else if (localAdapter === 'localwp') {
      databaseAdapter = new LocalWPAdapter(direction);
    } else {
      throw new Error(
        `Invalid local database adapter specified: ${localAdapter}`,
      );
    }
  } else {
    throw new Error(`Invalid direction specified: ${direction}`);
  }

  return databaseAdapter;
}

module.exports = getDatabaseAdapter;
