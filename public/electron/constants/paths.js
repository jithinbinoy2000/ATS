//public\electron\constants\paths.js
const path = require('path');
const os = require('os');

const SECRET_PATH = path.join(os.homedir(), '.ats_secret_files.json');
const CACHE_DIR = path.join(os.homedir(), '.ats_file_cache');

module.exports = { SECRET_PATH, CACHE_DIR };
