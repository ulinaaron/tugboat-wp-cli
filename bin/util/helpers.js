const fs = require('fs');
const replace = require('replacestream');


/**
 * Retrieves the version number of the package.
 *
 * @return {string} The version number of the package. If not found, returns '0.0.0'.
 */
function getVersion() {
  const packageJson = require('../../package.json');
  const { version } = packageJson;
  return version || '0.0.0';
}

/**
 * Removes extra spaces from a script.
 *
 * @param {string} script - The script to remove extra spaces from.
 * @return {string} The script with extra spaces removed.
 */
function removeExtraSpaces(script) {
  // Split the script by spaces
  const scriptParts = script.split(' ');

  // Remove any empty parts and trim leading/trailing spaces from each part
  const filteredParts = scriptParts
    .filter((part) => part.trim() !== '')
    .map((part) => part.trim());

  // Join the filtered parts back into a single string
  const filteredScript = filteredParts.join(' ');

  return filteredScript;
}

/**
 * Adds a trailing slash to the given file path if it doesn't already have one and doesn't include a file extension.
 *
 * @param {string} filePath - The file path to add a trailing slash to.
 * @return {string} The file path with a trailing slash added if necessary.
 */
function addTrailingSlash(filePath) {
  if (!filePath.endsWith('/') && !filePath.includes('.')) {
    filePath += '/';
  }
  return filePath;
}

async function waitForFile(filepath, timeout = 5000) {
  let start = Date.now();

  while((Date.now() - start) < timeout) {
    try {
      await fs.promises.access(filepath);
      return true;
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  throw new Error(`File at ${filepath} did not exist after ${timeout}ms`);
}


async function replacePrefixInFile(filePath, oldPrefix, newPrefix) {
  try {
    const readStream = fs.createReadStream(filePath);
    const writeStream = fs.createWriteStream(`${filePath}.tmp`);

    readStream
      .pipe(replace(oldPrefix, newPrefix))
      .pipe(writeStream);

    writeStream.on('finish', async () => {
      await fs.promises.rename(`${filePath}.tmp`, filePath);
      // console.log('Table prefixes replaced in file: ' + filePath);
    });

  } catch (error) {
    console.error('An error occurred while replacing table prefixes in file: ' + filePath , error);
  }
}

module.exports = { getVersion, removeExtraSpaces, addTrailingSlash, waitForFile, replacePrefixInFile };
