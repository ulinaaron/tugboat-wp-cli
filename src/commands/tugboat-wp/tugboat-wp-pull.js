#!/usr/bin/env node

const { program } = require('commander');
const _ = require('lodash');
const biDirectionalComponents = require('../../controllers/biDirectionalComponents.js');
const settings = require('../../util/settings.js');
// const { exportDatabase, importDatabase } = require('../../components/databaseInterface.js');
const check = require('../../util/check.js');
const chalk = require('chalk');

program
  .description('Pull files from the remote server using rsync')
  .option('-p, --plugins', 'Pull plugins component')
  .option('-u, --uploads', 'Pull uploads component')
  .option('-t, --themes', 'Pull themes component')
  .option('-d, --database', 'Pull database component')
  .action((options) => {

    if (!check()) {
      console.error(chalk.bold('Notice:') + ' Cannot execute command outside of a WordPress directory.');
      process.exit(1); // Exit the script with a non-zero status code
    }

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

    biDirectionalComponents('pull', components, true);
  });

program.parse(process.argv);
