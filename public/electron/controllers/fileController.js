//public\electron\controllers\fileController.js
const { dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const { SECRET_PATH } = require('../constants/paths');
const { cacheFile } = require('../helpers/fileHelper');
// const { cacheFile } = require('../helpers/fileHelper');
// const { SECRET_PATH } = require('../constants/paths');

async function handleSelectFiles() {
  const result = await dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'Documents', extensions: ['pdf', 'doc', 'docx'] }],
  });

  if (result.canceled || result.filePaths.length === 0) return [];

  const files = result.filePaths.map((filePath) => {
    const cachedPath = cacheFile(filePath);
    return {
      name: path.basename(filePath),
      path: cachedPath,
      originalPath: filePath,
      ext: path.extname(filePath).toLowerCase(),
    };
  });

  let existing = [];
  if (fs.existsSync(SECRET_PATH)) {
    try {
      existing = JSON.parse(fs.readFileSync(SECRET_PATH));
    } catch {}
  }

  const updated = [...existing, ...files];
  fs.writeFileSync(SECRET_PATH, JSON.stringify(updated, null, 2));

  return files;
}

async function handleGetStoredFiles() {
  if (!fs.existsSync(SECRET_PATH)) return [];
  const data = fs.readFileSync(SECRET_PATH);
  return JSON.parse(data);
}

module.exports = { handleSelectFiles, handleGetStoredFiles };
