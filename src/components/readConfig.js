import fs from 'fs';

export function readConfig() {
  try {
    const configPath = './tugboat.config.js';
    const configFile = fs.readFileSync(configPath, 'utf8');
    const config = eval(configFile);

    // Set the swapSourceAndDestination option based on your requirement
    const swapSourceAndDestination = true;

    // Return the configuration object with the updated option
    return {
      ...config,
      swapSourceAndDestination,
    };
  } catch (error) {
    console.error('Error reading tugboat.config.js:', error);
    return null;
  }
}
