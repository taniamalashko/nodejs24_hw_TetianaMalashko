const logger = (moduleName) => {
  return {
    info: (message) => console.log(`[INFO] ${moduleName}: ${message}`),
    warn: (message) => console.log(`[WARN] ${moduleName}: ${message}`),
    error: (message) => console.log(`[ERROR] ${moduleName}: ${message}`),
  }
}

module.exports = logger;
