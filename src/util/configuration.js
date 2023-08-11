const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const defaultConfig = require('./default.config.js');

/**
 * Finds the path of the specified config file in the current directory or its parent directories.
 *
 * @param {string} startPath - The starting directory path to search from.
 * @param {string} filename - The name of the config file to find.
 * @return {string|null} Returns the path of the config file if found, null otherwise.
 */
function findConfigPath(startPath, filename) {
  let currentPath = startPath;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const configPath = path.join(currentPath, filename);
    if (fs.existsSync(configPath)) {
      return configPath;
    }

    const parentPath = path.dirname(currentPath);
    if (parentPath === currentPath) {
      break;
    }

    currentPath = parentPath;
  }

  return null; // Config file not found
}

/**
 * Checks if the current directory contains the necessary configuration files.
 *
 * @return {boolean} Returns true if the configuration files are present, otherwise false.
 */
function hasConfig() {
  const fs = require('fs');

  // Check if the current directory contains a tugboat.config.js file
  const configPath = findConfigPath(process.cwd(), 'tugboat.config.js');
  if (!fs.existsSync(configPath)) {
    console.error(
      chalk.red.bold(
        'Error: tugboat.config.js not found in the current directory.',
      ),
    );
    return false;
  }

  // Check if the current directory contains a wp-config.php file
  const wpConfigPath = findConfigPath(process.cwd(), 'wp-config.php');
  if (!fs.existsSync(wpConfigPath)) {
    console.error(
      chalk.red.bold(
        'Error: wp-config.php not found in the current directory.',
      ),
    );
    return false;
  }

  // Additional checks can be added here if needed

  return true;
}

/**
 * Reads the configuration from the tugboat.config.js file.
 *
 * @return {Object|null} Returns the configuration object if found, null otherwise.
 */
function readConfig() {
  try {
    const configPath = findConfigPath(process.cwd(), 'tugboat.config.js');
    if (!configPath) {
      console.error(
        chalk.red(
          'Error: tugboat.config.js not found in the current directory or its parent directories.',
        ),
      );
      return null;
    }

    const config = require(configPath);

    // Return the merged configuration object
    return { ...defaultConfig, ...config };
  } catch (error) {
    console.error(chalk.red('Error reading tugboat.config.js:'), error);
    return null;
  }
}

/**
 * Copies the default configuration file to the current directory.
 *
 * @param {string} DEFAULT_CONFIG_PATH - The path of the default configuration file.
 * @param {string} CURRENT_DIR - The current working directory.
 * @param {string} destinationPath - The path where the configuration file will be copied to.
 * @param {function} callback - The callback function to be executed after the file is copied.
 * @return {void}
 */
function copyDefaultConfig() {
  const DEFAULT_CONFIG_PATH = path.join(__dirname, './default.config.js');
  const CURRENT_DIR = process.cwd();
  const destinationPath = path.join(CURRENT_DIR, 'tugboat.config.js');

  fs.copyFile(DEFAULT_CONFIG_PATH, destinationPath, (err) => {
    if (err) {
      console.error(chalk.red(`Error copying default.config.js: ${err}`));
    } else {
      console.log(chalk.green('tugboat.config.js created successfully!'));
    }
  });
}

module.exports = { findConfigPath, hasConfig, readConfig, copyDefaultConfig };
