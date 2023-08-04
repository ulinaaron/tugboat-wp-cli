const fs = require('fs');
// const path = require('path');
const defaultConfig = require('../commands/default.config.js');
const chalk = require('chalk');
const findConfigPath = require('../util/findConfig.js');

/**
 * Reads the configuration from the tugboat.config.js file.
 *
 * @return {Object|null} Returns the configuration object if found, null otherwise.
 */
function readConfig() {
  try {
    const configPath = findConfigPath(process.cwd(), 'tugboat.config.js');
    if (!configPath) {
      console.error(chalk.red('Error: tugboat.config.js not found in the current directory or its parent directories.'));
      return null;
    }

    const config = require(configPath);

    // Set the swapSourceAndDestination option based on your requirement
    const swapSourceAndDestination = true;

    // Return the merged configuration object
    return { ...defaultConfig, ...config, swapSourceAndDestination };
  } catch (error) {
    console.error(chalk.red('Error reading tugboat.config.js:'), error);
    return null;
  }
}

module.exports = { readConfig };
