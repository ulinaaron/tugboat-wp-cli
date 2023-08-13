const wpAssetActions = require('../controllers/assetActions.js');
const settings = require('../util/settings.js');
const { hasConfig } = require('../util/configuration.js');
const { checkSSHPass } = require('../util/ssh.js');
const chalk = require('chalk');
const inquirer = require('inquirer');

async function pushCommand(options) {
  if (!hasConfig()) {
    console.error(
      chalk.bold('Notice:') +
        ' Cannot execute command outside of a WordPress directory.',
    );
    process.exit(1); // Exit the script with a non-zero status code
  }

  if (!checkSSHPass()) {
    console.error(
      chalk.bold('Notice:') +
        ' SSHPass could not be detected. Please ensure that sshpass is installed or remove the remote SSH password value from your tugboat.config.js..',
    );
    process.exit(1); // Exit the script with a non-zero status code
  }

  const optionsMap = [
    { option: 'plugins', message: 'Pushing plugins assets.' },
    { option: 'uploads', message: 'Pushing uploads assets.' },
    { option: 'themes', message: 'Pushing themes assets.' },
    { option: 'database', message: 'Pushing database assets.' },
  ];

  let message = 'Are you sure you want to proceed with the push operation?';
  optionsMap.forEach((optionMap) => {
    if (options[optionMap.option]) {
      message += ` ${optionMap.message}`;
    }
  });

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
    console.log('Push operation cancelled.');
    return;
  }

  let components = [];

  if (optionsMap.every((optionMap) => !options[optionMap.option])) {
    components = Object.values(settings.components);
  } else {
    optionsMap.forEach((optionMap) => {
      if (options[optionMap.option]) {
        components.push(settings.components[optionMap.option]);
      }
    });
  }

  wpAssetActions('push', components, false);
}

module.exports = pushCommand;
