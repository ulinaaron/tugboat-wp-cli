const { execSync } = require('child_process');

function exportDatabase(exportFilePath) {
  try {
    execSync(`wp db export ${exportFilePath}`);
    console.log(`Database exported successfully to ${exportFilePath}`);
  } catch (error) {
    console.error('Error exporting the database:', error);
  }
}

function importDatabase(importFilePath) {
  try {
    execSync(`wp db import ${importFilePath}`);
    console.log(`Database imported successfully from ${importFilePath}`);
  } catch (error) {
    console.error('Error importing the database:', error);
  }
}

module.exports = {
  exportDatabase,
  importDatabase
};
