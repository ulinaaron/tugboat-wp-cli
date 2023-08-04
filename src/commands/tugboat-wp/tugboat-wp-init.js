#!/usr/bin/env node

const { program } = require('commander');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const DEFAULT_CONFIG_PATH = path.join(__dirname, '../../util/default.config.js');
const CURRENT_DIR = process.cwd();

program
  .action(() => {
    const destinationPath = path.join(CURRENT_DIR, 'tugboat.config.js');

    if (fs.existsSync(destinationPath)) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question('A tugboat.config.js file already exists. Are you sure you want to overwrite it? (y/n): ', (answer) => {
        if (answer.toLowerCase() === 'y') {
          copyDefaultConfig();
        } else {
          console.log('Aborted. tugboat.config.js was not overwritten.');
        }

        rl.close();
      });
    } else {
      copyDefaultConfig();
    }
  })
  .parse(process.argv);

function copyDefaultConfig() {
  const destinationPath = path.join(CURRENT_DIR, 'tugboat.config.js');

  fs.copyFile(DEFAULT_CONFIG_PATH, destinationPath, (err) => {
    if (err) {
      console.error(`Error copying default.config.js: ${err}`);
    } else {
      console.log('tugboat.config.js created successfully!');
    }
  });
}
