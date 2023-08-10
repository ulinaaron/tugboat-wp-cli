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

module.exports = { removeExtraSpaces };
