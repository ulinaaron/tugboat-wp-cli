const fs = require('fs');
const path = require('path');

/**
 * Finds the path of the specified config file in the current directory or its parent directories.
 *
 * @param {string} startPath - The starting directory path to search from.
 * @param {string} filename - The name of the config file to find.
 * @return {string|null} Returns the path of the config file if found, null otherwise.
 */
function findConfigPath(startPath, filename) {
  let currentPath = startPath;
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

module.exports = findConfigPath;
