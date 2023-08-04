#!/usr/bin/env node

const { program } = require('commander');
const _ = require('lodash');
const { pullOrPushComponents } = require('../../components/pushOrPullComponents.js');
const settings = require('../../components/settings.js');
// const { exportDatabase, importDatabase } = require('../../components/databaseInterface.js');

program
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
        // Run WP CLI export command on the source
        // Import the exported file on the destination
      }
    }

    pullOrPushComponents('push', components);
  });

program.parse(process.argv);
