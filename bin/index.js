#!/usr/bin/env node
const { Command } = require('commander');
const program = new Command();

const chalk = require('chalk');
const { getVersion } = require('./util/helpers.js');

const initCommand = require('./commands/init.js');
const testCommand = require('./commands/test.js');
const pullCommand = require('./commands/pull.js');
const pushCommand = require('./commands/push.js');

program
  .name('tugboat-wp')
  .description(
    'Tugboat WP is a command-line interface (CLI) tool designed to help with the WordPress development process.',
  )
  .version(chalk.yellow(getVersion()));

program
  .command('init')
  .description(
    'Initialize a Tugboat configuration file in the current directory.',
  )
  .action(() => {
    initCommand();
  });

program
  .command('test')
  .description(
    'Test your configuration with your local and remote environments without transferring any files.',
  )
  .action(async () => {
    await testCommand();
  });

program
  .command('pull')
  .description(chalk.yellow.bold('PULL') + ' WordPress assets from remote.')
  .option('-p, --plugins', 'Pull plugins assets')
  .option('-u, --uploads', 'Pull uploads assets')
  .option('-m, --media', 'Pull media assets')
  .option('-t, --themes', 'Pull themes assets')
  .option('-d, --database', 'Pull database assets')
  .action(async (options) => {
    await pullCommand(options);
  });

program
  .command('push')
  .description(chalk.red.bold('PUSH') + ' WordPress assets to remote.')
  .option('-p, --plugins', 'Push plugins assets')
  .option('-u, --uploads', 'Push uploads assets')
  .option('-t, --themes', 'Push themes assets')
  .option('-d, --database', 'Push database assets')
  .action(async (options) => {
    await pushCommand(options);
  });

program.parse(process.argv);
