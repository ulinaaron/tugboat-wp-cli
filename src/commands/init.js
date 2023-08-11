const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { copyDefaultConfig } = require('../util/configuration.js');

const CURRENT_DIR = process.cwd();

function initCommand() {
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
}

module.exports = initCommand;
