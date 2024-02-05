const config = require('config');
const logger = require('./utils/logger')('File_Sync', config.logger);
const fsAsync = require('fs/promises');
const path = require('path');

const readFile = async(filePath) => {
  try {
    const content = await fsAsync.readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    logger.warn(`Can not read the file: ${filePath}: ${error.message}`);
  }
}

const writeFile = async(filePath, content) => {
  try {
    await fsAsync.writeFile(filePath, content);
    logger.info(`Content was writed to ${filePath}`);
  } catch (error) {
    logger.warn(`Error writing file to ${filePath}: ${error.message}`);
  }
}

const asyncFileCopy = async(filePath, targetPath) => {
  try {
    const content = await readFile(filePath);
    await writeFile(targetPath, content);
  } catch (error) {
    logger.warn(`${filePath} already exists in ${targetPath}`);
  }
}

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
