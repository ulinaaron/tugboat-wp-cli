const { program } = require('commander');
const { readConfig } = require('./util/readConfig.js');
const { rsyncPush, rsyncPull } = require('./interfaces/rsyncInterface.js');
const { addTrailingSlash } = require('./util/helpers.js');
const chalk = require('chalk');

const config = readConfig();

const localPath = addTrailingSlash(config.local.path);
const remotePath = addTrailingSlash(config.remote.path);

program
  .description(
    'Test your configuration with your local and remote environments without transferring any files.',
  )
  .action(async (options) => {
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

    console.log(chalk.bold('\nAll set to get towing!'));
  });

program.parse(process.argv);
