const DatabaseAdapter = require('./BaseDBAdapter');
const { spawn } = require('child_process');
const { readConfig } = require('../../util/configuration.js');
const settings = require('../../util/settings');
const config = readConfig();
const { multiReplaceInFile } = require('../../util/helpers.js');

class MySQLAdapter extends DatabaseAdapter {
  static get CAPABILITIES() {
    return {
      ...DatabaseAdapter.CAPABILITIES,
      pushImportDatabase: true,
      pullImportDatabase: true,
      pushExportDatabase: true,
      pullExportDatabase: true,
    };
  }

  pullExportDatabase(options = config.remote.database.mysql) {
    const { host, socket, username, password, database } = options;
  }

  pushImportDatabase(options = config.remote.database.mysql) {
    const { host, socket, username, password, database } = options;
  }

  pullImportDatabase(options = config.local.database.mysql) {
    // Local Import
    console.log('Importing database on local...');

    const { host, socket, username, password, database } = options;
    const sqlFilePath = config.local.path + settings.components.database;

    const engine = config.local.database.engine;

    let connectionDetail = socket
      ? `--socket=${JSON.stringify(socket)}`
      : `-h ${host}`;
    let importCommand;
    if (engine === 'mysql') {
      importCommand =
        `mysql ${connectionDetail} -u ${username} -p${password} -e ` +
        `"DROP DATABASE IF EXISTS ${database}; CREATE DATABASE ${database}; USE ${database};` +
        `SET sql_mode='ALLOW_INVALID_DATES'; SOURCE ${sqlFilePath};"`;
    } else if (engine === 'mariadb') {
      importCommand =
        `mariadb ${connectionDetail} -u ${username} -p${password} -e ` +
        `"DROP DATABASE IF EXISTS ${database}; CREATE DATABASE ${database}; USE ${database};` +
        `SET sql_mode='ALLOW_INVALID_DATES'; SOURCE ${sqlFilePath};"`;
    } else {
      console.error('Unsupported database engine');
    }

    const childProcess = spawn('sh', ['-c', importCommand]);

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
  pushExportDatabase(options = config.local.database.mysql) {
    // Local Export
    console.log('Exporting database on local...');

    const { host, socket, username, password, database } = options;
    const sqlFilePath = config.local.path + settings.components.database;

    const engine = config.local.database.engine;

    let connectionDetail = socket
      ? `--socket=${JSON.stringify(socket)}`
      : `-h ${host}`;

    let dumpCommand;
    if (engine === 'mysql') {
      dumpCommand = `mysqldump ${connectionDetail} -u${username} -p${password} ${database} > ${sqlFilePath}`;
    } else if (engine === 'mariadb') {
      dumpCommand = `mariadb-dump ${connectionDetail} -u${username} -p${password} ${database} > ${sqlFilePath}`;
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
        // replacePrefixInFile(sqlFilePath, config.local.database.prefix, config.remote.database.prefix );

        let replacements = [
          {
            old: config.local.database.prefix,
            new: config.remote.database.prefix,
          },
          { old: config.local.host, new: config.remote.host },
        ];

        multiReplaceInFile(sqlFilePath, replacements)
          .then(() => console.log('Replacements made successfully'))
          .catch((e) => console.error('An error occurred', e));
      }
    });
  }
}

module.exports.MySQLAdapter = MySQLAdapter;
