#!/usr/bin/env node

import program from 'commander';
import _ from 'lodash';
import { pullOrPushComponents } from '../../components/pushOrPullComponents.js';


program
  .command('push')
  .description('Push files to the remote server using rsync')
  .option('-p, --plugins', 'Push plugins component')
  .option('-u, --uploads', 'Push uploads component')
  .option('-t, --themes', 'Push themes component')
  .option('-d, --database', 'Push database component')
  .action((options) => {
    let components = [];

    if (!options.plugins && !options.uploads && !options.themes && !options.database) {
      components = Object.values(settings.components);
    } else {
      if (options.plugins) {
        components.push(settings.components.plugins);
      }
      if (options.uploads) {
        components.push(settings.components.uploads);
      }
      if (options.themes) {
        components.push(settings.components.themes);
      }
      if (options.database) {
        components.push(settings.components.database);
      }
    }

    pullOrPushComponents('push', components);
  });

program.parse(process.argv);
