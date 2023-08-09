#!/usr/bin/env node

const { program } = require('commander');
const _ = require('lodash');
const biDirectionalComponents = require('./controllers/biDirectionalComponents.js');
const settings = require('./util/settings.js');
const check = require('./util/check.js');
const chalk = require('chalk');
const inquirer = require('inquirer');

program
  .description('Pull files from the remote server using rsync')
  .option('-p, --plugins', 'Pull plugins component')
  .option('-u, --uploads', 'Pull uploads component')
  .option('-t, --themes', 'Pull themes component')
  .option('-d, --database', 'Pull database component')
  .action(async (options) => {
    if (!check()) {
      console.error(
        chalk.bold('Notice:') +
          ' Cannot execute command outside of a WordPress directory.',
      );
      process.exit(1); // Exit the script with a non-zero status code
    }

    let message = 'Are you sure you want to proceed with the pull operation?';
    if (options.plugins) {
      message += ' Pulling plugins assets.';
    }
    if (options.uploads) {
      message += ' Pulling uploads assets.';
    }
    if (options.themes) {
      message += ' Pulling themes assets.';
    }
    if (options.database) {
      message += ' Pulling database assets.';
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
        components.push(settings.components.database);
      }
    }

    biDirectionalComponents('pull', components, true);
  });

program.parse(process.argv);
