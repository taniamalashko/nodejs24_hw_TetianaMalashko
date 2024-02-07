const config = require('config');
const logger = require('./utils/logger')('File_Sync', config.logger);
const fsAsync = require('fs/promises');
const path = require('path');

const asyncFileCopy = async (sourcePath, targetPath) => {
  try {
    await fsAsync.access(targetPath);
    logger.warn(`File ${sourcePath} already exists in ${targetPath}`);
    return;
  } catch (error) {
    if (error.code !== 'ENOENT') {
      logger.warn(`Error accessing target file ${targetPath}: ${error.message}`);
      return;
    }
  }

  try {
    await fsAsync.copyFile(sourcePath, targetPath);
    logger.info(`File ${sourcePath} copied to ${targetPath}`);
  } catch (copyError) {
    logger.warn(`Error copying file ${sourcePath} to ${targetPath}: ${copyError.message}`);
  }
};

const asyncDirectoryCopy = async(sourceDir, targetDir) => {
  const filesInDir = await fsAsync.readdir(sourceDir);

  for (const file of filesInDir) {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);

    const stat = await fsAsync.stat(sourcePath);

    if (stat.isDirectory()) {
      await fsAsync.mkdir(targetPath, { recursive: true });
      await asyncDirectoryCopy(sourcePath, targetPath);
    } else if (stat.isFile()) {
      await asyncFileCopy(sourcePath, targetPath);
    }

  }
}

const start = async() => {
  const sourcePath = path.join(__dirname, 'source');
  const targetPath = path.join(__dirname, 'target');

  await asyncDirectoryCopy(sourcePath, targetPath);
}

module.exports = { start };
