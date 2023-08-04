const { exec } = require('child_process');
const { readConfig } = require('../util/readConfig.js');
const settings = require('../util/settings.js');
const fs = require('fs');
const path = require('path');
const os = require('os');
const chalk = require('chalk');

/**
 * Pushes files using rsync from a source directory to a destination.
 *
 * @param {string} source - The path of the source directory.
 * @param {string} destination - The destination directory or 'remote' to push to a remote server.
 */
function rsyncPush(source, destination) {
  const config = readConfig();

  const actualDestination = destination === 'remote' ? `${config.remote.ssh.user}@${config.remote.ssh.host}:${config.remote.path}` : destination;
  const rsyncOptions = destination === 'remote' ? config.remote.ssh.rsync_options : '';
  const command = `rsync -avz ${rsyncOptions} ${source} ${actualDestination}`;

  exec(command, { stdio: 'inherit' }, (error, stdout, stderr) => {
    if (error) {
      console.error(chalk.red('Error running rsync push command:'), error);
      return;
    }

    console.log(chalk.bold('Pushing files using rsync:'), source, 'to', actualDestination);
    console.log(chalk.bold('Command:'), command);
  });
}

/**
 * rsyncPull is a function that performs a file transfer using the rsync command.
 *
 * @param {string} source - the source path of the files to be transferred.
 * @param {string} destination - the destination path where the files will be transferred to.
 */
function rsyncPull(source, destination) {
  const config = readConfig();

  const actualSource = `${config.remote.ssh.user}@${config.remote.ssh.host}:${source}`;
  const rsyncOptions = config.remote.ssh.rsync_options;

  if (config.remote.ssh.password) {
    const password = config.remote.ssh.password;
    const tmpFolderPath = fs.mkdtempSync(path.join(os.tmpdir(), 'rsync-'));
    const passwordFilePath = path.join(tmpFolderPath, 'password.txt');
    fs.writeFileSync(passwordFilePath, password);
    exec(`chmod 600 ${passwordFilePath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(chalk.red('Error setting permissions for password file:'), error);
        return;
      }

      const commandWithPassword = `rsync -azv ${rsyncOptions} --password-file=${passwordFilePath} ${actualSource} ${destination}`;

      exec(commandWithPassword, { stdio: 'inherit' }, (error, stdout, stderr) => {
        fs.unlinkSync(passwordFilePath);

        if (error) {
          console.error(chalk.red('Error running rsync pull command with password:'), error);
          return;
        }
      });
    });
  } else {
    const command = `rsync -azv ${rsyncOptions} ${actualSource} ${destination}`;

    exec(command, { stdio: 'inherit' }, (error, stdout, stderr) => {
      if (error) {
        console.error(chalk.red('Error running rsync pull command:'), error);
        return;
      }
    });
  }

  console.log(chalk.bold('Performing component action using rsync:'));
  console.log(chalk.yellow('Source:'), source);
  console.log(chalk.cyan('Destination:'), destination);
}

module.exports = {
  rsyncPush,
  rsyncPull
};
