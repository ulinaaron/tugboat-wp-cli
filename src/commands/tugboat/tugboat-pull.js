#!/usr/bin/env node

import program from 'commander';
import _ from 'lodash';
import { pullOrPushComponents } from '../../components/pushOrPullComponents.js';
import settings from '../../components/settings';
import { exportDatabase, importDatabase } from '../../components/databaseInterface';

program
  .description('Pull files from the remote server using rsync')
  .option('-p, --plugins', 'Pull plugins component')
  .option('-u, --uploads', 'Pull uploads component')
  .option('-t, --themes', 'Pull themes component')
  .option('-d, --database', 'Pull database component')
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
        // Run WP CLI export command on the source
        // Import the exported file on the destination
      }
    }

    pullOrPushComponents('pull', components);
  });

program.parse(process.argv);
