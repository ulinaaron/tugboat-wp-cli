import { readConfig } from './readConfig';
import { rsyncPush, rsyncPull } from './rsyncInterface';

function pullOrPushComponents(actionName, components) {
  if (!components.length) {
    console.log(`Please specify at least one component to ${actionName}: -p, -u, -t, or -d`);
    return;
  }

  const config = readConfig();

  components.forEach((component) => {
    const source = config.local.path + component;
    const destination = config.remote.path + component;

    if (actionName === 'pull') {
      rsyncPull(source, destination);
    } else if (actionName === 'push') {
      rsyncPush(source, destination);
    }

    console.log(`${actionName.charAt(0).toUpperCase() + actionName.slice(1)} ${component}...`);
  });
}

export { pullOrPushComponents };
