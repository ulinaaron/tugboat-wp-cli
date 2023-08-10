const { program } = require('commander');
const { readConfig } = require('./util/readConfig.js');
const { rsyncPush, rsyncPull } = require('./interfaces/rsyncInterface.js');
const { addTrailingSlash } = require('./util/helpers.js');

const config = readConfig();

const localPath = addTrailingSlash(config.local.path);
const remotePath = addTrailingSlash(config.remote.path);

program
  .description(
    'Test your configuration with your local and remote environments without transferring any files.',
  )
  .action(async (options) => {
    try {
      console.log('Executing rsyncPull to copy files from remote to local:');
      await rsyncPull(remotePath, localPath, ['--dry-run']);
      console.log('✔ Pull completed successfully\n');
    } catch (error) {
      console.log('❌ Pull encountered an error:', error);
    }

    try {
      console.log('Executing rsyncPush to copy files from local to remote:');
      await rsyncPush(localPath, remotePath, ['--dry-run']);
      console.log('✔ Push completed successfully\n');
    } catch (error) {
      console.log('❌ Push encountered an error:', error);
    }
  });

program.parse(process.argv);
