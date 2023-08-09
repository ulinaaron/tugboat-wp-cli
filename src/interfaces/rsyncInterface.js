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
  const exclude = config.remote.exclude.join(',');
  const actualDestination = `${config.remote.ssh.user}@${config.remote.ssh.host}:${destination}`;
  const rsyncOptions = config.remote.ssh.rsync_options;

  if (config.remote.ssh.password) {
    const password = config.remote.ssh.password;
    const tmpFolderPath = fs.mkdtempSync(path.join(os.tmpdir(), 'rsync-'));
    const passwordFilePath = path.join(tmpFolderPath, 'password.txt');
    fs.writeFileSync(passwordFilePath, password);
    exec(`chmod 600 ${passwordFilePath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(
          chalk.red('Error setting permissions for password file:'),
          error,
        );
        return;
      }

      let commandWithPassword = `rsync -azv ${rsyncOptions} --password-file=${passwordFilePath} ${source} ${actualDestination}`;

      // Append --exclude flag if there are exclusions
      if (exclude.length > 0) {
        commandWithPassword += ` --exclude={${exclude}}`;
      }

      exec(
        commandWithPassword,
        { stdio: 'inherit' },
        (error, stdout, stderr) => {
          fs.unlinkSync(passwordFilePath);

          if (error) {
            console.error(
              chalk.red('Error running rsync pull command with password:'),
              error,
            );
            return;
          }
        },
      );
    });
  } else {
    let command = `rsync -avz ${rsyncOptions} ${source} ${actualDestination}`;

    // Append --exclude flag if there are exclusions
    if (exclude.length > 0) {
      command += ` --exclude={${exclude}}`;
    }

    exec(command, { stdio: 'inherit' }, (error, stdout, stderr) => {
      if (error) {
        console.error(chalk.red('Error running rsync pull command:'), error);
        return;
      }
    });
  }

  console.log(chalk.bold('Transporting your assets to your remote server:'));
  console.log(chalk.yellow('Source:'), source);
  console.log(chalk.cyan('Destination:'), destination);
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
        console.error(
          chalk.red('Error setting permissions for password file:'),
          error,
        );
        return;
      }

      const commandWithPassword = `rsync -azv ${rsyncOptions} --password-file=${passwordFilePath} ${actualSource} ${destination}`;

      exec(
        commandWithPassword,
        { stdio: 'inherit' },
        (error, stdout, stderr) => {
          fs.unlinkSync(passwordFilePath);

          if (error) {
            console.error(
              chalk.red('Error running rsync pull command with password:'),
              error,
            );
            return;
          }
        },
      );
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

  console.log(chalk.bold('Transporting your assets to your local server:'));
  console.log(chalk.yellow('Source:'), source);
  console.log(chalk.cyan('Destination:'), destination);
}

module.exports = {
  rsyncPush,
  rsyncPull,
};
