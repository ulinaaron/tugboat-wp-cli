const { spawn } = require('child_process');

const { readConfig } = require('../../util/configuration.js');
const settings = require('../../util/settings.js');
const DatabaseAdapter = require('./BaseDBAdapter.js');

const config = readConfig();

class WPCLIAdapter extends DatabaseAdapter {
  /**
   * Exports the database based on the current asset direction.
   *
   * @return {string} The command to export the database.
   */
  async exportDatabase() {
    this.pullExportDatabase();
    this.pushExportDatabase();
  }

  /**
   * Import the database asynchronously.
   *
   * @return {undefined} - No return value.
   */
  async importDatabase() {
    const importCommand =
      'wp db import ' + config.local.path + settings.components.database;

    const importProcess = spawn(importCommand, { shell: true });

    importProcess.stdout.on('data', (data) => {
      console.log(data.toString()); // Real-time output from stdout
    });

    importProcess.stderr.on('data', (data) => {
      console.error(data.toString()); // Real-time output from stderr
    });

    importProcess.on('close', (code) => {
      console.log('Database import completed');
    });
  }

  pullExportDatabase() {}

  pushExportDatabase() {}
}

module.export = WPCLIAdapter;
