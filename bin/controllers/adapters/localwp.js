const { spawn } = require('child_process');

const DatabaseAdapter = require('./BaseDBAdapter');
const { readConfig } = require('../../util/configuration.js');
const settings = require('../../util/settings');
const config = readConfig();

class LocalWPAdapter extends DatabaseAdapter {
  pullImportDatabase() {
    // Local Import
    console.log('Import database on local');

    const socketPath = config.local.database.localwp.socket;
    const username = 'root';
    const password = 'root';
    const database = 'local';
    const sqlFilePath = config.local.path + settings.components.database;

    // const mysqlCommand =
    //   `${config.misc.db_engine} --socket=${JSON.stringify(socketPath)} -u ${username} -p${password} ${database} -e "SET sql_mode='ALLOW_INVALID_DATES'; SOURCE ${sqlFilePath};"`;
    //

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
}

module.exports.LocalWPAdapter = LocalWPAdapter;
