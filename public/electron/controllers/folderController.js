//public\electron\controllers\folderController.js
const { dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { cacheFile } = require('../helpers/fileHelper');
const { SECRET_PATH } = require('../constants/paths');

async function handleSelectFolder() {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory', 'openFile', 'multiSelections'],
  });

  if (result.canceled || result.filePaths.length === 0) return [];

  const folderPath = result.filePaths[0];

  const files = fs.readdirSync(folderPath)
    .filter(file => ['.pdf', '.doc', '.docx'].includes(path.extname(file).toLowerCase()))
    .map((file) => {
      const fullPath = path.join(folderPath, file);
      const cachedPath = cacheFile(fullPath);
      return {
        name: file,
        path: cachedPath,
        originalPath: fullPath,
        ext: path.extname(file).toLowerCase(),
      };
    });

  fs.writeFileSync(SECRET_PATH, JSON.stringify(files, null, 2));

  return files;
}

module.exports = { handleSelectFolder };
