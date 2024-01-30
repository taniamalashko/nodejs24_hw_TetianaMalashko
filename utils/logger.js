const logger = (moduleName) => {
  return {
    info: (...args) => console.log('[INFO] ${moduleName}: ', ...args),
    warn: (...args) => console.log('[WARN] ${moduleName}: ', ...args),
    error: (...args) => console.log('[ERROR] ${moduleName}: ', ...args),
  }
}

module.exports = logger;
