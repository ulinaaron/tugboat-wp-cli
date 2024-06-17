const getDatabaseAdapters = require('./dbAdapters.js');
const { readConfig } = require('../util/configuration.js');

const config = readConfig();

/**
 * Asynchronously synchronizes the database.
 *
 * @param {string} direction - The direction of the synchronization (either 'pull' or 'push').
 * @return {Promise<void>} - A promise that resolves once the synchronization is complete.
 */
async function databaseSync(direction) {
  const localAdapter = config.local.database.adapter;
  const remoteAdapter = config.remote.database.adapter;

  const adapters = getDatabaseAdapters(localAdapter, remoteAdapter);

  if (direction === 'pull') {
    try {
      await adapters.remote.callMethod('pullExportDatabase');
      console.log('Database export and asset pull completed successfully');
      // Perform any additional tasks after the export and asset pull
    } catch (error) {
      console.error('Error during database export and asset pull:', error);
      // Handle the error
    }
    // TODO: This looks incomplete below this line.
    await adapters.local.callMethod('pullImportDatabase');
  } else if (direction === 'push') {
    await adapters.local.callMethod('pushExportDatabase');
    await adapters.remote.callMethod('pushImportDatabase');
  }
}

module.exports = databaseSync;
