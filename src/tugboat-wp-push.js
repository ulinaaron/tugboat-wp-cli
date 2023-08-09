#!/usr/bin/env node

const { program } = require('commander');
const biDirectionalComponents = require('./controllers/biDirectionalComponents.js');
const settings = require('./util/settings.js');
const check = require('./util/check.js');
const chalk = require('chalk');
const inquirer = require('inquirer');

program
  .description('Push files to the remote server using rsync')
  .option('-p, --plugins', 'Push plugins assets')
  .option('-u, --uploads', 'Push uploads assets')
  .option('-t, --themes', 'Push themes assets')
  .option('-d, --database', 'Push database assets')
  .action(async (options) => {
    if (!check()) {
      console.error(
        chalk.bold('Notice:') +
          ' Cannot execute command outside of a WordPress directory.',
      );
      process.exit(1); // Exit the script with a non-zero status code
    }

    let message =
      'Are you sure you want to proceed with the pushing operation?';
    if (options.plugins) {
      message += ' Pushing plugins assets.';
    }
    if (options.uploads) {
      message += ' Pushing uploads assets.';
    }
    if (options.themes) {
      message += ' Pushing themes assets.';
    }
    if (options.database) {
      message += ' Pushing database assets.';
    }

    // Confirmation prompt
    const confirm = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmed',
        message,
        default: false,
      },
    ]);

    if (!confirm.confirmed) {
      console.log('Pull operation cancelled.');
      return;
    }

    let components = [];

    if (
      !options.plugins &&
      !options.uploads &&
      !options.themes &&
      !options.database
    ) {
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

    biDirectionalComponents('push', components, false);
  });

program.parse(process.argv);
