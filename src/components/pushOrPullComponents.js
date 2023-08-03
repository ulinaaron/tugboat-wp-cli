import { readConfig } from './readConfig';
import { rsyncPush, rsyncPull } from './rsyncInterface';
import { exportDatabase, importDatabase } from './databaseInterface';
import settings from './settings';

function pullOrPushComponents(actionName, components) {
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
          rsyncPull(source, destination);
        } else if (actionName === 'push') {
          rsyncPush(source, destination);
        }
      }
    } else {
      console.log(`Invalid component specified: ${component}`);
    }
  });
}

export { pullOrPushComponents };
