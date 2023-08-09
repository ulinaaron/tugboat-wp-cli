function getVersion() {
  const packageJson = require('../../package.json');
  const { version } = packageJson;
  return version || '0.0.0';
}

module.exports = getVersion;
