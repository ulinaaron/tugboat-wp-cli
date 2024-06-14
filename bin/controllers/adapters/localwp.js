const { spawn } = require('child_process');

const DatabaseAdapter = require('./BaseDBAdapter');
const { readConfig } = require('../../util/configuration.js');
const settings = require('../../util/settings');
const config = readConfig();
const { replacePrefixInFile } = require('../../util/helpers.js');

class LocalWPAdapter extends DatabaseAdapter {
  pullImportDatabase() {
    // Local Import
    console.log('Import database on local');

    const socketPath = config.local.database.localwp.socket;
    const username = 'root';
    const password = 'root';
    const database = 'local';
    const sqlFilePath = config.local.path + settings.components.database;

    const mysqlCommand =
      `${config.misc.db_engine} --socket=${JSON.stringify(socketPath)} -u ${username} -p${password} -e ` +
      `"DROP DATABASE IF EXISTS ${database}; CREATE DATABASE ${database}; USE ${database};` +
      `SET sql_mode='ALLOW_INVALID_DATES'; SOURCE ${sqlFilePath};"`;

    const childProcess = spawn('sh', ['-c', mysqlCommand]);

    childProcess.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    childProcess.stderr.on('data', (data) => {
      console.error(data.toString());
    });

    childProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`mysql process exited with code ${code}`);
      }
    });
  }
  pushExportDatabase() {
      // Local Export
      console.log('Export database on local');

      const socketPath = config.local.database.localwp.socket;
      const username = 'root';
      const password = 'root';
      const database = 'local';
      const sqlFilePath = config.local.path + settings.components.database;

    const engine = config.misc.db_engine;

    let dumpCommand;
    if (engine === 'mysql') {
      dumpCommand = `mysqldump --socket=${JSON.stringify(socketPath)} -u${username} -p${password} ${database} > ${sqlFilePath}`;
    } else if (engine === 'mariadb') {
      dumpCommand = `mariadb-dump --socket=${JSON.stringify(socketPath)} -u${username} -p${password} ${database} > ${sqlFilePath}`;
    } else {
      console.error('Unsupported database engine');
    }

    const childProcess = spawn('sh', ['-c', dumpCommand]);

      childProcess.stdout.on('data', (data) => {
        console.log(data.toString());
      });

      childProcess.stderr.on('data', (data) => {
        console.error(data.toString());
      });

      childProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`mysql process exited with code ${code}`);
        } else {
          replacePrefixInFile(sqlFilePath, config.local.database.prefix, config.remote.database.prefix );
        }
      });
    }
}

module.exports.LocalWPAdapter = LocalWPAdapter;