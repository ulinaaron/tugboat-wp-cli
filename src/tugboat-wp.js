#!/usr/bin/env node
const { program } = require('commander');
const chalk = require('chalk');
const getVersion = require('./util/getVersion.js');

program
  .name('tugboat-wp')
  .version(chalk.yellow(getVersion()))
  .command(
    'init',
    'Initialize a Tugboat configuration file in the current directory.',
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
