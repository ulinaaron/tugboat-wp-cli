import program from 'commander';
import { readConfig } from '../../components/readConfig';

program
  .command('config')
  .description('Prints the data from the config file')
  .action(() => {
    const config = readConfig();
    console.log(config);
  });

program.parse(process.argv);