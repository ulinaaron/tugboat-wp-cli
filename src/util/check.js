const chalk = require('chalk');
const findConfigPath = require('./findConfig.js');
function isWordPressDirectory() {
  const fs = require('fs');
  const path = require('path');

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

module.exports = isWordPressDirectory;
