const colors = require('colors/safe');

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
      if (logLevelsPriority[logLevel] > logLevelsPriority.info) return;
      console.log(colors.cyan(`[INFO] ${moduleName}:`), ...args);
    },
    warn: (...args) => {
      if (logLevelsPriority[logLevel] > logLevelsPriority.warn) return;
      console.log(colors.yellow(`[WARN] ${moduleName}:`), ...args);
    },
    error: (...args) => console.error(colors.red(`[ERROR] ${moduleName}:`), ...args),
  };
};

module.exports = logger;
