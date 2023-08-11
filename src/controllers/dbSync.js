const { spawn } = require('child_process');
const { Client } = require('ssh2');

const { rsyncPull, rsyncPush } = require('./assetSync.js');
const { readConfig } = require('../util/configuration.js');
const settings = require('../util/settings.js');

const config = readConfig();

async function databaseSync(direction) {
  const { host, user, password, port } = config.remote.ssh;

  const connectOptions = {
    host,
    port,
    username: user,
  };

  if (password !== null) {
    connectOptions.password = password;
  }

  if (direction === 'pull') {
    const conn = new Client();
    await conn
      .on('ready', () => {
        console.log('SSH connection established');

        conn.exec(
          `cd ${config.remote.path} && wp db export ${config.remote.path}${settings.components.database}`,
          (err, stream) => {
            if (err) {
              console.error('Error exporting the database:', err);
              conn.end();
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

                rsyncPull(
                  config.remote.path + settings.components.database,
                  config.local.path,
                );

                importDatabase();
              });
          },
        );
      })
      .on('error', (err) => {
        console.error('SSH connection error:', err);
      })
      .on('end', () => {
        console.log('SSH connection closed');
      })
      .connect(connectOptions);
  }
}

function importDatabase() {
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

module.exports = databaseSync;
