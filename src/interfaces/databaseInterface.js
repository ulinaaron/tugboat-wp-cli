const { Client } = require('ssh2');
const { rsyncPull, rsyncPush } = require('./rsyncInterface.js');
const { readConfig } = require('../util/readConfig.js');
const settings = require('../util/settings.js');

function databaseProcess(direction) {
  const config = readConfig();

  if (direction === 'pull') {
    const { host, user, password, port } = config.remote.ssh;

    const conn = new Client();
    conn
      .on('ready', () => {
        conn.exec(
          'wp db export ' + config.remote.path + settings.database.file,
          (err, stream) => {
            if (err) {
              console.error('Error exporting the database:', err);
              conn.end();
              return;
            }

            stream
              .on('close', (code, signal) => {
                console.log('Database exported successfully to database.sql');
                conn.end();
                rsyncPull(
                  config.remote.path + settings.database.file,
                  config.local.path,
                );

                const importCommand =
                  'wp db import ' + config.local.path + settings.database.file;
                const deleteCommand =
                  'rm ' + config.remote.path + settings.database.file;

                conn.exec(importCommand, (err, stream) => {
                  if (err) {
                    console.error('Error importing the database:', err);
                    conn.end();
                    return;
                  }

                  stream
                    .on('close', (code, signal) => {
                      console.log('Database imported successfully');
                      conn.end();

                      conn.exec(deleteCommand, (err, stream) => {
                        if (err) {
                          console.error(
                            'Error deleting the database file:',
                            err,
                          );
                          conn.end();
                          return;
                        }

                        stream
                          .on('close', (code, signal) => {
                            console.log('Database file deleted successfully');
                            conn.end();
                          })
                          .stderr.on('data', (data) => {
                            console.error(
                              'Error deleting the database file:',
                              data.toString(),
                            );
                            conn.end();
                          });
                      });
                    })
                    .stderr.on('data', (data) => {
                      console.error(
                        'Error importing the database:',
                        data.toString(),
                      );
                      conn.end();
                    });
                });
              })
              .stderr.on('data', (data) => {
                console.error('Error exporting the database:', data.toString());
                conn.end();
              });
          },
        );
      })
      .connect({
        host,
        port,
        username: user,
        password,
      });
  }
}

module.exports = databaseProcess;
