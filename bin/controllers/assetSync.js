const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const chalk = require('chalk');

const { readConfig } = require('../util/configuration.js');
const { removeExtraSpaces } = require('../util/helpers.js');

const config = readConfig();

let preActions = () => {};
let userPreActions = null;
let postActions = () => {};
let userPostActions = null;

/**
 * Pushes files from the source directory to the destination directory using rsync.
 *
 * @param {string} source - The path of the source directory.
 * @param {string} destination - The path of the destination directory.
 * @param {Array} [flags] - Optional flags for the rsync command.
 * @return {void} This function does not return a value.
 */
async function assetPush(source, destination, flags = []) {
  const exclude = config.remote.exclude.join(',');
  const actualDestination = `${config.remote.ssh.user}@${config.remote.ssh.host}:${destination}`;
  const rsyncOptions = config.remote.ssh.rsync_options;
  let errorMessage = 'Error running rsync push command:';
  let command = `rsync -avz ${rsyncOptions} ${source} ${actualDestination}`;

  const password = config.remote.ssh.password || null;
  const tmpFolderPath = fs.mkdtempSync(path.join(os.tmpdir(), 'rsync-'));
  const passwordFilePath = path.join(tmpFolderPath, 'password.txt');

  // Append --flags flag
  if (flags.length > 0) {
    const flagsString = flags.join(' ');
    command += ` ${flagsString}`;
  }

  // Append --exclude flag if there are exclusions
  if (exclude.length > 0) {
    command += ` --exclude={${exclude}}`;
  }

  // Append --password-file flag if there is a password
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
        spawnRsync(
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
      spawnRsync(
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
    console.log(chalk.bold('Transporting your assets to your remote server:'));
    console.log(chalk.yellow('Source:'), source);
    console.log(chalk.cyan('Destination:'), destination);
  });

  await new Promise((resolve) => {
    setTimeout(() => {
      // Resolve the promise after the timeout
      resolve();
    }, 1000);
  });
}

/**
 * Executes an rsync pull command to copy files from a remote source to a local destination.
 *
 * @param {string} source - The path to the remote source directory.
 * @param {string} destination - The path to the local destination directory.
 * @param {Array} flags - Optional flags to customize the rsync command.
 * @return {void} This function does not return a value.
 */
async function assetPull(source, destination, flags = []) {
  const actualSource = `${config.remote.ssh.user}@${config.remote.ssh.host}:${source}`;
  const rsyncOptions = config.remote.ssh.rsync_options;
  let errorMessage = 'Error running rsync push command:';
  let command = `rsync -azv ${rsyncOptions} ${actualSource} ${destination}`;

  const password = config.remote.ssh.password || null;
  const tmpFolderPath = fs.mkdtempSync(path.join(os.tmpdir(), 'rsync-'));
  const passwordFilePath = path.join(tmpFolderPath, 'password.txt');

  if (flags.length > 0) {
    const flagsString = flags.join(' ');
    command += ` ${flagsString}`;
  }

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
        spawnRsync(
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
      spawnRsync(
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

  await new Promise((resolve) => {
    setTimeout(() => {
      // Resolve the promise after the timeout
      resolve();
    }, 1000);
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
function spawnRsync(
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

  const rsync = spawn('sh', ['-c', removeExtraSpaces(command)]);

  rsync.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  rsync.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  rsync.on('close', (code) => {
    postActions();
    // Call the user-defined postActions hook, if provided
    if (userPostActions && typeof userPostActions === 'function') {
      userPostActions();
    }

    if (code !== 0) {
      throw new Error(`rsync process exited with code ${code}`);
    }
  });
}

module.exports = {
  assetPush,
  assetPull,
};
