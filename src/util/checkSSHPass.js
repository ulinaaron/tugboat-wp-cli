const { execSync } = require('child_process');
const { readConfig } = require('./readConfig.js');
const config = readConfig();

/**
 * Checks if sshpass is installed.
 *
 * @return {boolean} Returns true if sshpass is installed, false otherwise.
 */
function isSshpassInstalled() {
  try {
    // Check if sshpass is installed
    execSync('which sshpass');
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Checks if the SSH password is provided in the config object and performs actions accordingly.
 *
 * @param {Object} config - The configuration object.
 * @return {void} - This function does not return anything.
 */
module.exports = function checkSSHPass() {
  if (config.remote.ssh.password) {
    if (isSshpassInstalled()) {
      return true;
    } else {
      return false;
    }
  }
  return true;
};
