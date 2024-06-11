const { Client } = require('ssh2');
const DatabaseAdapter = require('./BaseDBAdapter.js');
const { readConfig } = require('../../util/configuration.js');
const { sshConnectOptions } = require('../../util/ssh.js');
const settings = require('../../util/settings.js');
const { assetPull } = require('../assetSync.js');

const config = readConfig();

class WPCLIAdapter extends DatabaseAdapter {
  pullExportDatabase() {
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
              .on('close', (code, signal) => {
                console.log('Database export completed');
                conn.end();

                assetPull(
                  config.remote.path + settings.components.database,
                  config.local.path,
                );

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

  pushExportDatabase() {
    // Local Export
  }
}

module.exports.WPCLIAdapter = WPCLIAdapter;
