const http = require("http");
const config = require('config');
const logger = require("./utils/logger")("server", config.logger);

const server = http.createServer();
const HEALTHCHECK_EP = `/healthcheck`;
const PORT = 3000;
const METHODS = {
  GET: 'GET',
};

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.on('request', (req, res) => {
  const { method, url } = req;

  if (url === HEALTHCHECK_EP && method === METHODS.GET) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('healthcheck passed');
    logger.info(`${method} ${url} 200`);
    return
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });

  res.end('Not Found');

  logger.warn(`${method} ${url} 404`);
});
