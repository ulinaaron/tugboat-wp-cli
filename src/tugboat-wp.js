#!/usr/bin/env node
const { program } = require('commander');
const chalk = require('chalk');
const { getVersion } = require('./util/helpers.js');

program
  .name('tugboat-wp')
  .version(chalk.yellow(getVersion()))
  .command(
    'init',
    'Initialize a Tugboat configuration file in the current directory.',
  )
  .command(
    'test',
    'Test your configuration with your local and remote environments without transferring any files.',
  )
  .command(
    'pull <option>',
    chalk.yellow.bold('PULL') + ' WordPress assets from remote.',
  )
  .command(
    'push <option>',
    chalk.red.bold('PUSH') + ' WordPress assets to remote.',
  );

program.parse(process.argv);
