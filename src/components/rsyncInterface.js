import { spawnSync } from 'child_process';
import { readConfig } from './readConfig';
import fs from 'fs';
import path from 'path';
import os from 'os';

function rsyncPush(source, destination) {
  const config = readConfig();

  const actualDestination = destination === 'remote' ? `${config.remote.ssh.user}@${config.remote.ssh.host}:${config.remote.path}` : destination;
  const rsyncOptions = destination === 'remote' ? config.remote.ssh.rsync_options : '';
  const command = `rsync -avz ${rsyncOptions} ${source} ${actualDestination}`;
  spawnSync(command, { stdio: 'inherit' });

  console.log('Pushing files using rsync:', source, 'to', actualDestination);
  console.log('Command:', command);
}



function rsyncPull(source, destination) {
    const config = readConfig();
  
    const actualSource = `${config.remote.ssh.user}@${config.remote.ssh.host}:${source}`;
    const rsyncOptions = config.remote.ssh.rsync_options;
  
    if (config.remote.ssh.password) {
      const password = config.remote.ssh.password;
      const tmpFolderPath = fs.mkdtempSync(path.join(os.tmpdir(), 'rsync-'));
      const passwordFilePath = path.join(tmpFolderPath, 'password.txt');
      fs.writeFileSync(passwordFilePath, password);
      spawnSync(`chmod 600 ${passwordFilePath}`);
  
      const commandWithPassword = `rsync -az ${rsyncOptions} --password-file=${passwordFilePath} ${actualSource} ${destination}`;
      spawnSync(commandWithPassword, { stdio: 'inherit' });
  
      fs.unlinkSync(passwordFilePath);

      console.log(commandWithPassword);
    } else {
      const command = `rsync -az ${rsyncOptions} ${actualSource} ${destination}`;
      spawnSync(command, { stdio: 'inherit' });

    console.log(command);

    }
  
    console.log('Pulling files using rsync:', actualSource, 'to', destination);
  }
  

export { rsyncPush, rsyncPull };

