import { readConfig } from './readConfig';
import Rsync from 'rsync';

export function rsyncPush() {
  const config = readConfig();

  const rsync = new Rsync()
    .flags('avz')
    .source(config.local.path)
    .destination(config.remote.path);

  rsync.execute((error, code, cmd) => {
    if (error) {
      console.error('Error executing rsync:', error);
    } else {
      console.log('Pushing files using rsync:', config.local.path, 'to', config.remote.path);
    }
  });
}

export function rsyncPull() {
  const config = readConfig();

  const rsync = new Rsync()
    .flags('avz')
    .source(config.remote.path)
    .destination(config.local.path);

  rsync.execute((error, code, cmd) => {
    if (error) {
      console.error('Error executing rsync:', error);
    } else {
      console.log('Pulling files using rsync:', config.remote.path, 'to', config.local.path);
    }
  });
}
