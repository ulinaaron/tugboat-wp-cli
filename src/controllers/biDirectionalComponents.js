const { readConfig } = require('../util/readConfig.js');
const { rsyncPush, rsyncPull } = require('../interfaces/rsyncInterface.js');
const { exportDatabase, importDatabase } = require('../interfaces/databaseInterface.js');
const settings = require('../util/settings.js');

/**
 * Executes the specified action on a list of components.
 *
 * @param {string} actionName - The name of the action to perform on the components.
 * @param {Array} components - The list of components to perform the action on.
 * @return {void} 
 */
function biDirectionalComponents(actionName, components) {
  if (!components.length) {
    console.log(`Please specify at least one component to ${actionName}: -p, -u, -t, or -d`);
    return;
  }

  const config = readConfig();

  components.forEach((component) => {
    const componentName = Object.keys(settings.components).find((key) => settings.components[key] === component);

    if (componentName) {
      let source = config.local.path + component;
      let destination = config.remote.path + component;

      if (componentName === settings.components.database) {
        if (actionName === 'pull') {
          if (config.swapSourceAndDestination) {
            [source, destination] = [destination, source];
          }
          rsyncPull(source, destination);
          importDatabase('/path/to/imported/database.sql');
        } else if (actionName === 'push') {
          if (config.swapSourceAndDestination) {
            [source, destination] = [destination, source];
          }
          exportDatabase('/path/to/exported/database.sql');
          rsyncPush(source, destination);
        }
      } else {
        if (config.swapSourceAndDestination) {
          [source, destination] = [destination, source];
        }
        if (actionName === 'pull') {
          rsyncPull(source, config.local.path + settings.content );
        } else if (actionName === 'push') {
          rsyncPush(source, config.remote.path + settings.content );
        }
      }
    } else {
      console.log(`Invalid component specified: ${component}`);
    }
  });
}

module.exports = biDirectionalComponents;
