//public\electron\helpers\fileHelper.js
const fs = require('fs');
const path = require('path');
const os = require('os');
const { CACHE_DIR } = require('../constants/paths');

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

function cacheFile(originalPath) {
  const ext = path.extname(originalPath);
  const base = path.basename(originalPath, ext);
  const uniqueName = `${base}_${Date.now()}${ext}`;
  const cachedPath = path.join(CACHE_DIR, uniqueName);
  fs.copyFileSync(originalPath, cachedPath);
  return cachedPath;
}

module.exports = { cacheFile };
