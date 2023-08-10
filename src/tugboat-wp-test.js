const { program } = require('commander');
const { readConfig } = require('./util/readConfig.js');
const { rsyncPush, rsyncPull } = require('./interfaces/rsyncInterface.js');
const { addTrailingSlash } = require('./util/helpers.js');
const hasConfig = require('./util/hasConfig.js');
const checkSSHPass = require('./util/checkSSHPass.js');
const chalk = require('chalk');

program
  .description(
    'Test your configuration with your local and remote environments without transferring any files.',
  )
  .action(async (options) => {
    if (!hasConfig()) {
      console.error(
        chalk.bold('Notice:') +
          ' Cannot execute command outside of a WordPress directory.',
      );
      // eslint-disable-next-line no-undef
      process.exit(1); // Exit the script with a non-zero status code
    }

    if (!checkSSHPass()) {
      console.error(
        chalk.bold('Notice:') +
          ' SSHPass could not be detected. Please ensure that sshpass is installed or remove the remote SSH password value from your tugboat.config.js..',
      );

      // eslint-disable-next-line no-undef
      process.exit(1); // Exit the script with a non-zero status code
    }

    const config = readConfig();

    const localPath = addTrailingSlash(config.local.path);
    const remotePath = addTrailingSlash(config.remote.path);

    try {
      console.log('Testing pulling files from remote to local:');
      await rsyncPull(remotePath, localPath, ['--dry-run']);
      console.log(chalk.bgGreen.white.bold('✔ Pull completed successfully\n'));
    } catch (error) {
      console.log(
        chalk.bgRed.white.bold('❌ Pull encountered an error:'),
        error,
      );
    }

    try {
      console.log('Testing pushing files to remote from local:');
      await rsyncPush(localPath, remotePath, ['--dry-run']);
      console.log(chalk.bgGreen.white.bold('✔ Push completed successfully\n'));
    } catch (error) {
      console.log(
        chalk.bgRed.white.bold('❌ Push encountered an error:'),
        error,
      );
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
  });

program.parse(process.argv);
