import fs from 'fs';

export function readConfig() {
  try {
    const configPath = './tugboat.config.js';
    const configFile = fs.readFileSync(configPath, 'utf8');
    const config = eval(configFile);
    return config;
  } catch (error) {
    console.error('Error reading tugboat.config.js:', error);
    return null;
  }
}