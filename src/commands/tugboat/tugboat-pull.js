#!/usr/bin/env node

import program from 'commander';
import _ from 'lodash';
import { pullOrPushComponents } from '../bi-directional.js';

program
  .command('push')
  .option('-p, --plugins', 'Push plugins')
  .option('-u, --uploads', 'Push uploads')
  .option('-t, --themes', 'Push themes')
  .option('-d, --database', 'Push database')
  .action((options) => {
    const components = [];

    if (options.plugins) {
      components.push('plugins');
    }

    if (options.uploads) {
      components.push('uploads');
    }

    if (options.themes) {
      components.push('themes');
    }

    if (options.database) {
      components.push('database');
    }

    pullOrPushComponents('push', components);
  });

program.parse(process.argv);
