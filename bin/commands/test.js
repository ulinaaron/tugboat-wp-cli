const {
  readConfig,
  hasConfig,
  isValidConfig,
} = require('../util/configuration.js');
const { assetPush, assetPull } = require('../controllers/assetSync.js');
const { addTrailingSlash } = require('../util/helpers.js');
const { checkSSHPass } = require('../util/ssh.js');
const chalk = require('chalk');

async function testCommand() {
  if (!hasConfig()) {
    console.error(
      chalk.bold('Notice:') +
        ' Cannot execute command outside of a WordPress directory.',
    );
    process.exit(1); // Exit the script with a non-zero status code
  }

  if (!checkSSHPass()) {
    console.error(
      chalk.bold('Notice:') +
        ' SSHPass could not be detected. Please ensure that sshpass is installed or remove the remote SSH password value from your tugboat.config.js..',
    );
    process.exit(1); // Exit the script with a non-zero status code
  }

  const config = readConfig();

  const localPath = addTrailingSlash(config.local.path);
  const remotePath = addTrailingSlash(config.remote.path);

  if (!isValidConfig(config)) {
    console.error(`
    ${chalk.bold('Notice:')} Invalid configuration in tugboat.config.js file.
    If you have just initialized your configuraiton file, be sure to change the default values.
    `);

    process.exit(1); // Exit the script with a non-zero status code
  }

  try {
    console.log('Testing pulling files from remote to local:');
    await assetPull(remotePath, localPath, ['--dry-run --quiet']);
    console.log(chalk.bgGreen.white.bold('✔ Pull completed successfully\n'));
  } catch (error) {
    console.log(chalk.bgRed.white.bold('❌ Pull encountered an error:'), error);
  }

  try {
    console.log('Testing pushing files to remote from local:');
    await assetPush(localPath, remotePath, ['--dry-run --quiet']);
    console.log(chalk.bgGreen.white.bold('✔ Push completed successfully\n'));
  } catch (error) {
    console.log(chalk.bgRed.white.bold('❌ Push encountered an error:'), error);
  }

  if (config.remote.ssh.password) {
    console.log(
      chalk.yellow(
        chalk.bold('WARNING: ') +
          'While possible, it is not recommend to use a password for pushing and pulling files. Instead, please consider switching to using an SSH key instead.',
      ),
    );
  }

  console.log(chalk.bold('\nAll set to get towing!'));
}

module.exports = testCommand;
