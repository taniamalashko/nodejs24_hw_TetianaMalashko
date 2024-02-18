const colors = require('colors/safe');
const fs = require('fs');
const path = require('path');

const getCurrentDateTime = () => {
  return new Date().toISOString();
};

const logsDir = path.join(__dirname, '..', 'logs');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const infoStream = fs.createWriteStream(path.join(logsDir, 'info.log'), { flags: 'a' });
const errorStream = fs.createWriteStream(path.join(logsDir, 'errors.log'), { flags: 'a' });

process.once("beforeExit", () => {
  infoStream.end();
  errorStream.end();
});

const logger = (moduleName, options) => {
  const { colorsEnabled, logLevel } = options;

  if (!colorsEnabled) {
    colors.disable();
  }

  const logLevelsPriority = {
    info: 0,
    warn: 1,
    error: 2,
  };

  return {
    info: (...args) => {
      const currentDateTime = getCurrentDateTime();
      infoStream.write(`${currentDateTime} ${moduleName}: ${args.join(' ')}\n`);
      if (logLevelsPriority[logLevel] <= logLevelsPriority.info) {
        const message = `${colors.cyan('[INFO]', moduleName)}: ${args.join(' ')}`;
        console.log(message);
      }
    },
    warn: (...args) => {
      const currentDateTime = getCurrentDateTime();
      errorStream.write(`${currentDateTime} ${moduleName}: ${args.join(' ')}\n`);
      if (logLevelsPriority[logLevel] <= logLevelsPriority.warn) {
        const message = `${colors.yellow('[WARN]', moduleName)}: ${args.join(' ')}\n`;
        console.log(message);
      }
    },
    error: (...args) => {
      const currentDateTime = getCurrentDateTime();
      const message = `${colors.red('[ERROR]', moduleName)}: ${args.join(' ')}\n`;
      errorStream.write(`${currentDateTime} ${moduleName}: ${args.join(' ')}\n`);
      console.error(message);
    }
  };
};

module.exports = logger;
