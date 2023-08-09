#!/usr/bin/env node
const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');

const DEFAULT_CONFIG_PATH = path.join(__dirname, './util/default.config.js');
const CURRENT_DIR = process.cwd();

program.action(() => {
  const destinationPath = path.join(CURRENT_DIR, 'tugboat.config.js');

  if (fs.existsSync(destinationPath)) {
    inquirer
      .prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message:
            'A tugboat.config.js file already exists. Are you sure you want to overwrite it?',
        },
      ])
      .then((answers) => {
        if (answers.overwrite) {
          copyDefaultConfig();
        } else {
          console.log(
            chalk.yellow('Aborted. tugboat.config.js was not overwritten.'),
          );
        }
      });
  } else {
    copyDefaultConfig();
  }
});

program.parse(process.argv);

function copyDefaultConfig() {
  const destinationPath = path.join(CURRENT_DIR, 'tugboat.config.js');

  fs.copyFile(DEFAULT_CONFIG_PATH, destinationPath, (err) => {
    if (err) {
      console.error(chalk.red(`Error copying default.config.js: ${err}`));
    } else {
      console.log(chalk.green('tugboat.config.js created successfully!'));
    }
  });
}
