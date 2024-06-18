const DatabaseAdapter = require("./BaseDBAdapter");
const { spawn } = require("child_process");
const { readConfig } = require("../../util/configuration.js");
const settings = require("../../util/settings");
const config = readConfig();
const { multiReplaceInFile, waitForFile } = require("../../util/helpers.js");

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

  /**
   * Imports a database from a given source into the specified location.
   *
   * @param {Object} options - The database connection options.
   * @param {string} source - The source of the database (local or remote).
   * @param {string} path - The path to the SQL file.
   *
   * @param {Object} [hooks={}] - Optional hooks to execute before and after connection and import command.
   * @param {Function} [hooks.beforeConnection] - The hook to execute before establishing a database connection.
   * @param {Function} [hooks.afterConnection] - The hook to execute after establishing a database connection.
   * @param {Function} [hooks.beforeImport] - The hook to execute before executing the import command.
   * @param {Function} [hooks.afterImport] - The hook to execute after executing the import command.
   *
   * @throws {Error} If options, source, or path are not provided.
   * @throws {Error} If the source is unsupported.
   * @throws {Error} If the database engine is unsupported.
   *
   * @returns {void}
   */
  async importDatabase(
    options,
    source,
    path,
    { beforeConnection, afterConnection, beforeImport, afterImport } = {},
  ) {
    try {
      if (!options || !source || !path) {
        throw new Error("Options, source, and path must be provided");
      }

      // Before connection hook
      if (typeof beforeConnection === "function") {
        beforeConnection(options);
      }

      console.log(`Importing database on ${source}...`);

      const { host, socket, username, password, database, port } = options;
      const sqlFilePath = path + settings.components.database;

      let replacements;

      if (source === "local") {
        replacements = [
          {
            old: config.remote.database.prefix,
            new: config.local.database.prefix,
          },
          { old: config.remote.host, new: config.local.host },
        ];

        try {
          await waitForFile(config.local.path + settings.components.database);

          await multiReplaceInFile(sqlFilePath, replacements);
          console.log("Replacements made successfully");
        } catch (error) {
          console.error("An error occurred", error);
        }
      }

      const supportedEngines = ["mysql", "mariadb"];
      let engine;
      if (source === "local") {
        engine = config.local.database.engine;
      } else if (source === "remote") {
        engine = config.remote.database.engine;
      } else {
        throw new Error(`Unsupported source: ${source}`);
      }

      if (!supportedEngines.includes(engine)) {
        throw new Error(`Unsupported database engine: ${engine}`);
      }

      let connectionDetail = this.getConnectionDetail(socket, host, port);
      let importCommand;
      if (engine === "mysql") {
        importCommand =
          `mysql ${connectionDetail} -u ${username} -p${password} -e ` +
          `"DROP DATABASE IF EXISTS ${database}; CREATE DATABASE ${database}; USE ${database};` +
          `SET sql_mode='ALLOW_INVALID_DATES'; SOURCE ${sqlFilePath};"`;
      } else if (engine === "mariadb") {
        importCommand =
          `mariadb ${connectionDetail} -u ${username} -p${password} -e ` +
          `"DROP DATABASE IF EXISTS ${database}; CREATE DATABASE ${database}; USE ${database};` +
          `SET sql_mode='ALLOW_INVALID_DATES'; SOURCE ${sqlFilePath};"`;
      } else {
        console.error("Unsupported database engine");
      }

      const childProcess = spawn("sh", ["-c", importCommand]);

      await new Promise((resolve, reject) => {
        childProcess.stdout.on("data", (data) => {
          console.log(data.toString());
        });

        childProcess.stderr.on("data", (data) => {
          console.error(data.toString());
        });

        childProcess.on("spawn", () => {
          // Before import command hook
          if (typeof beforeImport === "function") {
            beforeImport(options);
          }
        });

        childProcess.on("close", (code) => {
          // After import command hook
          if (typeof afterImport === "function") {
            afterImport(options);
          }

          if (code !== 0) {
            console.error(`mysql process exited with code ${code}`);
          }
        });
      }).catch((error) => {
        console.error("An error occurred:", error);
      });
      // After connection hook
      if (typeof afterConnection === "function") {
        afterConnection(options);
      }
    } catch (error) {
      console.error(`Error in importing database: `, error);
    }
  }

  /**
   * Export a database to a SQL file.
   * @param {object} options - The database connection options.
   * @param {string} source - The source of the database. Can be "local" or "remote".
   * @param {string} path - The file path where the SQL file will be saved.
   *
   * @param {object} hooks - Optional before and after hook functions.
   * @param {function} hooks.beforeConnection - The function to be executed before connecting to the database.
   * @param {function} hooks.afterConnection - The function to be executed after connecting to the database.
   * @param {function} hooks.beforeExport - The function to be executed before executing the export command.
   * @param {function} hooks.afterExport- The function to be executed after executing the export command.
   * @throws {Error} - If options, source, or path are not provided.
   * @throws {Error} - If an unsupported source or database engine is provided.
   * @returns {void}
   */

  async exportDatabase(
    options,
    source,
    path,
    { beforeConnection, afterConnection, beforeExport, afterExport } = {},
  ) {
    try {
      if (!options || !source || !path) {
        throw new Error("Options, source, and path must be provided");
      }

      // Before connection hook
      if (typeof beforeConnection === "function") {
        beforeConnection(options);
      }

      console.log(`Exporting database on ${source}...`);

      const { host, socket, username, password, database, port } = options;
      const sqlFilePath = path + settings.components.database;

      const supportedEngines = ["mysql", "mariadb"];
      let engine;
      if (source === "local") {
        engine = config.local.database.engine;
      } else if (source === "remote") {
        engine = config.remote.database.engine;
      } else {
        throw new Error(`Unsupported source: ${source}`);
      }

      if (!supportedEngines.includes(engine)) {
        throw new Error(`Unsupported database engine: ${engine}`);
      }

      let connectionDetail = this.getConnectionDetail(socket, host, port);
      let dumpCommand;

      if (engine === "mysql") {
        dumpCommand = `mysqldump ${connectionDetail} -u${username} -p${password} ${database} > ${sqlFilePath}`;
      } else if (engine === "mariadb") {
        dumpCommand = `mariadb-dump ${connectionDetail} -u${username} -p${password} ${database} > ${sqlFilePath}`;
      } else {
        console.error("Unsupported database engine");
      }

      const childProcess = spawn("sh", ["-c", dumpCommand]);

      await new Promise((resolve, reject) => {
        childProcess.stdout.on("data", (data) => {
          console.log(data.toString());
        });

        childProcess.stderr.on("data", (data) => {
          console.error(data.toString());
        });

        childProcess.on("spawn", () => {
          // Before import command hook
          if (typeof beforeExport === "function") {
            beforeExport(options);
          }
        });

        childProcess.on("close", (code) => {
          if (code !== 0) {
            console.error(`mysql process exited with code ${code}`);
          } else {
            let replacements;

            if (source === "local") {
              replacements = [
                {
                  old: config.local.database.prefix,
                  new: config.remote.database.prefix,
                },
                { old: config.local.host, new: config.remote.host },
              ];
            } else if (source === "remote") {
              replacements = [
                {
                  old: config.remote.database.prefix,
                  new: config.local.database.prefix,
                },
                { old: config.remote.host, new: config.local.host },
              ];
            } else {
              console.error("Unidentified source");
              return;
            }

            multiReplaceInFile(sqlFilePath, replacements)
              .then(() => console.log("Replacements made successfully"))
              .catch((e) => console.error("An error occurred", e));
          }

          // After import command hook
          if (typeof afterExport === "function") {
            afterExport(options);
          }
        });
      });

      // After connection hook
      if (typeof afterConnection === "function") {
        afterConnection(options);
      }
    } catch (error) {
      console.error(`Error in exporting database: `, error);
    }
  }

  pushImportDatabase(options = config.remote.database.mysql) {
    this.importDatabase(options, "remote", config.remote.path);
  }

  pullImportDatabase(options = config.local.database.mysql) {
    this.importDatabase(options, "local", config.local.path);
  }

  pushExportDatabase(options = config.local.database.mysql) {
    this.exportDatabase(options, "local", config.local.path);
  }

  pullExportDatabase(options = config.remote.database.mysql) {
    this.exportDatabase(options, "remote", config.remote.path);
  }
}

module.exports.MySQLAdapter = MySQLAdapter;
