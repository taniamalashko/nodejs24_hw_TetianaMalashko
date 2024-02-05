module.exports = {
  logger: {
    colorsEnabled: process.env.COLORS_ENABLED === '1',
    logLevel: process.env.LOG_LEVEL || 'warn',
  }
}
