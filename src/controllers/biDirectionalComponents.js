const { readConfig } = require('../util/configuration.js');
const { rsyncPush, rsyncPull } = require('../interfaces/rsyncInterface.js');
const databaseProcess = require('../interfaces/databaseInterface.js');
const settings = require('../util/settings.js');
const { addTrailingSlash } = require('../util/helpers.js');

/**
 * Executes the specified action on a list of components.
 *
 * @param {string} actionName - The name of the action to perform on the components.
 * @param {Array} components - The list of components to perform the action on.
 * @return {void}
 */
function biDirectionalComponents(
  actionName,
  components,
  swapSourceAndDestination = false,
) {
  if (!components.length) {
    console.log(
      `Please specify at least one component to ${actionName}: -p, -u, -t, or -d`,
    );
    return;
  }

  const config = readConfig();

  components.forEach((component) => {
    const componentName = Object.keys(settings.components).find(
      (key) => settings.components[key] === component,
    );
    const localPath = addTrailingSlash(config.local.path);
    const remotePath = addTrailingSlash(config.remote.path);

    if (componentName) {
      let source = localPath + component;
      let destination = remotePath + component;

      if (componentName === 'database') {
        if (actionName === 'pull') {
          if (swapSourceAndDestination) {
            [source, destination] = [destination, source];
          }
          databaseProcess('pull');
        } else if (actionName === 'push') {
          if (swapSourceAndDestination) {
            [source, destination] = [destination, source];
          }
          databaseProcess('push');
        }
      } else {
        if (swapSourceAndDestination) {
          [source, destination] = [destination, source];
        }
        if (actionName === 'pull') {
          if (componentName === 'media') {
            rsyncPull(source, localPath);
          } else {
            rsyncPull(source, localPath + settings.content);
          }
        } else if (actionName === 'push') {
          rsyncPush(source, remotePath + settings.content);
        }
      }
    } else {
      console.log(`Invalid component specified: ${component}`);
    }
  });
}

module.exports = biDirectionalComponents;
