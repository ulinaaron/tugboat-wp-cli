const { spawn } = require('child_process');

const { readConfig } = require('../util/configuration.js');
const settings = require('../util/settings.js');
const DatabaseAdapter = require('./BaseDBAdapter.js');

const config = readConfig();

class WPCLIAdapter extends DatabaseAdapter {
  async exportDatabase() {
    // Implement the logic to export the database using WP-CLI
  }

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
}

module.export = WPCLIAdapter;
