#!/usr/bin/env node
const { program } = require('commander');
const chalk = require('chalk');

program
  .name('tugboat-wp')
  .version(chalk.yellow('0.1.0'))
  .command(
    'init',
    'Initialize a Tugboat configuration file in the current directory.',
  )
  .command(
    'pull <flag>',
    chalk.yellow.bold('PULL') + ' WordPress assets from remote.',
  )
  .command(
    'push <flag>',
    chalk.red.bold('PUSH') + ' WordPress assets to remote.',
  );

program.parse(process.argv);
