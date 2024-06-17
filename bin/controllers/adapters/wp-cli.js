const { Client } = require('ssh2');
const DatabaseAdapter = require('./BaseDBAdapter.js');
const { readConfig } = require('../../util/configuration.js');
const { sshConnectOptions } = require('../../util/ssh.js');
const settings = require('../../util/settings.js');
const { waitForFile, replacePrefixInFile } = require('../../util/helpers.js');
const { assetPull, assetPush } = require('../assetSync.js');

const config = readConfig();

class WPCLIAdapter extends DatabaseAdapter {
  static get CAPABILITIES() {
    return {
      ...DatabaseAdapter.CAPABILITIES,
      pushImportDatabase: true,
      pullImportDatabase: true,
      pushExportDatabase: true,
      pullExportDatabase: true,
    };
  }
  async pullExportDatabase() {
    return new Promise((resolve, reject) => {
      const conn = new Client();

      conn.on('ready', () => {
        console.log('SSH connection established');

        conn.exec(
          `cd ${config.remote.path} && wp search-replace "${config.remote.host}" "${config.local.host}" --export="${settings.components.database}" --report-changed-only`,
          (err, stream) => {
            if (err) {
              console.error('Error exporting the database:', err);
              conn.end();
              reject(err);
              return;
            }

            console.log('Database export started');

            stream
              .on('data', (data) => {
                console.log(data.toString()); // Real-time output from stdout
              })
              .stderr.on('data', (data) => {
                console.error(data.toString()); // Real-time output from stderr
              })
              .on('close', async (code, signal) => {
                console.log('Database export completed');
                conn.end();

                await assetPull(
                  config.remote.path + settings.components.database,
                  config.local.path,
                );

                await waitForFile(config.local.path + settings.components.database);

                await replacePrefixInFile(config.local.path + settings.components.database, config.remote.database.prefix, config.local.database.prefix);

                resolve(); // Resolve the promise after the export and asset pull are completed
              });
          },
        );
      });

      conn.on('error', (err) => {
        console.error('SSH connection error:', err);
        reject(err);
      });

      conn.on('end', () => {
        console.log('SSH connection closed');
      });

      conn.connect(sshConnectOptions(config));
    });
  }

  // TODO: This is just a prototype that has been reverse-engineered by AI from the pullExportDatabase. Needs a lot of validation and revision before it is ready.
  async pushImportDatabase() {
    // Push assets to remote server first
    await assetPush(
      config.local.path + settings.components.database,
      config.remote.path,
    );

    // Now a promise wrapper for the rest of the operations
    return new Promise((resolve, reject) => {
      const conn = new Client();

      conn.on('ready', () => {
        console.log('SSH connection established');

        conn.exec(
          `cd ${config.remote.path} && wp db import "${settings.components.database}"`,
          async (err, stream) => {
            if (err) {
              console.error('Error importing the database:', err);
              conn.end();
              reject(err);
              return;
            }

            stream
              .on('data', (data) => {
                console.log(data.toString());
              })
              .stderr.on('data', (data) => {
              console.error(data.toString());
            })
              .on('close', async (code, signal) => {
                console.log('Remote database import completed.');
                conn.end();

                resolve();
              });
          },
        );
      });

      conn.on('error', (err) => {
        console.error('SSH connection error:', err);
        reject(err);
      });

      conn.on('end', () => {
        console.log('SSH connection closed');
      });

      conn.connect(sshConnectOptions(config));
    });
  }
}

module.exports.WPCLIAdapter = WPCLIAdapter;
