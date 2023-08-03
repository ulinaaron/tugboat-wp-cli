#!/usr/bin/env node
import { program } from 'commander';

program
  .name('tugboat')
  .version('0.1.0')
  .command('init', 'Initialize a Tugboat configuration file in the current directory.')
  .command('pull <name>', 'PULL WordPress assets from remote.')
  .command('push <name>', 'PUSH WordPress assets from remote.')
  .command('config', 'Display`s the data from the config file.')
  .parse(process.argv);