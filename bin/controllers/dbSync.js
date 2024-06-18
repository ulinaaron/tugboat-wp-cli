const getDatabaseAdapters = require("./dbAdapters.js");
const { readConfig } = require("../util/configuration.js");
const chalk = require("chalk");

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
  try {
    if (direction === "pull") {
      console.log(chalk.blue("Starting pull process..."));
      await adapters.remote.callMethod("pullExportDatabase");
      await adapters.local.callMethod("pullImportDatabase");
      console.log(
        chalk.green("Success! The remote database has been imported."),
      );
    } else if (direction === "push") {
      console.log(chalk.blue("Starting push process..."));
      await adapters.local.callMethod("pushExportDatabase");
      await adapters.remote.callMethod("pushImportDatabase");
      console.log(
        chalk.green(
          "Success! The local database has been pushed to the remote..",
        ),
      );
    }
  } catch (error) {
    console.error(
      chalk.red("Error during database export and asset pull:"),
      error,
    );
    // Handle the error
  }
}

module.exports = databaseSync;
