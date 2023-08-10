const { exec } = require('child_process');
const { readConfig } = require('../util/readConfig.js');
const fs = require('fs');
const path = require('path');
const os = require('os');
const chalk = require('chalk');

const { removeExtraSpaces } = require('../util/helpers.js');

const config = readConfig();

const execOptions = {
  stdio: 'pipe',
  maxBuffer: 1024 * 1024 * 10, // 10MB buffer size
};

const password = config.remote.ssh.password || null;
const tmpFolderPath = fs.mkdtempSync(path.join(os.tmpdir(), 'rsync-'));
const passwordFilePath = path.join(tmpFolderPath, 'password.txt');

let preActions = () => {};
let userPreActions = null;
let postActions = () => {};
let userPostActions = null;

/**
 * Pushes files using rsync from a source directory to a destination.
 *
 * @param {string} source - The path of the source directory.
 * @param {string} destination - The destination directory or 'remote' to push to a remote server.
 */
function rsyncPush(source, destination) {
  const exclude = config.remote.exclude.join(',');
  const actualDestination = `${config.remote.ssh.user}@${config.remote.ssh.host}:${destination}`;
  const rsyncOptions = config.remote.ssh.rsync_options;
  let command = `rsync -avz ${rsyncOptions} ${source} ${actualDestination}`;
  let errorMessage = 'Error running rsync push command:';

  // Append --exclude flag if there are exclusions
  if (exclude.length > 0) {
    command += ` --exclude={${exclude}}`;
  }

  if (config.remote.ssh.password) {
    errorMessage = 'Error running rsync push command with password:';
    preActions = () => {
      fs.unlinkSync(passwordFilePath);
    };

    fs.writeFileSync(passwordFilePath, password);
    exec(`chmod 600 ${passwordFilePath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(
          chalk.red('Error setting permissions for password file:'),
          error,
        );
        return;
      }

      command = `sshpass -f '${passwordFilePath}' ${command}`;

      try {
        executeRsync(
          removeExtraSpaces(command),
          preActions,
          userPreActions,
          postActions,
          userPostActions,
        );
      } catch (error) {
        console.error(chalk.red(errorMessage), error);
      }
    });
  } else {
    try {
      executeRsync(
        removeExtraSpaces(command),
        preActions,
        userPreActions,
        postActions,
        userPostActions,
      );
    } catch (error) {
      console.error(chalk.red(errorMessage), error);
    }
  }

  process.nextTick(() => {
    console.log(chalk.bold('Transporting your assets to your remote server:'));
    console.log(chalk.yellow('Source:'), source);
    console.log(chalk.cyan('Destination:'), destination);
  });
}

/**
 * rsyncPull is a function that performs a file transfer using the rsync command.
 *
 * @param {string} source - the source path of the files to be transferred.
 * @param {string} destination - the destination path where the files will be transferred to.
 */
function rsyncPull(source, destination) {
  const actualSource = `${config.remote.ssh.user}@${config.remote.ssh.host}:${source}`;
  const rsyncOptions = config.remote.ssh.rsync_options;

  let command = `rsync -azv ${rsyncOptions} ${actualSource} ${destination}`;
  let errorMessage = 'Error running rsync push command:';

  if (config.remote.ssh.password) {
    errorMessage = 'Error running rsync pull command with password:';
    preActions = () => {
      fs.unlinkSync(passwordFilePath);
    };

    fs.writeFileSync(passwordFilePath, password);
    exec(`chmod 600 ${passwordFilePath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(
          chalk.red('Error setting permissions for password file:'),
          error,
        );
        return;
      }

      command = `sshpass -f '${passwordFilePath}' ${command}`;

      try {
        executeRsync(
          command,
          preActions,
          userPreActions,
          postActions,
          userPostActions,
        );
      } catch (error) {
        console.error(chalk.red(errorMessage), error);
      }
    });
  } else {
    try {
      executeRsync(
        command,
        preActions,
        userPreActions,
        postActions,
        userPostActions,
      );
    } catch (error) {
      console.error(chalk.red(errorMessage), error);
    }
  }

  process.nextTick(() => {
    console.log(chalk.bold('Transporting your assets to your local server:'));
    console.log(chalk.yellow('Source:'), source);
    console.log(chalk.cyan('Destination:'), destination);
  });
}

/**
 * Executes the rsync command with the provided command string and action functions.
 *
 * @param {string} command - The rsync command to execute.
 * @param {function} preActions - The pre-actions to perform before executing the rsync command.
 * @param {function} userPreActions - The user-defined pre-actions to perform before executing the rsync command.
 * @param {function} postActions - The post-actions to perform after executing the rsync command.
 * @param {function} userPostActions - The user-defined post-actions to perform after executing the rsync command.
 */
function executeRsync(
  command,
  preActions,
  userPreActions,
  postActions,
  userPostActions,
) {
  preActions();
  // Call the user-defined preActions hook, if provided
  if (userPreActions && typeof userPreActions === 'function') {
    userPreActions();
  }

  exec(command, execOptions, (error, stdout, stderr) => {
    postActions();
    // Call the user-defined postActions hook, if provided
    if (userPostActions && typeof userPostActions === 'function') {
      userPostActions();
    }

    if (error) {
      throw error;
    }
  });
}

module.exports = {
  rsyncPush,
  rsyncPull,
};
