const fs = require('fs');
const path = require('path');
const defaultConfig = require('../commands/default.config.js');
const chalk = require('chalk');

function readConfig() {
  try {
    const configPath = require.resolve(process.cwd() + '/tugboat.config.js');
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
