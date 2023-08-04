const { program } = require('commander');
const { readConfig } = require('../../components/readConfig.js');

program
  .command('config')
  .description('Prints the data from the config file')
  .action(() => {
    const config = readConfig();
    console.log(config);
  });

program.parse(process.argv);
