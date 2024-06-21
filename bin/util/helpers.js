const fs = require("fs");
const replace = require("replacestream");
const { once } = require("events");

/**
 * Retrieves the version number of the package.
 *
 * @return {string} The version number of the package. If not found, returns '0.0.0'.
 */
function getVersion() {
  const packageJson = require("../../package.json");
  const { version } = packageJson;
  return version || "0.0.0";
}

/**
 * Removes extra spaces from a script.
 *
 * @param {string} script - The script to remove extra spaces from.
 * @return {string} The script with extra spaces removed.
 */
function removeExtraSpaces(script) {
  // Split the script by spaces
  const scriptParts = script.split(" ");

  // Remove any empty parts and trim leading/trailing spaces from each part
  const filteredParts = scriptParts
    .filter((part) => part.trim() !== "")
    .map((part) => part.trim());

  // Join the filtered parts back into a single string
  const filteredScript = filteredParts.join(" ");

  return filteredScript;
}

/**
 * Adds a trailing slash to the given file path if it doesn't already have one and doesn't include a file extension.
 *
 * @param {string} filePath - The file path to add a trailing slash to.
 * @return {string} The file path with a trailing slash added if necessary.
 */
function addTrailingSlash(filePath) {
  if (!filePath.endsWith("/") && !filePath.includes(".")) {
    filePath += "/";
  }
  return filePath;
}

/**
 * Encodes the given URL by removing trailing slash and encoding URI components.
 * Additionally, certain characters are replaced to match SQL encoding.
 *
 * @param {string} url - The URL to be encoded.
 * @returns {string} - The encoded URL.
 */
function encodeUrlForSql(url) {
  // remove trailing slash if it exists
  if (url[url.length - 1] === "/") {
    url = url.slice(0, -1);
  }

  // encode URI components and replace certain characters to match SQL encoding
  return encodeURIComponent(url).replace(/\./g, "\\.").replace(/\//g, "\\/");
}

/**
 * Waits for a file to exist at the given filepath.
 *
 * @param {string} filepath - The path of the file to wait for.
 * @param {number} [timeout=5000] - The maximum time in milliseconds to wait for the file to exist. Defaults to 5000ms.
 * @throws {Error} Thrown if the file does not exist after the specified timeout.
 * @returns {Promise<boolean>} A Promise that resolves to true if the file exists within the specified timeout, otherwise rejects with an error.
 */
async function waitForFile(filepath, timeout = 5000) {
  let start = Date.now();

  while (Date.now() - start < timeout) {
    try {
      await fs.promises.access(filepath);
      return true;
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  throw new Error(`File at ${filepath} did not exist after ${timeout}ms`);
}

/**
 * Replaces a prefix in a file with a new prefix.
 *
 * @param {string} filePath - The file path of the file to modify.
 * @param {string} oldPrefix - The prefix to be replaced.
 * @param {string} newPrefix - The new prefix to replace with.
 *
 * @return {undefined} - This function does not return a value.
 *
 * @throws {Error} - If an error occurs while replacing the prefixes in the file.
 */
async function replacePrefixInFile(filePath, oldPrefix, newPrefix) {
  try {
    const readStream = fs.createReadStream(filePath);
    const writeStream = fs.createWriteStream(`${filePath}.tmp`);

    readStream.pipe(replace(oldPrefix, newPrefix)).pipe(writeStream);

    writeStream.on("finish", async () => {
      await fs.promises.rename(`${filePath}.tmp`, filePath);
      // console.log('Table prefixes replaced in file: ' + filePath);
    });
  } catch (error) {
    console.error(
      "An error occurred while replacing table prefixes in file: " + filePath,
      error,
    );
  }
}

/**
 * Replaces multiple strings in a file.
 *
 * @param {string} filePath - The file path of the file to modify.
 * @param {Array<{old: string, new: string}>} replacements - An array of objects with 'old' and 'new' properties
 *                                                          representing the strings to be replaced and the ones to replace with.
 *
 * @return {undefined} - This function does not return a value.
 *
 * @throws {Error} - If an error occurs while replacing.
 */
async function multiReplaceInFile(filePath, replacements) {
  try {
    const readStream = fs.createReadStream(filePath);
    const writeStream = fs.createWriteStream(`${filePath}.tmp`);

    let stream = readStream;

    replacements.forEach((replacement) => {
      stream = stream.pipe(replace(replacement.old, replacement.new));
    });

    stream.pipe(writeStream);

    await once(writeStream, "finish");

    await fs.promises.rename(`${filePath}.tmp`, filePath);
    console.log("Replacement done in file: " + filePath);
  } catch (error) {
    console.error(
      "An error occurred while replacing in file: " + filePath,
      error,
    );
  }
}

module.exports = {
  getVersion,
  removeExtraSpaces,
  addTrailingSlash,
  encodeUrlForSql,
  waitForFile,
  multiReplaceInFile,
  replacePrefixInFile,
};
