"use strict";
const { program } = require('commander');
const { exec } = require('child_process');

program
  .description('Prints the data from the config file')
  .action(() => {
    const command = 'ls -l -a';

    exec(command, { encoding: 'utf-8' }, (error, stdout, stderr) => {
      if (error) {
        console.error('Error running ls command:', error);
        return;
      }

      console.log('ls command output:');
      console.log(stdout);
    });
  });

program.parse(process.argv);
