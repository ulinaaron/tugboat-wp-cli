const { execSync } = require("child_process");
const { readFileSync } = require("fs");
const { readConfig } = require("./configuration.js");
const config = readConfig();
const defaultConfig = require("./default.config.js");

/**
 * Checks if sshpass is installed.
 *
 * @return {boolean} Returns true if sshpass is installed, false otherwise.
 */
function isSshpassInstalled() {
  try {
    // Check if sshpass is installed
    execSync("which sshpass");
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Checks if the SSH password is provided in the config object and performs actions accordingly.
 *
 * @function checkSSHPass
 * @return {boolean} - This function does not return anything.
 */
function checkSSHPass() {
  if (config.remote.ssh.password) {
    return isSshpassInstalled();
  }
  return true;
}

function sshConnectOptions() {
  const { host, user, password, privateKey, port } = config.remote.ssh;

  const connectOptions = {
    host,
    port,
    username: user,
  };

  if (password !== defaultConfig.remote.ssh.password && password !== null) {
    connectOptions.password = password;
  } else if (
    privateKey !== defaultConfig.remote.ssh.privateKey &&
    privateKey !== null
  ) {
    connectOptions.privateKey = readFileSync(privateKey);
  }

  return connectOptions;
}

module.exports = {
  checkSSHPass,
  sshConnectOptions,
};
