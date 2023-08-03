#!/usr/bin/env node

import program from 'commander';
import _ from 'lodash';
import { pullOrPushComponents } from '../bi-directional.js';

program
  .command('pull')
  .option('-p, --plugins', 'Pull plugins')
  .option('-u, --uploads', 'Pull uploads')
  .option('-t, --themes', 'Pull themes')
  .option('-d, --database', 'Pull database')
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

    pullOrPushComponents('pull', components);
  });

program.parse(process.argv);
