const { spawn } = require('child_process');
const { Client } = require('ssh2');

const getDatabaseAdapter = require('./dbAdapters.js');
const { assetPull, assetPush } = require('./assetSync.js');
const { readConfig } = require('../util/configuration.js');
const settings = require('../util/settings.js');
const { sshConnectOptions } = require('../util/ssh.js');

const config = readConfig();

/**
 * Asynchronously synchronizes the database.
 *
 * @param {string} direction - The direction of the synchronization (either 'pull' or 'push').
 * @return {Promise<void>} - A promise that resolves once the synchronization is complete.
 */
async function databaseSync(direction) {
  const { adapter: localAdapter } = config.local.database;
  const { adapter: remoteAdapter } = config.remote.database;

  const databaseAdapter = getDatabaseAdapter(
    direction,
    localAdapter,
    remoteAdapter,
  );

  if (direction === 'pull') {
    await databaseAdapter.pullExportDatabase();
    await databaseAdapter.pullImportDatabase();
  } else if (direction === 'push') {
    await databaseAdapter.pushExportDatabase();
    await databaseAdapter.pushImportDatabase();
  }
}

module.exports = databaseSync;
